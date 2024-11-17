export type Json = {
  [key: string]: any
};

export type UUID = `${string}-${string}-${string}-${string}-${string}` | string;

export type SpecificJson<T> = {
  [key: string]: T;
};

export type UUIDJson<T> = {
  [key: UUID]: T;
};

export type Class = Function | {
  new(...args: any[]): Json,
  prototype: Json
};
