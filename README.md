# 🌾 KisanSaathi.ai

> **Your farm remembers.**

## Don't make farmers adapt to technology.
## Make technology adapt to farmers.

KisanSaathi is a **voice-first AI assistant for Indian farmers**, designed to make agricultural assistance easier to access through natural conversation.

Instead of asking farmers to navigate complicated applications, type queries, read technical information, or search across multiple sources, KisanSaathi allows them to simply **talk**.

### The idea is simple:

**Speak → Understand → Remember → Respond**

---

## 🎯 One-Sentence Claim

KisanSaathi makes agricultural assistance more accessible by allowing farmers to communicate naturally through voice while using farm context and memory to provide more relevant conversations.

---

# 🚜 The Problem

India has a large farming community, but access to digital agricultural technology can still be difficult.

The challenge is not simply that agricultural information is unavailable.

The challenge is **how that information is accessed**.

Many digital agricultural services require users to:

- Read text-heavy information
- Type questions
- Navigate multiple screens
- Understand technical terminology
- Search through different sources
- Enter farm information manually

For farmers who are more comfortable communicating through their everyday spoken language, these interfaces can become a barrier to accessing useful technology.

---

# 🌱 Problems Faced by Farmers & Our Solutions

## 1. 📱 Complex Digital Interfaces

Agricultural applications can require users to navigate menus, forms, dashboards, and multiple information sources.

### Our Solution

KisanSaathi uses a **voice-first interface**.

Instead of navigating through an application, a farmer can simply say:

> "Meri gehun ki fasal mein patte peele ho rahe hain."

The AI can then understand the request and respond conversationally.

---

## 2. 🗣️ Communication & Language Barriers

Agricultural information may be presented using technical terminology or text-heavy interfaces.

### Our Solution

KisanSaathi is designed around **natural conversational communication**.

A farmer can describe a problem in their everyday language rather than having to formulate a technical search query.

### Traditional

**Search → Type → Read → Understand**

### KisanSaathi

**Speak → Understand → Respond**

---

## 3. 🧠 Lack of Personalized Farm Context

Generic agricultural information does not always consider a farmer's individual situation.

Useful context may include:

- Crop
- Crop age
- Previous observations
- Irrigation history
- Previous conversations
- Farmer preferences

### Our Solution

KisanSaathi is designed to maintain useful farm context and retrieve relevant memories when they are needed.

This is where **Qdrant** plays an important role.

---

## 4. 🔁 Repeating the Same Information

Farmers may have to repeatedly explain their crop, previous problem, or farm situation during different interactions.

### Our Solution

KisanSaathi aims to avoid making every conversation start from zero.

Relevant information from previous interactions can be stored and retrieved when appropriate.

```text
Previous Conversation
        ↓
   Farm Memory
        ↓
      Qdrant
        ↓
Relevant Context Retrieved
        ↓
 Current Conversation
```

---

## 5. ⏱️ Difficulty Accessing Timely Information

Farming decisions can depend on information that is useful at a particular moment.

Examples include:

- Weather
- Irrigation
- Crop conditions
- Pest and disease information
- Farming practices

### Our Solution

KisanSaathi provides a conversational interface where farmers can ask questions directly instead of manually searching through different information sources.

Future versions can connect the agent with reliable agricultural and weather data sources.

---

## 6. ⏸️ Real Conversations Include Interruptions

Human conversations are not perfectly sequential.

A farmer may interrupt the assistant:

> "Ruko, ye mujhe already pata hai."

or:

> "Nahi, mera matlab kuch aur tha."

### Our Solution

KisanSaathi is designed around **conversational interruption and recovery**.

The farmer should be able to:

- Interrupt the AI
- Correct the AI
- Ask a follow-up
- Change the question
- Continue the conversation

This is an important part of making the system feel like a **voice agent rather than a chatbot with a microphone**.

---

# 💡 Our Approach

> **Don't make farmers adapt to technology.**  
> **Make technology adapt to farmers.**

KisanSaathi moves the complexity of AI, retrieval, memory, speech recognition, and voice generation behind the scenes.

For the farmer, the experience should simply feel like:

> **"I can talk to my Saathi."**

---

# 🎙️ Why Voice?

Voice is not an additional feature of KisanSaathi.

## Voice is the interface.

The product is designed around:

```text
Speak
  ↓
Listen
  ↓
Interrupt
  ↓
Continue
```

