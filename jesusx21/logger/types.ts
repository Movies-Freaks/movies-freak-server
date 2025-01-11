export enum LogLevel {
  ERROR = 'error',
  INFO = 'info',
  LOG = 'log',
  WARNING = 'warning'
};

export type Json = {
  [key: string]: any
};

export type LogOptions = {
  color?: string
}

export type LoggerOptions = {
  timestamp?: boolean
};
