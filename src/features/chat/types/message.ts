import { Chat, Message } from '@prisma/client';

export interface MessageClien extends Omit<Message, "id" | "chatId"> {}
