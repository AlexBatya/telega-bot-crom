import TelegramBot from 'node-telegram-bot-api';
import { Message } from 'node-telegram-bot-api';
import { validateMessage } from '../middlewares/index.middleware';
import { handleGreeting } from '../scenarios/greeting.scenario';
import { handleGroupCommands } from '../scenarios/openClose.scenario';

export const handleMessage = (bot: TelegramBot) => async (msg: Message) => {
    // Проверка сообщения с помощью middleware
    const isValid = await validateMessage(bot)(msg);
    if (!isValid) return;

    // Обработка сценариев после валидации
    await handleGreeting(bot)(msg);

    // Проверка и выполнение команд для открытия/закрытия группы
    if (msg.text === '/open_group' || msg.text === '/close_group') {
        await handleGroupCommands(bot)(msg);
    }
};

