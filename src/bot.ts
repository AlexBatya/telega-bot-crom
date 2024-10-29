import TelegramBot, { Message } from 'node-telegram-bot-api';
import config from './config/localhost.json';
import forbiddenWords from './config/bad-words.json';
import color from "colors";
import * as linkify from 'linkifyjs'; 

// Создание экземпляра бота
const bot = new TelegramBot(config.TOKEN, { polling: true });

// Массив запрещённых слов
const forbiddenWordsArray: string[] = forbiddenWords;

// Функция для проверки, содержит ли текст запрещённые слова
const containsForbiddenWords = (text: string): boolean => {
  return forbiddenWordsArray.some((word: string) => text.toLowerCase().includes(word));
};

// Функция для проверки, содержит ли текст ссылку или домен с использованием linkify
const containsLink = (text: string): boolean => {
  return linkify.find(text).some((link: { type: string }) => link.type === 'url');
};

// Функция для проверки, является ли пользователь администратором
const isAdmin = async (chatId: number, userId: number): Promise<boolean> => {
  try {
    const admins = await bot.getChatAdministrators(chatId);
    return admins.some(admin => admin.user.id === userId);
  } catch (error) {
    console.error("Ошибка при получении списка администраторов:", error);
    return false;
  }
};

// Обработчик для всех текстовых сообщений
bot.on('message', async (msg: Message) => {
  const messageText = msg.text;
  const sender = msg.from;

  if (!sender || !messageText) return;

  try {
    // Проверка на наличие ссылки
    if (containsLink(messageText)) {
      const isUserAdmin = await isAdmin(msg.chat.id, sender.id);
      // Удаляем сообщение, если отправитель не является администратором
      if (!isUserAdmin) {
        await bot.deleteMessage(msg.chat.id, msg.message_id);
        await bot.sendMessage(
          msg.chat.id,
          `_Сообщение от_ *${sender.first_name}* _было удалено, так как оно содержит недопустимый контент (ссылку)._`,
          { parse_mode: "Markdown", disable_notification: true }
        );
        return;
      }
    }

    // Проверка на наличие запрещённых слов
    if (containsForbiddenWords(messageText)) {
      await bot.deleteMessage(msg.chat.id, msg.message_id);
      await bot.sendMessage(
        msg.chat.id,
        `_Сообщение от_ *${sender.first_name}* _было удалено, так как оно содержит недопустимый контент (запрещённые слова)._`,
        { parse_mode: "Markdown", disable_notification: true }
      );
    }
  } catch (error) {
    console.error('Ошибка при удалении сообщения или отправке уведомления:', error);
  }
});

// Уведомление о запуске бота для администратора

// Запуск уведомления о запуске бота
console.log(color.green("Бот успешно запущен и готов к работе!"));

