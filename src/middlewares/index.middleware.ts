import TelegramBot from 'node-telegram-bot-api';
import { validateLinks } from './link.middleware';
import { validateBadWords } from './badWords.middleware';

export const validateMessage = (bot: TelegramBot) => async (msg: TelegramBot.Message) => {
    const isLinkValid = await validateLinks(bot)(msg);
    if (!isLinkValid) return false;

    const isBadWordsValid = await validateBadWords(bot)(msg);
    if (!isBadWordsValid) return false;

    return true; // Сообщение валидно
};
