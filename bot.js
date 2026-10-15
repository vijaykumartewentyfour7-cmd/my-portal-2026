const token = process.env.BOT1_TOKEN;
let offset = 0;

async function sendMessage(chatId, text) {
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId: chatId, text: text, parse_mode: 'Markdown' })
    });
  } catch (err) {}
}

async function poll() {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates?offset=${offset}&timeout=30`);
    const data = await res.json();
    if (data.ok && data.result.length > 0) {
      for (const update of data.result) {
        offset = update.update_id + 1;
        if (update.message && update.message.text) {
          const chatId = update.message.chat.id;
          const text = update.message.text;

          if (text === '/start') {
            await sendMessage(chatId, 'Welcome! Bot is active. 🚀\n\nCommands:\n/login - Simulate Login Attempt\n/otp - Send OTP Notification');
          } else if (text === '/login') {
            await sendMessage(chatId, '🚨 *New Login Attempt*\n👤 *Document ID:* 35358\n🔑 *MPIN:* 385883');
          } else if (text === '/otp') {
            await sendMessage(chatId, '✅ *OTP Received*\n👤 *Document ID:* 35358\n🔑 *MPIN:* 385883\n🔢 *OTP:* 388885');
          }
        }
      }
    }
  } catch (e) {}
  setTimeout(poll, 1000);
}

console.log('Bot is running...');
poll();
