import { pickBy } from "lodash";
import { Emojis } from "../slack/emojis";
import { Users } from "../slack/users";

const emojiRegexp = /:([\w_+]+):/g;
const userIdRegexp = /<@([^>]+)>/g;
const channelsRegexp = /<#[^|]+\|([^>]+)>/g;

export function messageContentToMarkdown(message: string, emojis: Emojis, users: Users): string {
  const linksReplaced = message.replaceAll(/<(http[^|]+)\|([^>]+)>/g, "[$2]($1)");
  const emojisReplaced = replaceEmojis(linksReplaced, emojis);
  const usersReplaced = replaceUsers(emojisReplaced, users);
  return replaceChannels(usersReplaced);
}

export function replaceEmojis(text: string, emojis: Emojis): string {
  const emojiKeys = extractEmojiInText(text);
  const relevantEmojis = pickBy(emojis, (_value, key) => emojiKeys.includes(key));
  return Object.entries(relevantEmojis).reduce(
    (cur, [key, value]) => cur.replaceAll(`:${key}:`, `<img src="${value}" alt="${key}" height="15"/>`),
    text
  );
}

export function replaceUsers(text: string, users: Users): string {
  const userIds = extractUserIdsInText(text);
  const relevantUsers = pickBy(users, (_value, key) => userIds.includes(key));
  return Object.entries(relevantUsers).reduce(
    (cur, [key, value]) => cur.replaceAll(`<@${key}>`, `**@${value.name}**`),
    text
  );
}

export function replaceChannels(text: string): string {
  return text.replaceAll(channelsRegexp, (_arg, arg1) => `**#${ arg1 }**`)
}

function extractEmojiInText(text: string) {
  const foundEmojis = [];

  const matches = text.matchAll(emojiRegexp);
  for (const match of matches) {
    foundEmojis.push(match[1]);
  }

  return foundEmojis;
}

export function extractUserIdsInText(text: string): string[] {
  const foundUserIds = [];

  const matches = text.matchAll(userIdRegexp);
  for (const match of matches) {
    foundUserIds.push(match[1]);
  }

  return foundUserIds;
}
