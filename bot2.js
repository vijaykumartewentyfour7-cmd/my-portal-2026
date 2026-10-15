const TOKEN = process.env.BOT2_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${TOKEN}`;

async function sendMessage(chatId, text) {
  try {
    await fetch(`${BASE_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: text })
    });
  } catch (e) {
    console.error('Error sending message:', e);
  }
}

async function poll(offset = 0) {
  try {
    const res = await fetch(`${BASE_URL}/getUpdates?offset=${offset}&timeout=30`);
    const data = await res.json();
    
    if (data.ok && data.result) {
      for (const update of data.result) {
        offset = update.update_id + 1;
        if (update.message && update.message.text) {
          const chatId = update.message.chat.id;
          const text = update.message.text;

          if (text === '/start') {
            await sendMessage(chatId, 'Welcome! Mamaaam Bot is active.');
          } else {
            await sendMessage(chatId, 'Received: ' + text);
          }
        }
      }
    }
  } catch (e) {
    // ignore network errors during long polling
  }
  setTimeout(() => poll(offset), 1000);
}

console.log('Mamaaam Bot is running...');
poll();
