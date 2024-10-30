import forbiddenWords from '../config/bad-words.json';
import * as linkify from 'linkifyjs';

const forbiddenWordsArray: string[] = forbiddenWords;

export const containsForbiddenWords = (text: string): boolean => {
    return forbiddenWordsArray.some((word: string) => text.toLowerCase().includes(word));
};

export const containsLink = (text: string): boolean => {
    return linkify.find(text).some(link => link.type === 'url');
};
