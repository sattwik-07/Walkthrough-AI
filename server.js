/* ═══════════════════════════════════════════════════════════════
   WALK THROUGH HISTORY — Backend Server (Groq Edition)
   ═══════════════════════════════════════════════════════════════ */

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const Groq    = require('groq-sdk');

const app  = express();
const port = process.env.PORT || 3000;

if (!process.env.GROQ_API_KEY) {
  console.error('\n❌  GROQ_API_KEY is not set.\n');
  process.exit(1);
}

const groq  = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.1-8b-instant';

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['POST', 'OPTIONS', 'GET'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '50kb' }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/v5_final.html');
});
app.use(express.static(__dirname));

// ─── LANGUAGE RULES (placed FIRST in prompt so model obeys) ──
const LANG_RULES = {
  en: `CRITICAL RULE: You MUST reply ONLY in English. Do NOT use any other language.`,
  hi: `अति महत्वपूर्ण नियम: तुम्हें केवल हिंदी में जवाब देना है। एक भी शब्द अंग्रेज़ी में मत लिखो। पूरा जवाब हिंदी में होना चाहिए।`,
  ta: `முக்கியமான விதி: நீங்கள் தமிழில் மட்டுமே பதில் அளிக்க வேண்டும். ஆங்கிலம் பயன்படுத்தாதீர்கள். முழு பதிலும் தமிழில் இருக்க வேண்டும்.`,
  te: `అత్యంత ముఖ్యమైన నియమం: మీరు తెలుగులో మాత్రమే సమాధానం ఇవ్వాలి. ఆంగ్లం ఉపయోగించవద్దు. మొత్తం సమాధానం తెలుగులో ఉండాలి.`,
  bn: `গুরুত্বপূর্ণ নিয়ম: আপনাকে শুধুমাত্র বাংলায় উত্তর দিতে হবে। ইংরেজি ব্যবহার করবেন না। সম্পূর্ণ উত্তর বাংলায় হতে হবে।`,
  mr: `अत्यंत महत्त्वाचा नियम: तुम्ही फक्त मराठीत उत्तर द्यायचे आहे. इंग्रजी वापरू नका. संपूर्ण उत्तर मराठीत असणे आवश्यक आहे.`,
  gu: `અત્યંત મહત્વપૂર્ણ નિયમ: તમારે ફક્ત ગુજરાતીમાં જ જવાબ આપવાનો છે. અંગ્રેજી વાપરશો નહીં. આખો જવાબ ગુજરાતીમાં હોવો જોઈએ.`,
  kn: `ಅತ್ಯಂತ ಮಹತ್ವದ ನಿಯಮ: ನೀವು ಕೇವಲ ಕನ್ನಡದಲ್ಲಿ ಮಾತ್ರ ಉತ್ತರಿಸಬೇಕು. ಇಂಗ್ಲಿಷ್ ಬಳಸಬೇಡಿ. ಸಂಪೂರ್ಣ ಉತ್ತರ ಕನ್ನಡದಲ್ಲಿ ಇರಬೇಕು.`,
  pa: `ਬਹੁਤ ਜ਼ਰੂਰੀ ਨਿਯਮ: ਤੁਹਾਨੂੰ ਸਿਰਫ਼ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦੇਣਾ ਹੈ। ਅੰਗਰੇਜ਼ੀ ਨਾ ਵਰਤੋ। ਪੂਰਾ ਜਵਾਬ ਪੰਜਾਬੀ ਵਿੱਚ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`,
  ml: `അത്യന്തം പ്രധാനപ്പെട്ട നിയമം: നിങ്ങൾ മലയാളത്തിൽ മാത്രം മറുപടി നൽകണം. ഇംഗ്ലീഷ് ഉപയോഗിക്കരുത്. മുഴുവൻ ഉത്തരവും മലയാളത്തിൽ ആയിരിക്കണം.`,
};

const HERITAGE_SYSTEM = `You are a knowledgeable, friendly, and enthusiastic Heritage AI Guide for India's monuments and history.
You know everything about Indian historical monuments — Mughal, Rajput, Dravidian, Buddhist, Colonial, and more.
For each monument, you can share history, architecture details, legends, visiting hours, photography tips,
nearby attractions, food recommendations, and fascinating facts most tourists never hear about.
Keep responses concise (2-5 sentences), warm, and engaging. Greet the user warmly if they say hello. End with a relevant emoji.
Never break character or discuss anything unrelated to India's heritage and travel.
If anyone asks who developed, built, or created you, say exactly: "I was developed by the Walk Through History team to be your personal Heritage AI Guide. 🏛"`;

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
    const { messages, langInstruction, langCode } = req.body;

    if (!validateMessages(messages)) {
      return res.status(400).json({ error: 'Invalid messages array.' });
    }

    const trimmed = messages.slice(-20);

    // Language rule goes FIRST — model must see it before anything else
    const rule = LANG_RULES[langCode] || LANG_RULES['en'];
    const systemPrompt = `${rule}\n\n${HERITAGE_SYSTEM}`;

    const response = await groq.chat.completions.create({
      model:      MODEL,
      max_tokens: 600,
      messages: [
        { role: 'system', content: systemPrompt },
        ...trimmed
      ],
    });

    const reply = response.choices[0].message.content;
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

    const response = await groq.chat.completions.create({
      model:      MODEL,
      max_tokens: 2500,
      messages: [
        { role: 'system', content: PLANNER_SYSTEM },
        { role: 'user',   content: userPrompt }
      ],
    });

    const raw = response.choices[0].message.content;
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[/api/planner] No JSON found:', raw.slice(0, 200));
      return res.status(500).json({ error: 'Failed to parse itinerary. Please try again.' });
    }

    let itinerary;
    try {
      itinerary = JSON.parse(jsonMatch[0]);
    } catch {
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

// ─── TTS PROXY (bypasses CORS for Google Translate TTS) ───────
app.get('/api/tts', async (req, res) => {
  try {
    const { text, lang } = req.query;
    if (!text || !lang) return res.status(400).json({ error: 'Missing text or lang' });

    const encoded = encodeURIComponent(text.slice(0, 200));
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${lang}&client=tw-ob`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://translate.google.com/',
      }
    });

    if (!response.ok) throw new Error('Google TTS failed');

    const buffer = await response.arrayBuffer();
    res.set('Content-Type', 'audio/mpeg');
    res.set('Cache-Control', 'no-cache');
    res.send(Buffer.from(buffer));

  } catch (err) {
    console.error('[/api/tts]', err.message);
    res.status(500).json({ error: 'TTS unavailable' });
  }
});

// ─── START ────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`\n🏛  Walk Through History — Backend running (Groq / ${MODEL})`);
  console.log(`   Local:   http://localhost:${port}`);
  console.log(`   Health:  http://localhost:${port}/api/health\n`);
});
