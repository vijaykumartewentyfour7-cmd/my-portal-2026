const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>My Mobile Web App</title>
        <style>
          body { font-family: sans-serif; text-align: center; padding: 50px; background-color: #121212; color: #ffffff; }
          h1 { color: #4CAF50; }
          p { font-size: 18px; }
        </style>
      </head>
      <body>
        <h1>Mobile Express Server Ready! 🎉</h1>
        <p>Yeh website Termux se chal rahi hai.</p>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});
