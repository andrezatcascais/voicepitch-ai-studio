
### Versao em Portugues

### 1. Visao Geral

O VoicePitch permite converter textos, apresentacoes profissionais e roteiros de dialogo em arquivos de audio MP3 de alta qualidade. A aplicacao identifica automaticamente perguntas e respostas de entrevistas, organiza o conteudo em roteiros estruturados e oferece modos de treino para ajudar candidatos a aprimorar pronuncia, ritmo e confianca ao falar em diferentes idiomas.

### 2. Principais Funcionalidades

#### Estudio de Conversao de Texto em Fala (TTS)
- Converte textos gerais, dialogos e roteiros de entrevista em arquivos MP3 para escuta e download direto.
- Contadores em tempo real de caracteres, palavras e duracao estimada do audio.
- Deteccao automatica de pares de perguntas e respostas em qualquer texto inserido.
- Visualizador de ondas sonoras, barra interativa de reproducao, controle de velocidade (0.8x a 1.5x), controle de volume e opcao de mudo.
- Exportacao em MP3 (128 kbps ou 192 kbps) e formato master WAV sem perdas.
- Divisao e processamento de textos longos em segmentos gerenciáveis.

#### Modo de Treino para Entrevistas (7 Modos)
1. **Entrevista Completa:** Reproduz a pergunta do entrevistador e a resposta do candidato sequencialmente com intervalos naturais.
2. **Pergunta e Resposta:** Reproducao sob demanda de cartoes individuais de perguntas ou respostas.
3. **Apenas Perguntas (Pratica de Fala):** Reproduz a pergunta e ativa uma pausa silenciosa configuravel (5s, 10s, 15s, 20s, 30s) para que o usuario responda em voz alta antes de ouvir o modelo.
4. **Apenas Respostas:** Reproduz exclusivamente as respostas do candidato para aperfeicoamento de cadencia e pronuncia.
5. **Treino de Compreensao Auditiva (Listening):** Oculta o texto da resposta ate o usuario solicitar a revelacao, testando a compreensao do audio.
6. **Repeticao (Shadowing):** Repete uma pergunta ou resposta selecionada (1x, 2x ou 3x) para memorizacao e treino de entonacao.
7. **Pratica Personalizada:** Permite selecionar quais perguntas e respostas especificas farao parte da sessao ativa.

#### Idiomas e Sotaques Regionais
Suporte completo a multiplos idiomas e variacoes regionais:
- Portugues: Portugues do Brasil e Portugues de Portugal
- Ingles: Ingles Americano (EUA) e Ingles Britanico (Reino Unido)
- Frances
- Italiano
- Espanhol
- Alemao

O idioma da interface do usuario e os sotaques das vozes podem ser definidos de maneira independente.

#### Biblioteca de Audios e Gestao de Projetos
- Armazenamento local dos projetos no navegador do usuario.
- Registro de metadados como titulo, texto original, idioma, voz utilizada, duracao e data de criacao.
- Controles dedicados para ouvir novamente, baixar o arquivo MP3 e excluir itens salvos.

#### Arquitetura de Audio de Alta Disponibilidade
- Motor principal: Sintese neural de voz com Gemini 3.8 Flash TTS.
- Motor de contingencia de alta disponibilidade: Continua gerando audio mesmo em casos de limite de cota da API externa.
- Gerador de silencio: Cria quadros MP3 com silencio real para pausas entre perguntas e respostas.

### 3. Tecnologias Utilizadas

- Frontend: React 19, TypeScript, Tailwind CSS, icones Lucide
- Backend: Node.js, Express, tsx
- Sintese de Voz: Google GenAI SDK (Gemini 3.8 Flash TTS) com contingencia multilingue integrada
- Codificacao de Audio: Codificadores puros em JavaScript para geracao de MP3 e WAV

### 4. Instalacao e Execucao Local

#### Pre-requisitos
- Node.js (versao 18, 20 ou superior)
- Opcional: Chave de API do Gemini obtida no Google AI Studio

#### Passo 1: Instalar Dependencias
```bash
npm install
```

#### Passo 2: Configurar Variaveis de Ambiente
Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
GEMINI_API_KEY="SUA_CHAVE_AQUI"
PORT=3000
```
Observacao: Caso a chave nao seja informada ou os limites da cota sejam atingidos, o motor de contingencia garante a geracao de audio sem interrupcoes.

#### Passo 3: Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

Acesse a aplicacao no navegador:
`http://localhost:3000`

### 5. Comandos Disponiveis

- `npm run dev`: Inicia o servidor de desenvolvimento full-stack na porta 3000.
- `npm run build`: Compila e gera o build de producao do frontend na pasta `dist/`.
- `npm start`: Inicia o servidor em modo de execucao padrao.
- `npm run lint`: Executa a verificacao de tipos com o compilador TypeScript (`tsc --noEmit`).
