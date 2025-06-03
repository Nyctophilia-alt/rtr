const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Telegram bot configuration
const bot = new TelegramBot('8160749595:AAHLCQg8auCttCJT5zW9nrtsjX_U5o-7eD0', { polling: false });
const CHAT_ID = '8160749595';

app.use(cors());
app.use(express.json());

// Serve static files from the frontend directory
app.use(express.static('frontend'));

app.post('/submit-application', async (req, res) => {
    try {
        const { name, phone, service, message } = req.body;
        
        const text = `
📝 Новая заявка!
👤 Имя: ${name}
📞 Телефон: ${phone}
🎵 Услуга: ${service}
💬 Сообщение: ${message}
        `;
        
        console.log('Attempting to send message:', text);
        console.log('To chat ID:', CHAT_ID);
        
        const result = await bot.sendMessage(CHAT_ID, text);
        console.log('Message sent successfully:', result);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Detailed error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send message',
            details: error.message 
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 