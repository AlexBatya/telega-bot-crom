import TelegramBot = require('node-telegram-bot-api');
import { handleGreeting } from '../scenarios/greeting.scenario';
// Импорт других сценариев по мере необходимости

export const handleMessage = (bot: TelegramBot) => async (msg: TelegramBot.Message) => {
    // Передайте сообщение каждому сценарию
    await handleGreeting(bot)(msg);
    
    // Здесь можно добавить другие сценарии
};
