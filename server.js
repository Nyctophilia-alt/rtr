const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Telegram bot configuration
const bot = new TelegramBot('8160749595:AAHLCQg8auCttCJT5zW9nrtsjX_U5o-7eD0', { polling: false });
const CHAT_ID = '8160749595';

// Настройка CORS
app.use(cors({
    origin: ['https://nyctophilia-alt.github.io', 'http://localhost:3000'],
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Проверка работы сервера
app.get('/', (req, res) => {
    res.json({ status: 'Server is running' });
});

app.post('/submit-application', async (req, res) => {
    console.log('Received request:', req.body);
    
    try {
        const { name, phone, service, message } = req.body;

        // Проверка наличия всех необходимых полей
        if (!name || !phone || !service) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields' 
            });
        }
        
        const text = `
📝 Новая заявка!
👤 Имя: ${name}
📞 Телефон: ${phone}
🎵 Услуга: ${service}
💬 Сообщение: ${message || 'Не указано'}
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

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        error: 'Something broke!',
        details: err.message
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 