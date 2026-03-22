# 🏛 Walk Through History — India's Heritage AI Platform

<div align="center">

![Walk Through History](https://img.shields.io/badge/Walk%20Through-History-d4a843?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2Q0YTg0MyIgZD0iTTEyIDJMMiA3bDEwIDUgMTAtNUwxMiAyem0wIDE1TDIgMTJsNS0yLjV2NUwxMiAxN2w1LTIuNXYtNUwyMiAxMiAxMiAxN3oiLz48L3N2Zz4=)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-LLaMA%203-F55036?style=for-the-badge)
![Railway](https://img.shields.io/badge/Deployed%20on-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**An AI-powered platform making 5,000 years of Indian heritage accessible to everyone.**

[🌐 Live Demo](https://walkthrough-ai-production.up.railway.app) • [📖 Features](#-features) • [🚀 Getting Started](#-getting-started) • [🛠 Tech Stack](#-tech-stack)

</div>

---

## 📸 Preview

> Explore India's magnificent historical landmarks — from Mughal marvels to ancient Dravidian temples — with a multilingual AI guide, interactive maps, 3D models, and AI-generated travel itineraries.

---

## ✨ Features

### 🤖 AI Heritage Guide
- Conversational AI powered by **Groq (LLaMA 3.1)**
- Ask about any monument's history, architecture, legends, visiting tips
- **Auto language detection** — responds in the same language you speak
- Supports **10 Indian languages**: Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Punjabi, Malayalam, English

### 🎤 Voice Interaction
- **Voice input** via Web Speech API — speak your question
- **Text-to-Speech** replies — AI speaks back to you
- Language-aware voice recognition (correct dialect per language)
- 🔇 Stop button to halt speech mid-sentence

### 🗺 Interactive Monument Map
- Real map powered by **Leaflet + OpenStreetMap (CartoDB)**
- **90+ monument markers** with exact GPS coordinates
- 🔵 Blue = UNESCO World Heritage Sites | 🟡 Gold = Heritage Sites
- Hover to preview photo, name, rating
- Click any marker → opens full monument detail

### 🏛 Monument Explorer
- **90+ monuments** across India with rich detail modals
- Full descriptions, historical facts, visitor tips, entry fees, timings
- Wikipedia-powered high-resolution images
- Filter by era: Mughal, Temple, Fort, Buddhist, Dravidian, UNESCO
- Sort by: 3D First, Name, Rating, Era
- Show More / Show Less pagination

### 🎮 3D Monument Models
- 19 monuments with interactive 3D models (via Sketchfab)
- Gold **"3D"** badge on cards that have models
- Download-ready `.glb` files for self-hosting with `<model-viewer>`

### 📅 AI Travel Planner
- Input destination, duration, budget, interests, travel style
- AI generates a **day-by-day heritage itinerary** with morning/afternoon/evening slots
- Save, share, and print your itinerary
- Supports Budget / Mid-range / Luxury options

### 🌐 Additional Features
- Historical timeline from 3000 BCE to 1947 CE
- Browse monuments by state (10 states)
- Pricing plans (Explorer / Historian / Maharaja)
- Auth modal with localStorage user persistence
- Fully responsive design (mobile + desktop)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| **Backend** | Node.js, Express.js |
| **AI Model** | Groq API — LLaMA 3.1 8B Instant |
| **Map** | Leaflet.js + CartoDB Tiles |
| **3D** | Google `<model-viewer>`, Sketchfab |
| **Images** | Wikipedia REST API |
| **Voice** | Web Speech API (STT + TTS) |
| **Deployment** | Railway |
| **Environment** | dotenv |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A free [Groq API key](https://console.groq.com)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Aklesh1206/walkthrough-AI.git
cd walkthrough-AI

# 2. Install dependencies
npm install

# 3. Create environment file
echo "GROQ_API_KEY=your_groq_api_key_here" > .env

# 4. Start the server
node server.js

# 5. Open in browser
# http://localhost:3000
```

### Development (auto-restart)
```bash
npx nodemon server.js
```

---

## 📁 Project Structure

```
walkthrough-AI/
├── server.js          # Express backend — API routes
├── v5_final.html      # Frontend — single page app
├── models/            # (Optional) 3D .glb monument files
│   ├── taj-mahal.glb
│   ├── red-fort.glb
│   └── ...
├── .env               # GROQ_API_KEY (not committed)
├── package.json
└── README.md
```

---

## 🔌 API Routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Serves the frontend HTML |
| `POST` | `/api/chat` | Heritage AI Guide chat |
| `POST` | `/api/planner` | AI Travel Itinerary generator |
| `GET` | `/api/health` | Health check |

### `/api/chat` Request
```json
{
  "messages": [
    { "role": "user", "content": "Tell me about the Taj Mahal" }
  ],
  "langInstruction": "Always respond in Hindi."
}
```

### `/api/planner` Request
```json
{
  "destination": "Agra",
  "days": 2,
  "budget": "mid",
  "interests": "History, Architecture",
  "style": "Relaxed",
  "travellers": "Couple"
}
```

---

## 🌍 Supported Languages

| Language | Code | Voice |
|---|---|---|
| English | `en` | `en-IN` |
| हिंदी (Hindi) | `hi` | `hi-IN` |
| தமிழ் (Tamil) | `ta` | `ta-IN` |
| తెలుగు (Telugu) | `te` | `te-IN` |
| বাংলা (Bengali) | `bn` | `bn-IN` |
| मराठी (Marathi) | `mr` | `mr-IN` |
| ગુજરાતી (Gujarati) | `gu` | `gu-IN` |
| ಕನ್ನಡ (Kannada) | `kn` | `kn-IN` |
| ਪੰਜਾਬੀ (Punjabi) | `pa` | `pa-IN` |
| മലയാളം (Malayalam) | `ml` | `ml-IN` |

---

## 🚂 Deployment (Railway)

```bash
# 1. Push to GitHub
git add .
git commit -m "deploy"
git push

# 2. Railway auto-deploys on push

# 3. Set environment variable in Railway dashboard:
#    GROQ_API_KEY = gsk_...
```

**Required Environment Variables:**

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your Groq API key from console.groq.com |
| `ALLOWED_ORIGIN` | (Optional) Your frontend domain for CORS |
| `PORT` | (Auto-set by Railway) |

---

## 🏛 Monuments Covered

**19 monuments with 3D models** including:
Taj Mahal, Red Fort, Qutub Minar, India Gate, Gateway of India, Golden Temple, Charminar, Mysore Palace, Lotus Temple, Sanchi Stupa, Akshardham, Brihadeeswarar Temple, Somnath Temple, Kedarnath Temple, Kashi Vishwanath, Ellora Caves, Jagannath Temple, Konark Sun Temple, Vaishno Devi

**90+ total monuments** spanning:
- 🕌 Mughal Era (Taj Mahal, Red Fort, Humayun's Tomb...)
- 🏯 Rajput Forts (Mehrangarh, Amber Fort, Jaisalmer...)
- 🛕 Dravidian Temples (Meenakshi, Brihadeeswarar, Hampi...)
- 🕉 Buddhist Sites (Ajanta, Ellora, Sanchi Stupa...)
- 🏔 Natural Wonders (Dal Lake, Pangong, Valley of Flowers...)
- ⛪ Colonial Heritage (Victoria Memorial, India Gate, Marine Drive...)

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

```bash
# Fork the repo
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
# Open a Pull Request
``'

## 🙏 Acknowledgements

- [Groq](https://groq.com) — Free LLaMA 3.1 API
- [Sketchfab](https://sketchfab.com) — Free 3D monument models
- [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/) — Monument images
- [Leaflet.js](https://leafletjs.com) — Interactive maps
- [CartoDB](https://carto.com) — Map tiles
- [Google Model Viewer](https://modelviewer.dev) — 3D viewer component
- All the anonymous developers passionate about Indian heritage 🏛

---

<div align="center">

**Made with ❤️ for India's 5,000 years of heritage**

⭐ Star this repo if you found it useful!

</div>
