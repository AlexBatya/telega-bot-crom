import TelegramBot from 'node-telegram-bot-api';
import config from '../config/localhost.json';

export const isAdmin = async (bot: TelegramBot, chatId: number, userId: number): Promise<boolean> => {
    // Функция для получения актуального chat_id
    const getUpdatedChatId = async (chatId: number): Promise<number> => {
        try {
            const chatInfo = await bot.getChat(chatId);
            return chatInfo.id; // Возвращаем актуальный chat_id
        } catch (error: any) {
            console.error("Ошибка при получении информации о чате:", error);
            return chatId; // Возвращаем оригинальный chatId в случае ошибки
        }
    };

    // Получаем актуальный chat_id
    const targetChatId = await getUpdatedChatId(chatId);

    try {
        const admins = await bot.getChatAdministrators(targetChatId);
        return admins.some(admin => admin.user.id === userId);
    } catch (error: any) {  // Приведение типа ошибки к `any`
        // Проверяем, если ошибка связана с изменением типа чата
        if (error.response && error.response.statusCode === 400 && error.response.body.description.includes("supergroup")) {
            console.error("Группа была обновлена до супергруппы. Проверьте корректность chat_id.");
        } else {
            console.error("Ошибка при получении списка администраторов:", error);
        }
        return false;
    }
};

