// shantisaathi-web/src/Chat.jsx
import { useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787';

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages(m => [...m, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Request failed with ${res.status}`);
      }
      const data = await res.json();
      setMessages(m => [...m, { role: 'assistant', content: data.reply || '(no reply)' }]);
    } catch (err) {
      console.error('Chat fetch failed:', err);
      setMessages(m => [...m, { role: 'assistant', content: 'Request failed — check server log.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: 16 }}>
      <h2>ShantiSaathi Chat</h2>
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, minHeight: 220 }}>
        {messages.length === 0 && <div>Say hello to start…</div>}
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '8px 0' }}>
            <strong>{m.role === 'user' ? 'You' : 'Saathi'}:</strong> {m.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message…" style={{ flex: 1, padding: 10 }} />
        <button disabled={loading} type="submit">{loading ? 'Sending…' : 'Send'}</button>
      </form>
    </div>
  );
}
