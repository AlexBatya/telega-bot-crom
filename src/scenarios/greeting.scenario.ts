import TelegramBot from 'node-telegram-bot-api';

export const handleGreeting = (bot: TelegramBot) => async (msg: TelegramBot.Message) => {
    const messageText = msg.text;
    const sender = msg.from;

    // Проверяем, что отправитель и текст сообщения существуют
    if (!sender || !messageText) return; // Если отсутствует отправитель или текст, выходим из функции

    // Проверка на приветствие
    if (messageText.toLowerCase() === 'привет') {
        await bot.sendMessage(msg.chat.id, `Привет, ${sender.first_name}! Как я могу помочь?`);
    }
};

