import TelegramBot from 'node-telegram-bot-api';
import { containsLink } from '../models/message.model';
import { isAdmin } from '../services/user.service';
import { createDeletedMessageResponse } from '../views/response.view';

export const validateLinks = (bot: TelegramBot) => async (msg: TelegramBot.Message) => {
    const messageText: any = msg.text;
    const sender: any = msg.from;

    if (!sender || !messageText) return true; // Пропускаем пустые сообщения

    try {
        if (containsLink(messageText)) {
          const isUserAdmin = await isAdmin(bot, msg.chat.id, sender.id);
          if (!isUserAdmin) {
            await bot.deleteMessage(msg.chat.id, msg.message_id);
            await bot.sendMessage(msg.chat.id, createDeletedMessageResponse(sender.first_name, "ссылку"), { parse_mode: "Markdown", disable_notification: true });
            return false; // Сообщение отклонено
          }
        }
        return true; // Сообщение валидно
    } catch (error) {
      console.error('Ошибка при валидации ссылок:', error);
      return false; // В случае ошибки, отклоняем сообщение
    }
};
