import TelegramBot from 'node-telegram-bot-api';
import config from '../config/localhost.json';

interface CachedAdmins {
    [chatId: number]: {
        admins: TelegramBot.ChatMember[],
        lastUpdated: number
    }
}

const adminCache: CachedAdmins = {};
const CACHE_DURATION = 5 * 60 * 1000; // Время жизни кеша (5 минут)

export const isAdmin = async (bot: TelegramBot, chatId: number, userId: number): Promise<boolean> => {
    const now = Date.now();

    // Проверка `chatId`, чтобы избежать ошибок
    if (!chatId || chatId > 0) {
        console.error("Ошибка: chatId должен быть отрицательным числом для групп и супергрупп. Получено:", chatId);
        return false;
    }

    // Если кеш существует и актуален, возвращаем его
    if (adminCache[chatId] && (now - adminCache[chatId].lastUpdated < CACHE_DURATION)) {
        return adminCache[chatId].admins.some(admin => admin.user.id === userId);
    }

    try {
        // Прямое получение списка администраторов без дополнительного вызова getChat
        const admins = await bot.getChatAdministrators(chatId);
        adminCache[chatId] = { admins, lastUpdated: now };

        // Логирование администратора для отладки
        console.log(`Список администраторов чата ${chatId}:`, admins.map(admin => admin.user.username || admin.user.id));

        // Проверка, является ли пользователь администратором
        return admins.some(admin => admin.user.id === userId);
    } catch (error: any) {
        console.error("Ошибка при получении списка администраторов:", error);
        return false;
    }
};

