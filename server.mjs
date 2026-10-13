try {
    const axios = require('axios');

    const response = await axios.post(`https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage`, {
        chat_id: CHAT_ID,
        text: "Aapka message yahan hai"
    }, {
        timeout: 3600000 // 1 ghanta (3,600,000 milliseconds)
    });

    console.log("Telegram Response:", response.data.ok);

} catch (error) {
    console.log("Telegram Error handled:", error.message);
}
