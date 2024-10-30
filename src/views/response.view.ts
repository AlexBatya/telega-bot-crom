export const createDeletedMessageResponse = (username: string, reason: string) => {
    return `Сообщение от *${username}* было удалено, так как оно содержит недопустимый контент (${reason}).`;
};
