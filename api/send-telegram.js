module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }
  const token = process.env.BOT1_TOKEN;
  const chatId = process.env.CHAT_ID;
  if (!token || !chatId) {
    return res.status(500).json({ error: 'Env vars missing' });
  }
  const data = req.body || {};
  const text = typeof data.message === 'string'
    ? data.message
    : JSON.stringify(data, null, 2);
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });
    const out = await r.json();
    return res.status(r.ok ? 200 : 502).json(out);
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
};
