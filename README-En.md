## English Version
# VoicePitch - AI Voice Generator & Interview Practice

VoicePitch is a modern, responsive web application designed for text-to-speech audio generation and structured job interview preparation. It converts written text into natural-sounding downloadable MP3 files and provides dedicated interview practice workflows.

---

### 1. Overview

VoicePitch enables users to convert text, elevator pitches, and dialogue scripts into high-quality MP3 audio files. The application intelligently detects interview questions and answers, generates structured scripts, and provides practice modes to help candidates improve pronunciation, fluency, and spoken confidence in multiple languages.

### 2. Core Features

#### Text-to-Speech Studio
- Converts plain text, dialogues, and interview scripts into playable and downloadable MP3 files.
- Real-time character counter, word counter, and estimated audio duration display.
- Intelligent automatic detection of question-and-answer pairs within any pasted text.
- Waveform visualization, interactive scrubber, playback rate controls (0.8x to 1.5x), volume adjustment, and mute toggle.
- Direct export to MP3 (128 kbps or 192 kbps) and lossless master WAV formats.
- Segmented processing to support longer texts.

#### Interview Practice Mode (7 Modes)
1. **Full Interview:** Plays interviewer questions and candidate answers in sequence with realistic conversational pacing.
2. **Question and Answer:** Immediate on-demand playback of individual question or answer cards.
3. **Question Only (Speaking Practice):** Plays the interviewer question followed by a configurable silent timer (5s, 10s, 15s, 20s, 30s) so the user can practice speaking aloud before reviewing the answer.
4. **Answer Only:** Plays only candidate answers to focus on accent, cadence, and fluency.
5. **Listening Practice:** Hides answer text until revealed by the user, strengthening listening comprehension.
6. **Repeat Practice:** Repeats a question or answer multiple times (1x, 2x, 3x) for audio shadowing and memorization.
7. **Custom Practice:** Allows users to select specific questions and answers to include in the active practice session.

#### Languages and Regional Accents
The application supports multiple languages and regional accents:
- Portuguese: Portuguese (Brazil) and Portuguese (Portugal)
- English: American English (US) and British English (UK)
- French
- Italian
- Spanish
- German

The user interface language and voice audio accents can be configured independently.

#### Audio Library and Project Management
- Projects are saved locally in the browser.
- Includes metadata such as title, script content, language, voice, duration, and creation date.
- Dedicated controls to replay, download, and delete saved files.

#### High-Availability Speech Architecture
- Primary engine: Studio Neural Speech powered by Gemini 3.8 Flash TTS.
- High-availability fallback engine: Automatically handles audio synthesis if external API quotas or rate limits occur.
- Silent audio generator: Produces genuine silent MP3 frames for custom interview pauses between conversation turns.

### 3. Tech Stack

- Frontend: React 19, TypeScript, Tailwind CSS, Lucide icons
- Backend: Node.js, Express, tsx
- Speech Synthesis: Google GenAI SDK (Gemini 3.8 Flash TTS) with automated multilingual fallback
- Audio Encoding: Pure JavaScript MP3 and WAV encoders

### 4. Local Setup and Installation

#### Prerequisites
- Node.js (v18, v20, or higher)
- Optional: Gemini API Key from Google AI Studio

#### Step 1: Install Dependencies
```bash
npm install
```

#### Step 2: Configure Environment Variables
Copy the example configuration:
```bash
cp .env.example .env
```

Edit `.env` as needed:
```env
GEMINI_API_KEY="YOUR_API_KEY_HERE"
PORT=3000
```
Note: If no API key is specified or if quota limits are exceeded, the built-in fallback engine provides continuous audio generation.

#### Step 3: Start Development Server
```bash
npm run dev
```

Open your browser at:
`http://localhost:3000`

### 5. Available Scripts

- `npm run dev`: Starts the full-stack development server on port 3000.
- `npm run build`: Compiles and bundles the frontend into the `dist/` folder.
- `npm start`: Starts the production server using `node server.ts`.
- `npm run lint`: Runs TypeScript validation checks (`tsc --noEmit`).