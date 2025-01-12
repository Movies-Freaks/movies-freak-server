export type Json = {
  [key: string]: any
};

export type ClasspuccinoErrorParams = {
  error?: Error;
  name?: string;
  message?: string;
  info?: Json;
};

export type ErrorAndFails = {
  [key: string]: any
};

export type FailTestResponse = {
  fail: Error;
  error: Error;
};
