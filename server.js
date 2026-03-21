/* ═══════════════════════════════════════════════════════════════
   WALK THROUGH HISTORY — Backend Server (Groq Edition)
   Uses Groq's free API (Llama 3) instead of Anthropic.

   Routes:
     POST /api/chat      — Heritage AI Guide chat
     POST /api/planner   — AI Travel Itinerary generator

   Run:
     node server.js          (production)
     npx nodemon server.js   (development, auto-restart)
   ═══════════════════════════════════════════════════════════════ */

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const Groq    = require('groq-sdk');   // ← Groq instead of Anthropic

const app  = express();
const port = process.env.PORT || 3000;

// ─── GROQ CLIENT ──────────────────────────────────────────────
if (!process.env.GROQ_API_KEY) {
  console.error('\n❌  GROQ_API_KEY is not set.');
  console.error('    Create a .env file with:  GROQ_API_KEY=gsk_...\n');
  process.exit(1);
}

const groq  = new Groq({ apiKey: process.env.GROQ_API_KEY });  // ← Groq client
const MODEL = 'llama-3.1-8b-instant';                               // ← Free Llama 3 model

// ─── MIDDLEWARE ───────────────────────────────────────────────
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['POST', 'OPTIONS', 'GET'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '50kb' }));

// Serve the frontend HTML directly from this folder
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/v2_final.html');
});
app.use(express.static(__dirname));

// ─── SYSTEM PROMPTS ───────────────────────────────────────────
const HERITAGE_SYSTEM = `You are a knowledgeable and enthusiastic Heritage AI Guide for India's monuments and history.
You know everything about Indian historical monuments — Mughal, Rajput, Dravidian, Buddhist, Colonial, and more.
For each monument, you can share history, architecture details, legends, visiting hours, photography tips,
nearby attractions, food recommendations, and fascinating facts most tourists never hear about.
Keep responses concise (2-5 sentences), warm, and engaging. End with a relevant emoji.
Never break character or discuss anything unrelated to India's heritage and travel.
If anyone asks who developed, built, or created you, say exactly: "I was developed by a group of anonymous developers who are passionate about preserving and promoting India's rich cultural heritage. They built Walk Through History to make 5,000 years of Indian history accessible to everyone. 🏛"`;

const PLANNER_SYSTEM = `You are an expert Indian heritage travel planner.
Generate a day-by-day heritage travel itinerary in strict JSON format — no markdown, no backticks, no preamble.
Respond ONLY with a valid JSON object in exactly this structure:
{
  "title": "City Heritage Journey",
  "tagline": "A descriptive subtitle",
  "emoji": "🏛",
  "monuments": 6,
  "budgetPerDay": "₹11,500",
  "days": {
    "1": {
      "title": "Day theme title",
      "m": { "name": "Morning activity", "desc": "2-sentence description.", "tags": ["Tag1","Tag2","Tag3"] },
      "a": { "name": "Afternoon activity", "desc": "2-sentence description.", "tags": ["Tag1","Tag2"] },
      "e": { "name": "Evening activity",   "desc": "2-sentence description.", "tags": ["Tag1","Tag2"] }
    }
  }
}
The "days" object must have exactly as many keys as the requested number of days.
Focus on authentic heritage monuments, cultural experiences, and local food.`;

// ─── HELPER ───────────────────────────────────────────────────
function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return false;
  return messages.every(m =>
    m && typeof m.role === 'string' &&
    ['user', 'assistant'].includes(m.role) &&
    typeof m.content === 'string' &&
    m.content.trim().length > 0 &&
    m.content.length < 4000
  );
}

// ─── POST /api/chat ───────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!validateMessages(messages)) {
      return res.status(400).json({ error: 'Invalid messages array.' });
    }

    // Cap history at last 20 messages to avoid token bloat
    const trimmed = messages.slice(-20);

    // ← Groq call instead of anthropic.messages.create()
    const response = await groq.chat.completions.create({
      model:      MODEL,
      max_tokens: 600,
      messages: [
        { role: 'system', content: HERITAGE_SYSTEM },
        ...trimmed
      ],
    });

    const reply = response.choices[0].message.content;  // ← Groq response format
    res.json({ reply });

  } catch (err) {
    console.error('[/api/chat]', err.message);
    res.status(500).json({ error: 'AI guide unavailable. Please try again.' });
  }
});

// ─── POST /api/planner ────────────────────────────────────────
app.post('/api/planner', async (req, res) => {
  try {
    const { destination, days, budget, interests, style, travellers } = req.body;

    // Basic validation
    if (!destination || typeof destination !== 'string' || destination.length > 100) {
      return res.status(400).json({ error: 'Invalid destination.' });
    }
    const numDays = parseInt(days);
    if (isNaN(numDays) || numDays < 1 || numDays > 14) {
      return res.status(400).json({ error: 'Days must be between 1 and 14.' });
    }

    const budgetLabel = {
      budget:  'budget (under 5000/day — guesthouses, local food, shared transport)',
      mid:     'mid-range (5000-15000/day — 3-star hotels, local restaurants, auto/cab)',
      luxury:  'luxury (25000+/day — heritage hotels, fine dining, private vehicles)',
    }[budget] || 'mid-range';

    const userPrompt =
      `Create a ${numDays}-day heritage travel itinerary for ${destination}, India.\n` +
      `Budget: ${budgetLabel}\n` +
      `Travel style: ${style || 'Relaxed'}\n` +
      `Interests: ${interests || 'History, Architecture'}\n` +
      `Travelling as: ${travellers || 'Couple'}\n` +
      `Focus on authentic heritage monuments, cultural experiences, and local food.`;

    // ← Groq call instead of anthropic.messages.create()
    const response = await groq.chat.completions.create({
      model:      MODEL,
      max_tokens: 2500,
      messages: [
        { role: 'system', content: PLANNER_SYSTEM },
        { role: 'user',   content: userPrompt }
      ],
    });

    const raw   = response.choices[0].message.content;  // ← Groq response format
    const clean = raw.replace(/```json|```/g, '').trim();

    let itinerary;
    try {
      itinerary = JSON.parse(clean);
    } catch {
      console.error('[/api/planner] JSON parse failed:', clean.slice(0, 200));
      return res.status(500).json({ error: 'Failed to parse itinerary. Please try again.' });
    }

    res.json({ itinerary });

  } catch (err) {
    console.error('[/api/planner]', err.message);
    res.status(500).json({ error: 'Planner unavailable. Please try again.' });
  }
});

// ─── HEALTH CHECK ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', model: MODEL, timestamp: new Date().toISOString() });
});

// ─── START ────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`\n🏛  Walk Through History — Backend running (Groq / ${MODEL})`);
  console.log(`   Local:   http://localhost:${port}`);
  console.log(`   Health:  http://localhost:${port}/api/health\n`);
});
