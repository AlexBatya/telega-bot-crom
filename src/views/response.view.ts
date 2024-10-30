export const createDeletedMessageResponse = (
    userInfo: { name: string; profileLink?: string; phone?: string },
    reason: string
) => {
    // Определяем формат отображения пользователя в зависимости от наличия данных
    let userDisplay = '';

    if (userInfo.profileLink) {
        userDisplay = `[${userInfo.name}](${userInfo.profileLink})`;
    } else if (userInfo.phone) {
        userDisplay = `${userInfo.name} (Телефон: ${userInfo.phone})`;
    } else {
        userDisplay = userInfo.name; // Только имя, если ничего больше нет
    }

    return `Сообщение от участника ${userDisplay} было удалено, так как оно содержит недопустимый контент (${reason}).`;
};