The farmer should not need to constantly stare at the screen to interact with the system.

---

# ✨ Core Features

## 🎙️ Voice-First AI Assistant

The main interface is a voice assistant.

The prototype focuses on these interaction states:

- Idle
- Listening
- Processing
- AI Speaking
- Interrupted

---

## 🧠 Farm Memory

KisanSaathi is designed to remember useful information from previous conversations.

Examples include:

- Crop information
- Crop age
- Farm context
- Previous observations
- Previous problems
- Farmer preferences

### The goal:

> **Never start from zero when useful context already exists.**

---

## 🌾 Context-Aware Conversations

Instead of treating every question as independent, KisanSaathi can use relevant farm context when generating a response.

The system aims to retrieve only the context relevant to the current interaction rather than overwhelming the AI with unnecessary information.

---

## ⏹️ Interruption Handling

The farmer can interrupt the AI while it is speaking.

The goal is to make the interaction behave more like a natural conversation.

```text
AI Speaking
    ↓
Farmer Interrupts
    ↓
New Input
    ↓
Conversation State Updates
    ↓
AI Responds
```

---

# 🏗️ Architecture

## KisanSaathi Voice Agent Architecture

```text
                         ┌──────────────────────┐
                         │       FARMER         │
                         │                      │
                         │   🎙️ Voice Input     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Speech-to-Text     │
                         │                      │
                         │  Voice → User Query  │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   KISANSAATHI AGENT  │
                         │                      │
                         │ Intent + Reasoning   │
                         │ Conversation State   │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
             ┌────────────┐  ┌────────────┐  ┌────────────┐
             │   QDRANT   │  │    FARM    │  │ EXTERNAL   │
             │            │  │  CONTEXT   │  │    DATA    │
             │ Memory &   │  │            │  │            │
             │ Retrieval  │  │ Crop etc.  │  │ Weather /  │
             └─────┬──────┘  └─────┬──────┘  │ Agriculture│
                   │               │          └─────┬──────┘
                   └───────────────┼────────────────┘
                                   │
                                   ▼
                         ┌──────────────────────┐
                         │    CONTEXT + QUERY   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     AI RESPONSE      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │        RIME          │
                         │                      │
                         │ AI Response →        │
                         │ Natural Speech       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       FARMER         │
                         │                      │
                         │    🔊 Voice Output   │
                         └──────────┬───────────┘
                                    │
                                    │ Interrupt / Continue
                                    ▼
                              Agent State
```

---

# 🧠 Qdrant's Role

Qdrant is intended to have a **meaningful role in KisanSaathi** rather than being included only as a technology requirement.

Qdrant can be used for:

- Farmer memory
- Farm context
- Previous observations
- Previous conversation information
- Relevant memory retrieval
- Contextual personalization

The retrieval process should ensure that only relevant information is brought into the current conversation.

### Example

#### Previous conversation:

> "Maine gehun boya hai."

#### Later:

> "Meri fasal ke patte peele ho rahe hain."

Instead of starting from zero, the agent can retrieve the relevant wheat-farm context.

---

# 🔊 Rime

Rime provides the spoken output for KisanSaathi.

Voice is an essential part of the primary interaction.

## Rime Configuration

| Parameter | Configuration |
|---|---|
| **Model** | Coda / Mist v3 |
| **Voice** | TBD |
| **Language** | Hindi / Hinglish / English |
| **Transport** | TBD |

> Configuration details will be updated as the final implementation is completed.

---

# 🔄 End-to-End Conversation Flow

```text
Farmer speaks
      ↓
Speech-to-Text
      ↓
KisanSaathi AI Agent
      ↓
Retrieve relevant farm memory
      ↓
Retrieve relevant context
      ↓
Generate response
      ↓
Rime TTS
      ↓
Farmer hears response
      ↓
Farmer can interrupt
      ↓
Agent updates conversation state
      ↓
Conversation continues
```

---

# 🧪 Proof & Evaluation

## Test 1 — Voice Interaction

### Input

Farmer speaks a farming-related question.

### Expected

KisanSaathi understands the request and responds through voice.

---

## Test 2 — Memory Retrieval

### Conversation 1

> "Maine gehun boya hai."

### Conversation 2

> "Meri fasal mein patte peele ho rahe hain."

### Expected

