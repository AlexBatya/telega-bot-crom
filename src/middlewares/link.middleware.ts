import TelegramBot from 'node-telegram-bot-api';
import { containsLink } from '../models/message.model';
import { isAdmin } from '../services/user.service';
import { createDeletedMessageResponse } from '../views/response.view';

export const validateLinks = (bot: TelegramBot) => async (msg: TelegramBot.Message) => {
    const messageText = msg.text;
    const sender = msg.from;

    if (!sender || !messageText) return true; // Пропускаем пустые сообщения

    try {
        // Проверяем наличие запрещённой ссылки
        if (containsLink(messageText)) {
            const isUserAdmin = await isAdmin(bot, msg.chat.id, sender.id);
            if (!isUserAdmin) {
                // Удаляем сообщение, если пользователь не является администратором
                await bot.deleteMessage(msg.chat.id, msg.message_id);

                // Информация о пользователе для ответа
                const userInfo = {
                  name: sender.first_name || "Имя не указано",
                  profileLink: sender.username ? `https://t.me/${sender.username}` : "Ссылка недоступна",
                  phone: "Телефон не указан" // Убрали sender.phone_number
                };

                // Ответное сообщение от бота
                await bot.sendMessage(
                    msg.chat.id,
                    createDeletedMessageResponse(userInfo, "запрещённую ссылку"),
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

