import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { Mp3Encoder } from '@breezystack/lamejs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

// Helper to convert unary Gemini WAV (24kHz, 16-bit mono) to MP3
export function wavToMp3(wavBuffer: Buffer, kbps: number = 128): Buffer {
  let pos = 12;
  let sampleRate = 24000;
  let numChannels = 1;
  let pcmDataOffset = 44;
  let pcmLength = wavBuffer.length - 44;

  while (pos < wavBuffer.length - 8) {
    const chunkId = wavBuffer.toString('ascii', pos, pos + 4);
    const chunkSize = wavBuffer.readUInt32LE(pos + 4);
    if (chunkId === 'fmt ') {
      numChannels = wavBuffer.readUInt16LE(pos + 10);
      sampleRate = wavBuffer.readUInt32LE(pos + 12);
    } else if (chunkId === 'data') {
      pcmDataOffset = pos + 8;
      pcmLength = chunkSize;
      break;
    }
    pos += 8 + chunkSize;
  }

  const pcmBytes = wavBuffer.subarray(pcmDataOffset, Math.min(wavBuffer.length, pcmDataOffset + pcmLength));
  const samples = new Int16Array(
    pcmBytes.buffer,
    pcmBytes.byteOffset,
    Math.floor(pcmBytes.length / 2)
  );

  const mp3encoder = new Mp3Encoder(numChannels, sampleRate, kbps);
  const mp3Data: Buffer[] = [];
  const chunkSize = 1152;

  for (let i = 0; i < samples.length; i += chunkSize) {
    const chunk = samples.subarray(i, i + chunkSize);
    const mp3buf = mp3encoder.encodeBuffer(chunk);
    if (mp3buf.length > 0) {
      mp3Data.push(Buffer.from(mp3buf));
    }
  }

  const endBuf = mp3encoder.flush();
  if (endBuf.length > 0) {
    mp3Data.push(Buffer.from(endBuf));
  }

  return Buffer.concat(mp3Data);
}

// Generate silent MP3 frames for interview pauses
export function generateSilenceMp3(seconds: number, sampleRate = 24000, kbps = 128): Buffer {
  if (seconds <= 0) return Buffer.alloc(0);
  const enc = new Mp3Encoder(1, sampleRate, kbps);
  const totalSamples = Math.floor(sampleRate * Math.min(seconds, 30));
  const silenceSamples = new Int16Array(totalSamples);
  const chunks: Buffer[] = [];
  const chunkSize = 1152;

  for (let i = 0; i < silenceSamples.length; i += chunkSize) {
    const chunk = silenceSamples.subarray(i, i + chunkSize);
    const buf = enc.encodeBuffer(chunk);
    if (buf.length > 0) chunks.push(Buffer.from(buf));
  }
  const endBuf = enc.flush();
  if (endBuf.length > 0) chunks.push(Buffer.from(endBuf));
  return Buffer.concat(chunks);
}

// Language code to fallback translation tag
function mapLangToTag(lang?: string): string {
  if (!lang) return 'en';
  const l = lang.toLowerCase();
  if (l.includes('pt-pt') || l.includes('portugal')) return 'pt-pt';
  if (l.includes('pt') || l.includes('br')) return 'pt';
  if (l.includes('gb') || l.includes('uk')) return 'en-gb';
  if (l.includes('fr')) return 'fr';
  if (l.includes('it')) return 'it';
  if (l.includes('es')) return 'es';
  if (l.includes('de')) return 'de';
  return 'en';
}

