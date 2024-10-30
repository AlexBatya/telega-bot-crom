import TelegramBot from 'node-telegram-bot-api';
import { isAdmin } from '../services/user.service';
import config from '../config/localhost.json';

// Состояние группы: true - открыта, false - закрыта
let isGroupOpen = true;

export const handleGroupCommands = (bot: TelegramBot) => async (msg: TelegramBot.Message) => {
    const chatId: any = msg.chat.id;
    const userId: any = msg.from?.id || 0;

    try {
        const isUserAdmin = await isAdmin(bot, chatId, userId);

        // Проверка состояния группы
        if (!isGroupOpen && !isUserAdmin) {
            return bot.sendMessage(chatId, "Группа закрыта для обычных пользователей.");
        }

        // Проверка и выполнение команды открытия/закрытия группы
        if (msg.text === '/open_group') {
            if (isUserAdmin) {
                isGroupOpen = true; // Открываем группу
                bot.sendMessage(chatId, "Группа успешно открыта. Теперь писать могут все.");
            } else {
                return bot.sendMessage(chatId, "Только администратор может открыть группу.");
            }
        } else if (msg.text === '/close_group') {
            if (isUserAdmin) {
                isGroupOpen = false; // Закрываем группу
                bot.sendMessage(chatId, "Группа успешно закрыта. Теперь писать могут только администраторы.");
            } else {
                return bot.sendMessage(chatId, "Только администратор может закрыть группу.");
            }

        }

    } catch (error) {
        console.error("Ошибка при выполнении команды:", error);
        bot.sendMessage(chatId, "Произошла ошибка при выполнении команды.");
    }
};

// Проверка состояния группы при получении любого сообщения
export const handleMessage = (bot: TelegramBot) => async (msg: TelegramBot.Message) => {
    const chatId: any = msg.chat.id;
    const userId: any = msg.from?.id || 0;

    try {
        const isUserAdmin = await isAdmin(bot, chatId, userId);

        // Проверка состояния группы перед обработкой сообщения
        if (!isGroupOpen && !isUserAdmin) {
            await bot.deleteMessage(chatId, msg.message_id); // Удаляем сообщение
            await bot.sendMessage(chatId, "Группа закрыта для обычных пользователей."); // Информируем пользователя
            return; // Прекращаем выполнение, чтобы обычный пользователь не мог писать
        }

        // Обработка команд
        await handleGroupCommands(bot)(msg);

    } catch (error) {
        console.error("Ошибка при обработке сообщения:", error);
    }
};

