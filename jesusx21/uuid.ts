import { v4 as uuid } from 'uuid';

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export const getRandomUUID = () => uuid() as UUID
