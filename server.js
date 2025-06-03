const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

// Telegram bot configuration
const bot = new TelegramBot('8160749595:AAHLCQg8auCttCJT5zW9nrtsjX_U5o-7eD0', { polling: false });
const CHAT_ID = '8160749595';

// Настройка CORS для всех доменов
app.use(cors());
app.options('*', cors()); // Включаем предварительные запросы CORS

app.use(express.json());

// Тестовый маршрут
app.get('/', (req, res) => {
    res.json({ status: 'Server is running' });
});

app.post('/submit-application', async (req, res) => {
    console.log('Получен запрос:', req.body);
    
    try {
        const { name, phone, service, message } = req.body;

        // Проверка наличия всех необходимых полей
        if (!name || !phone || !service) {
            return res.status(400).json({ 
                success: false, 
                error: 'Не заполнены обязательные поля' 
            });
        }
        
        const text = `
📝 Новая заявка!
👤 Имя: ${name}
📞 Телефон: ${phone}
🎵 Услуга: ${service}
💬 Сообщение: ${message || 'Не указано'}
        `;
        
        console.log('Отправка сообщения в Telegram:', text);
        console.log('ID чата:', CHAT_ID);
        
        const result = await bot.sendMessage(CHAT_ID, text);
        console.log('Сообщение успешно отправлено:', result);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Ошибка:', error);
        console.error('Стек ошибки:', error.stack);
        res.status(500).json({ 
            success: false, 
            error: 'Ошибка при отправке сообщения',
            details: error.message 
        });
    }
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('Ошибка сервера:', err.stack);
    res.status(500).json({ 
        success: false, 
        error: 'Внутренняя ошибка сервера',
        details: err.message
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
}); 