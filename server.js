const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const BOT1_TOKEN = 'REMOVED_TOKEN';
const BOT2_TOKEN = 'REMOVED_TOKEN';
const MY_CHAT_ID = 'YAHAN_APNI_CHAT_ID_LIKHEIN'; // Yahan apni Telegram Chat ID likhein

async function sendTelegramMessage(token, text) {
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: MY_CHAT_ID,
        text: text,
        parse_mode: 'HTML'
      })
    });
  } catch (err) {
    console.error('Error sending message:', err);
  }
}

// Website ka home page
app.get('/', (req, res) => {
  res.send('Website Data Collector Server is Running!');
});

// Website se data receive karne ka endpoint
app.post('/webhook', async (req, res) => {
  const data = req.body;
  console.log('Website Data Received:', data);

  const formattedMessage = `<b>🌐 New Website Data Received!</b>\n\n` +
    `<pre>${JSON.stringify(data, null, 2)}</pre>`;

  // Dono bots se message bhejein
  await sendTelegramMessage(BOT1_TOKEN, `[Bot Dkdook] \n${formattedMessage}`);
  await sendTelegramMessage(BOT2_TOKEN, `[Bot Mamaaam] \n${formattedMessage}`);

  res.status(200).json({ status: 'success', message: 'Data sent to bots!' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
