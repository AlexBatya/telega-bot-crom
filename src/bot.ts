import TelegramBot from 'node-telegram-bot-api';
import config from './config/localhost.json';
import { handleMessage } from './controllers/bot.controller';
import color from "colors";

// Создание экземпляра бота
const bot = new TelegramBot(config.TOKEN, { polling: true });

// Слушатель сообщений
bot.on('message', handleMessage(bot));

console.log(color.green("Бот успешно запущен и готов к работе!"));

