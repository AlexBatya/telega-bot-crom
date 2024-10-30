import TelegramBot from 'node-telegram-bot-api';
import { containsForbiddenWords } from '../models/message.model';
import { createDeletedMessageResponse } from '../views/response.view';

export const validateBadWords = (bot: TelegramBot) => async (msg: TelegramBot.Message) => {
    const messageText = msg.text;
    const sender = msg.from;

    if (!sender || !messageText) return true; // Пропускаем пустые сообщения

    try {
        if (containsForbiddenWords(messageText)) {
            await bot.deleteMessage(msg.chat.id, msg.message_id);
            await bot.sendMessage(msg.chat.id, createDeletedMessageResponse(sender.first_name, "запрещенные слова"), { parse_mode: "Markdown", disable_notification: true });
            return false; // Сообщение отклонено
        }
        return true; // Сообщение валидно
    } catch (error) {
        console.error('Ошибка при валидации запрещённых слов:', error);
        return false; // В случае ошибки, отклоняем сообщение
    }
};
