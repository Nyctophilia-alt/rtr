const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

// Telegram bot configuration
const bot = new TelegramBot('8160749595:AAHLCQg8auCttCJT5zW9nrtsjX_U5o-7eD0', { polling: false });
const CHAT_ID = '8160749595';

// Расширенная настройка CORS
app.use(cors({
    origin: '*', // Разрешаем запросы с любого домена
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: true
}));

// Обработка preflight запросов
app.options('*', cors());

app.use(express.json());

// Тестовый маршрут
app.get('/', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Обработка ошибок парсинга JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ 
            success: false, 
            error: 'Неверный формат JSON' 
        });
    }
    next();
});

app.post('/submit-application', async (req, res) => {
    console.log('Получен запрос:', req.body);
    console.log('Headers:', req.headers);
    
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
        
        try {
            const result = await bot.sendMessage(CHAT_ID, text);
            console.log('Сообщение успешно отправлено:', result);
            res.json({ success: true });
        } catch (telegramError) {
            console.error('Ошибка отправки в Telegram:', telegramError);
            res.status(500).json({ 
                success: false, 
                error: 'Ошибка отправки в Telegram',
                details: telegramError.message 
            });
        }
    } catch (error) {
        console.error('Ошибка обработки запроса:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Внутренняя ошибка сервера',
            details: error.message 
        });
    }
});

// Запуск сервера
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});

// Обработка ошибок сервера
server.on('error', (error) => {
    console.error('Ошибка сервера:', error);
}); 