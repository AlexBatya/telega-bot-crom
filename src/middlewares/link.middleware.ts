import TelegramBot from 'node-telegram-bot-api';
import { containsLink } from '../models/message.model';
import { isAdmin } from '../services/user.service';
import { createDeletedMessageResponse } from '../views/response.view';

export const validateLinks = (bot: TelegramBot) => async (msg: TelegramBot.Message) => {
    const messageText = msg.text;
    const sender = msg.from;

    if (!sender || !messageText) return true; // Пропускаем пустые сообщения

    try {
        if (containsLink(messageText)) {
            const isUserAdmin = await isAdmin(bot, msg.chat.id, sender.id);
            if (!isUserAdmin) {
                await bot.deleteMessage(msg.chat.id, msg.message_id);

                const userInfo = {
                    name: sender.first_name || "Имя не указано",
                    profileLink: sender.username ? `https://t.me/${sender.username}` : "Ссылка недоступна",
                    phone: "Телефон не указан"
                };

                await bot.sendMessage(
                    msg.chat.id,
                    createDeletedMessageResponse(userInfo, "ссылку"),
                    { parse_mode: "Markdown", disable_notification: true }
                );

                return false; // Сообщение отклонено
            }
        }
        return true; // Сообщение валидно
    } catch (error) {
        console.error('Ошибка при валидации ссылок:', error);
        return false; // В случае ошибки, отклоняем сообщение
    }
};

