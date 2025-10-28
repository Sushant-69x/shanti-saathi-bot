// Server/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// CORS: allow Netlify and local dev; restart after editing env on Render [7]
const FIXED = (process.env.ALLOWED_ORIGINS || "http://localhost:5173").split(",").map(s => s.trim());
app.use(cors({ origin: (origin, cb) => (!origin || FIXED.includes(origin) ? cb(null, true) : cb(null, false)) }));
app.options("*", cors());

// Core
app.use(express.json());

// Health and simple test
app.get("/", (_req, res) => res.send("ShantiSaathi API is running"));
app.get("/health", (_req, res) => res.json({ ok: true }));

// Non‑streaming echo (proves JSON routing works)
app.post("/api/chat", (req, res) => res.json({ reply: `echo: ${(req.body?.message || "").slice(0, 50)}` }));

// SSE test (no OpenAI): streams 5 chunks then finishes [5]
app.get("/api/chat/stream", async (_req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  let i = 0;
  const t = setInterval(() => {
    i += 1;
    res.write(`data: ${JSON.stringify({ delta: `chunk-${i}` })}\n\n`);
    if (i >= 5) { clearInterval(t); res.write("event: done\ndata: {}\n\n"); res.end(); }
  }, 400);
});

// Debug: list mounted routes to verify the app you expect is running [4]
app.get("/__routes", (_req, res) => {
  const out = [];
  app._router.stack.forEach((layer) => {
    if (layer.route?.path) out.push({ methods: Object.keys(layer.route.methods), path: layer.route.path });
  });
  res.json(out);
});

module.exports = app;