// High-availability multilingual fallback TTS engine
export async function fetchTtsFallback(text: string, language: string = 'en-US'): Promise<Buffer> {
  const lang = mapLangToTag(language);

  const sentences = text.match(/[^.!?\n]+[.!?\n]*/g) || [text];
  const chunks: string[] = [];
  let current = '';

  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    if ((current + ' ' + trimmed).length > 140) {
      if (current) chunks.push(current.trim());
      current = trimmed;
    } else {
      current = current ? current + ' ' + trimmed : trimmed;
    }
  }
  if (current) chunks.push(current.trim());

  const buffers: Buffer[] = [];
  for (const chunk of chunks) {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${lang}&client=tw-ob`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    if (!res.ok) {
      throw new Error(`Fallback TTS failed with status ${res.status}`);
    }
    const ab = await res.arrayBuffer();
    buffers.push(Buffer.from(ab));
  }

  return Buffer.concat(buffers);
}

// Gemini Client initialization
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Multi-tier speech generation
async function generateSpeechAudio(
  text: string,
  voice: string = 'Fenrir',
  style: string = 'Confident, professional job interview',
  language: string = 'en-US',
  bitrate: number = 128
) {
  // Map friendly voice names to valid Gemini prebuilt voices if possible
  const geminiVoices = ['Fenrir', 'Puck', 'Charon', 'Kore', 'Zephyr'];
  const geminiVoice = geminiVoices.find(v => v.toLowerCase() === voice.toLowerCase()) || 'Fenrir';

  // Build style instruction with accent requirement
  let styleInstruction = style;
  if (language === 'pt-BR' || language.toLowerCase().includes('br')) {
    styleInstruction = `${style}, spoken clearly in Brazilian Portuguese (Português do Brasil)`;
  } else if (language === 'pt-PT' || language.toLowerCase().includes('pt')) {
    styleInstruction = `${style}, spoken clearly in European Portuguese (Português de Portugal)`;
  } else if (language.includes('GB') || language.toLowerCase().includes('uk')) {
    styleInstruction = `${style}, with a refined British English accent`;
  } else if (language.includes('fr')) {
    styleInstruction = `${style}, spoken clearly in French`;
  } else if (language.includes('it')) {
    styleInstruction = `${style}, spoken clearly in Italian`;
  } else if (language.includes('es')) {
    styleInstruction = `${style}, spoken clearly in Spanish`;
  } else if (language.includes('de')) {
    styleInstruction = `${style}, spoken clearly in German`;
  }

  // Tier 1: Try gemini-3.8-flash-lite-tts
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text.trim(),
                speechMetadata: {
                  style: styleInstruction,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: geminiVoice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const wavBuf = Buffer.from(base64Audio, 'base64');
        const mp3Buf = wavToMp3(wavBuf, Number(bitrate) || 128);
        const durationSec = Math.round((wavBuf.length - 44) / (24000 * 2) * 10) / 10;
        return {
          engine: 'Gemini 3.8 Flash Lite TTS',
          voice,
          mp3Buf,
          wavBuf,
          durationSec,
          isFallback: false,
        };
      }
    } catch (err: any) {
      console.warn('Gemini 3.8 Flash Lite TTS error:', err?.message || err);
    }

    // Tier 2: Try gemini-3.8-flash-tts
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text.trim(),
                speechMetadata: {
                  style: styleInstruction,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: geminiVoice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const wavBuf = Buffer.from(base64Audio, 'base64');
        const mp3Buf = wavToMp3(wavBuf, Number(bitrate) || 128);
        const durationSec = Math.round((wavBuf.length - 44) / (24000 * 2) * 10) / 10;
        return {
          engine: 'Gemini 3.8 Flash TTS',
          voice,
          mp3Buf,
          wavBuf,
          durationSec,
          isFallback: false,
        };
      }
    } catch (err: any) {
      console.warn('Gemini 3.8 Flash TTS error:', err?.message || err);
    }
  }

  // Tier 3: Multilingual Fallback
  console.log(`Generating via fallback engine (${language})...`);
  const mp3Buf = await fetchTtsFallback(text.trim(), language);
  const words = text.trim().split(/\s+/).length;
  const durationSec = Math.round((words / 2.5) * 10) / 10;

  return {
    engine: 'Multilingual High-Availability TTS',
    voice,
    mp3Buf,
    wavBuf: null,
    durationSec,
    isFallback: true,
  };
}

// 1. Single Text-to-Speech Generation Endpoint
app.post('/api/tts/generate', async (req, res) => {
  try {
    const {
      text,
      voice = 'Fenrir',
      style = 'Confident, articulate, professional software engineer presenting during a job interview',
      language = 'en-US',
      bitrate = 128,
      filename = 'voicepitch_audio.mp3',
    } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text prompt is required' });
    }

    const result = await generateSpeechAudio(text, voice, style, language, Number(bitrate) || 128);

    return res.json({
      success: true,
      mp3Base64: result.mp3Buf.toString('base64'),
      wavBase64: result.wavBuf ? result.wavBuf.toString('base64') : null,
      mimeType: 'audio/mpeg',
      durationSec: result.durationSec,
      voice: result.voice,
      mp3Size: result.mp3Buf.length,
      wavSize: result.wavBuf ? result.wavBuf.length : null,
      engine: result.engine,
      isFallback: result.isFallback,
      filename: filename.endsWith('.mp3') ? filename : `${filename}.mp3`,
      message: result.isFallback
        ? `Áudio .MP3 gerado com sucesso via motor de contingência (${language})!`
        : `Áudio gerado com sucesso usando ${result.engine}!`,
    });
  } catch (error: any) {
    console.error('Error generating speech:', error);
    return res.status(500).json({
      error: error?.message || 'Internal server error while generating audio',
    });
  }
});

// 2. Full Interview Generator with Silence Padding & Multi-Role Voices
app.post('/api/tts/generate-interview', async (req, res) => {
  try {
    const {
      items = [],
      interviewerVoice = 'Kore',
      candidateVoice = 'Fenrir',
      language = 'en-US',
      pauseSeconds = 5,
      mode = 'full', // 'full' | 'qa' | 'question_only' | 'answer_only'
      bitrate = 128,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Interview items array is required' });
    }

    const mp3Segments: Buffer[] = [];
    const processedItems: any[] = [];
    let totalDuration = 0;

    const pauseBuffer = generateSilenceMp3(Number(pauseSeconds) || 5, 24000, Number(bitrate) || 128);
    const shortTurnPause = generateSilenceMp3(1.5, 24000, Number(bitrate) || 128);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let qMp3: Buffer | null = null;
      let aMp3: Buffer | null = null;

      // Question Audio
      if (mode !== 'answer_only' && item.question) {
        const qResult = await generateSpeechAudio(
          item.question,
          interviewerVoice,
          'Clear, professional interviewer inquiring about candidate qualifications',
          language,
          bitrate
        );
        qMp3 = qResult.mp3Buf;
        totalDuration += qResult.durationSec;
      }

      // Answer Audio
      if (mode !== 'question_only' && item.answer) {
        const aResult = await generateSpeechAudio(
          item.answer,
          candidateVoice,
          'Confident, articulate candidate delivering a strong job interview answer',
          language,
          bitrate
        );
        aMp3 = aResult.mp3Buf;
        totalDuration += aResult.durationSec;
      }

      // Assemble segment for this Q&A pair based on mode
      if (mode === 'full') {
        if (qMp3) {
          mp3Segments.push(qMp3);
          mp3Segments.push(shortTurnPause);
          totalDuration += 1.5;
        }
        if (aMp3) {
          mp3Segments.push(aMp3);
          if (i < items.length - 1) {
            mp3Segments.push(pauseBuffer);
            totalDuration += Number(pauseSeconds) || 5;
          }
        }
      } else if (mode === 'question_only') {
        if (qMp3) {
          mp3Segments.push(qMp3);
          if (i < items.length - 1) {
            mp3Segments.push(pauseBuffer);
            totalDuration += Number(pauseSeconds) || 5;
          }
        }
      } else if (mode === 'answer_only') {
        if (aMp3) {
          mp3Segments.push(aMp3);
          if (i < items.length - 1) {
            mp3Segments.push(shortTurnPause);
            totalDuration += 1.5;
          }
        }
      }

      processedItems.push({
        id: item.id,
        questionNumber: i + 1,
        question: item.question,
        answer: item.answer,
        questionMp3Base64: qMp3 ? qMp3.toString('base64') : null,
        answerMp3Base64: aMp3 ? aMp3.toString('base64') : null,
      });
    }

    const combinedMp3 = Buffer.concat(mp3Segments);

    return res.json({
      success: true,
      combinedMp3Base64: combinedMp3.toString('base64'),
      mimeType: 'audio/mpeg',
      totalDurationSec: Math.round(totalDuration * 10) / 10,
      totalSize: combinedMp3.length,
      items: processedItems,
      filename: mode === 'question_only' ? 'interview_questions_practice.mp3' : 'full_interview.mp3',
    });
  } catch (error: any) {
    console.error('Error generating interview session:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate interview audio' });
  }
});

// 3. Smart Interview Text Parser (Auto-detects Q&A structure)
app.post('/api/parse-interview', async (req, res) => {
  try {
    const { text = '' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Try Gemini intelligent structuring if available
    if (ai) {
      try {
        const prompt = `You are an expert technical recruiter and interview assistant. 
Analyze the following text and determine if it contains job interview questions, answers, elevator pitches, or dialogue.
If it does, parse it into structured Question & Answer items.
Return a clean JSON object with this schema:
{
  "isInterview": boolean,
  "title": string,
  "items": [
    {
      "questionNumber": number,
      "question": string,
      "answer": string,
      "category": "Technical" | "Behavioral" | "Leadership" | "Background",
      "pronunciationNotes": string
    }
  ]
}

Text to analyze:
${text}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const jsonStr = response.text?.trim();
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr);
          return res.json({
            success: true,
            isInterview: parsed.isInterview ?? true,
            title: parsed.title || 'Job Interview Practice Session',
            items: (parsed.items || []).map((it: any, idx: number) => ({
              id: `item-${Date.now()}-${idx + 1}`,
              questionNumber: it.questionNumber || idx + 1,
              question: it.question || `Question ${idx + 1}`,
              answer: it.answer || '',
              category: it.category || 'General',
              pronunciationNotes: it.pronunciationNotes || '',
              isSelected: true,
            })),
          });
        }
      } catch (geminiErr) {
        console.warn('Gemini parser fallback to regex:', geminiErr);
      }
    }

    // Heuristic NLP / Regex Fallback Parser
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const items: any[] = [];
    let currentQ = '';
    let currentA = '';
    let qCounter = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isQuestionLine = /^(q(?:uestion)?\s*\d*[:\.-]|\?|interviewer[:\.-]|pergunta\s*\d*[:\.-])/i.test(line) ||
        (line.endsWith('?') && line.length < 180);

      const isAnswerLine = /^(a(?:nswer)?\s*\d*[:\.-]|candidate[:\.-]|resposta\s*\d*[:\.-])/i.test(line);

      if (isQuestionLine) {
        if (currentQ && currentA) {
          items.push({
            id: `item-${Date.now()}-${qCounter}`,
            questionNumber: qCounter++,
            question: currentQ,
            answer: currentA,
            category: 'Technical',
            isSelected: true,
          });
          currentQ = '';
          currentA = '';
        }
        currentQ = line.replace(/^(q(?:uestion)?\s*\d*[:\.-]|interviewer[:\.-]|pergunta\s*\d*[:\.-])\s*/i, '');
      } else if (isAnswerLine) {
        currentA = line.replace(/^(a(?:nswer)?\s*\d*[:\.-]|candidate[:\.-]|resposta\s*\d*[:\.-])\s*/i, '');
      } else {
        if (currentQ && !currentA) {
          currentA = line;
        } else if (currentA) {
          currentA += `\n${line}`;
        } else {
          currentQ = line;
        }
      }
    }

    if (currentQ || currentA) {
      items.push({
        id: `item-${Date.now()}-${qCounter}`,
        questionNumber: qCounter,
        question: currentQ || 'Why should we hire you?',
        answer: currentA || currentQ,
        category: 'Background',
        isSelected: true,
      });
    }

    const hasInterviewCues = items.length > 0 && (items.length > 1 || text.includes('?') || /hire|experience|interview/i.test(text));

    return res.json({
      success: true,
      isInterview: hasInterviewCues,
      title: hasInterviewCues ? 'Job Interview Practice Script' : 'Speech Script',
      items,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to parse text' });
  }
});

// 4. Direct File Download Endpoint with Custom Content-Disposition
app.post('/api/tts/download', async (req, res) => {
  try {
    const {
      text,
      voice = 'Fenrir',
      format = 'mp3',
      filename = 'voicepitch_audio.mp3',
      language = 'en-US',
      style,
    } = req.body;

    if (!text) {
      return res.status(400).send('Text is required');
    }

    const result = await generateSpeechAudio(text, voice, style, language);
    const safeFilename = (filename || 'audio.mp3').replace(/[^a-zA-Z0-9_\-\.]/g, '_');

    if (format === 'wav' && result.wavBuf) {
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Content-Disposition', `attachment; filename="${safeFilename.replace(/\.mp3$/, '.wav')}"`);
      return res.send(result.wavBuf);
    } else {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Disposition', `attachment; filename="${safeFilename.endsWith('.mp3') ? safeFilename : safeFilename + '.mp3'}"`);
      return res.send(result.mp3Buf);
    }
  } catch (error: any) {
    console.error('Error in download:', error);
    return res.status(500).send(error?.message || 'Failed to download file');
  }
});

// Serve static pregenerated files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Server bootstrapping
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VoicePitch Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
