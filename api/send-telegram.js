module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }
  const keyOk = process.env.API_SECRET &&
    req.headers['x-api-key'] === process.env.API_SECRET;
  const originOk = process.env.ALLOWED_ORIGIN &&
    req.headers.origin === process.env.ALLOWED_ORIGIN;
  if (!keyOk && !originOk) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const tokens = [process.env.BOT1_TOKEN, process.env.BOT2_TOKEN].filter(Boolean);
  const chats = [process.env.CHAT_ID1, process.env.CHAT_ID2].filter(Boolean);
  if (!tokens.length || !chats.length) {
    return res.status(500).json({ error: 'Server config error' });
  }
  const data = req.body || {};
  let text = typeof data.message === 'string'
    ? data.message
    : JSON.stringify(data, null, 2);
  if (text.length > 1000) text = text.slice(0, 1000);
  const jobs = [];
  for (const t of tokens) {
    for (const c of chats) {
      jobs.push(
        fetch('https://api.telegram.org/bot' + t + '/sendMessage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: c, text: text })
        }).then(r => r.json()).catch(() => ({ ok: false }))
      );
    }
  }
  const results = await Promise.all(jobs);
  const okCount = results.filter(r => r.ok).length;
  return res.status(okCount ? 200 : 502).json({
    sent: okCount,
    total: results.length
  });
};
