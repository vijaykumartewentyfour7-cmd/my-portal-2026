module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(404).end();
  }
  const keyOk = process.env.API_SECRET &&
    req.headers['x-api-key'] === process.env.API_SECRET;
  const originOk = process.env.ALLOWED_ORIGIN &&
    req.headers.origin === process.env.ALLOWED_ORIGIN;
  if (!keyOk && !originOk) {
    return res.status(404).end();
  }
  const pairs = [
    [process.env.BOT1_TOKEN, process.env.CHAT_ID1],
    [process.env.BOT2_TOKEN, process.env.CHAT_ID2]
  ].filter(p => p[0] && p[1]);
  if (!pairs.length) {
    return res.status(500).json({ error: 'Server config error' });
  }
  const data = req.body || {};
  let text = typeof data.message === 'string'
    ? data.message
    : JSON.stringify(data, null, 2);
  if (text.length > 1000) text = text.slice(0, 1000);
  const results = await Promise.all(pairs.map(function (p) {
    return fetch('https://api.telegram.org/bot' + p[0] + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: p[1], text: text })
    }).then(r => r.json()).catch(() => ({ ok: false }));
  }));
  const okCount = results.filter(r => r.ok).length;
  return res.status(okCount ? 200 : 502).json({
    sent: okCount,
    total: results.length, details: results.map((r, i) => ({ bot: i + 1, ok: r.ok, error: r.description }))
  });
};
