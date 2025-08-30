// server/index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('ShantiSaathi API is running');
});

// Chat endpoint (OpenAI-backed, no optional chaining)
app.post('/api/chat', async (req, res) => {
  try {
    console.log('POST /api/chat body:', req.body);

    const body = req.body || {};
    let userText = body.message || '';
    userText = String(userText).trim().slice(0, 2000);

    if (!userText) {
      return res.status(400).json({ error: 'message is required' });
    }
    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY in server/.env');
      return res.status(500).json({ error: 'Server missing OPENAI_API_KEY' });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        { role: 'system', content: 'You are a culturally-aware, empathetic wellness companion named ShantiSaathi.' },
        { role: 'user', content: userText }
      ]
    });

    // Extract reply without optional chaining
    let reply = '';
    if (completion && completion.choices && completion.choices.length > 0) {
      const first = completion.choices[0];
      if (first && first.message && typeof first.message.content === 'string') {
        reply = String(first.message.content).trim();
      }
    }

    // Log unexpected shapes and provide a safe fallback
    if (!reply) {
      console.log('Model returned empty or unexpected shape (truncated):',
        JSON.stringify(completion, null, 2).slice(0, 2000)
      );
      reply = 'Echo: ' + userText;
    }

    return res.json({ reply });
  } catch (e) {
    const status = (e && typeof e.status === 'number') ? e.status : 500;
    const message = (e && e.message) ? e.message : 'Server error';
    console.error('OpenAI error:', e);
    return res.status(status).json({ error: message, status });
  }
});

// Start server
const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
