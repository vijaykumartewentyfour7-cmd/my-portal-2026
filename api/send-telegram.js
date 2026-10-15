module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }
  const tokens = [process.env.BOT1_TOKEN, process.env.BOT2_TOKEN].filter(Boolean);
  const chats = [process.env.CHAT_ID1, process.env.CHAT_ID2].filter(Boolean);
  if (!tokens.length || !chats.length) {
    return res.status(500).json({
      error: 'Env vars missing',
      has: {
        BOT1_TOKEN: !!process.env.BOT1_TOKEN,
        BOT2_TOKEN: !!process.env.BOT2_TOKEN,
        CHAT_ID1: !!process.env.CHAT_ID1,
        CHAT_ID2: !!process.env.CHAT_ID2
      }
    });
  }
  const data = req.body || {};
  const text = typeof data.message === 'string'
    ? data.message
    : JSON.stringify(data, null, 2);
  const jobs = [];
  for (const t of tokens) {
    for (const c of chats) {
      jobs.push(
        fetch('https://api.telegram.org/bot' + t + '/sendMessage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: c, text: text })
        }).then(r => r.json()).catch(e => ({ ok: false, description: String(e) }))
      );
    }
  }
  const results = await Promise.all(jobs);
  const okCount = results.filter(r => r.ok).length;
  return res.status(okCount ? 200 : 502).json({
    sent: okCount,
    total: results.length,
    results: results.map(r => ({ ok: r.ok, description: r.description }))
  });
};