The agent retrieves the relevant previous farm context instead of treating the second conversation as completely new.

---

## Test 3 — Interruption

### AI

> "Aapki wheat crop 42 din ki hai..."

### Farmer

> "Ruko, woh main check kar chuka hoon."

### Expected

The assistant stops or updates its response and continues based on the new input.

---

# ⚙️ Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Voice

- Rime
- Speech-to-Text

### AI

- AI Agent / LLM

### Memory

- Qdrant

### External Data

- Weather APIs
- Agricultural data sources

---

# 📁 Project Structure

```text
kisansathi.ai/
│
├── src/
│   ├── api/
│   │   ├── memoryContext.ts
│   │   └── tts.ts
│   │
│   ├── components/
│   │   ├── AppShell.tsx
│   │   ├── FarmContextCard.tsx
│   │   ├── ProcessingContext.tsx
│   │   ├── QuickQuestionChips.tsx
│   │   ├── VoiceOrb.tsx
│   │   └── VoiceWaveform.tsx
│   │
│   ├── hooks/
│   │   └── useVoiceAgent.ts
│   │
│   ├── pages/
│   │   ├── Assistant.tsx
│   │   ├── Memory.tsx
│   │   └── Onboarding.tsx
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
│
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

# 🚀 How to Run

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm
- Git

Verify the installations:

```bash
node --version
npm --version
git --version
```

---

## Clone the Repository

```bash
git clone https://github.com/Anshuman020106/kisansathi.ai.git
```

Enter the project directory:

```bash
cd kisansathi.ai
```

---

## Install Dependencies

```bash
npm install
```

---

## Start Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## Run on Another Device on the Same Network

```bash
npm run dev -- --host
```

Vite will provide a Network URL that can be opened from another device connected to the same network.

---

## Production Build

```bash
npm run build
```

---

## Preview Production Build

```bash
npm run preview
```

---

# ⚠️ Limitations

KisanSaathi is currently a **prototype**.

The current project does not establish that:

- AI-generated agricultural advice is always correct.
- The system can safely diagnose every crop disease.
- The system covers every crop or farming scenario.
- Voice recognition will work equally well across all accents, environments, and devices.
- External agricultural or weather data is always available.
- The current prototype is ready for production-scale deployment.

Agricultural recommendations should be validated against reliable agricultural sources and, where appropriate, qualified agricultural experts.

---

# 🔮 Future Development

Potential future improvements include:

- More Indian languages
- Better Hindi and Hinglish speech recognition
- Real-time weather integration
- Soil and crop data integration
- Crop disease assistance
- Persistent farm profiles
- Better long-term memory
- Memory correction and deletion
- Multichannel continuity
- Agricultural expert handoff
- Improved interruption recovery
- More reliable agricultural data sources

---

# 🏆 VoxForge Alignment

KisanSaathi is designed around the **VoxForge challenge**.

### Essential Voice

Voice is the primary interaction rather than an optional microphone feature.

### Rime

Rime provides the spoken response that drives the main interaction.

### Qdrant

Qdrant provides meaningful farm-memory and contextual retrieval.

### Difficult Production Problem

KisanSaathi focuses on interruption handling and memory recovery.

### End-to-End Flow

```text
Voice Input
    ↓
AI Understanding
    ↓
Memory Retrieval
    ↓
Contextual Response
    ↓
Rime Voice Output
    ↓
Interruption / Continuation
```

---

# 👥 Team

| Contributor | GitHub |
|---|---|
| **Anshuman Patsariya** | [@Anshuman020106](https://github.com/Anshuman020106) |
| **Ankit Varshney** | [@ankit-var](https://github.com/ankit-var) |
| **Amit Singh** | [@amit535h](https://github.com/amit535h) |
| **Anand Mani Tiwari** | [@25Cse-Anand](https://github.com/25Cse-Anand) |

---

# 🏫 Hackathon

**StarForge 2026**

### Track

**VoxForge**

> **Build a voice experience worth listening to.**

---

# 🌾 Our Vision

Technology should not become another barrier between farmers and useful information.

We believe the best agricultural technology is not necessarily the technology with the most features.

It is the technology that a farmer can use naturally.

## Don't make farmers adapt to technology.
## Make technology adapt to farmers.

# KisanSaathi

### Just Talk.

---

# 📄 License

This project is a **hackathon prototype** developed for educational and demonstration purposes.
