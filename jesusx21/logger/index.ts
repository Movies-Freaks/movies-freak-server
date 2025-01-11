import { isArray, isObject, isPlainObject, isString } from 'lodash';
import { LoggerOptions, LogLevel, LogOptions } from './types';
import colors from 'colors';

export default class Logger {
  private options: LoggerOptions;

  constructor(options: LoggerOptions = {}) {
    this.options = options;
  }

  enableColors() {
    colors.enable();
  }

  disableColors() {
    colors.disable();
  }

  log(msg: any, options: LogOptions = {}) {
    const message = this.startMessage(LogLevel.LOG, msg);
    const color = options.color ?? 'gray';

    console.log(message[color as any])
  }

  private startMessage(level: LogLevel, msg: any) {
    let message = `${level.toUpperCase()}:  `;

    if (this.options.timestamp) {
      message = `[${(new Date()).toISOString()}] ${message}`;
    }

    if (isString(msg)) message += msg;
    else if (msg instanceof Error) message += `${msg.name}: ${msg.message}\n\t${msg.stack}`;
    else if (isPlainObject(msg)) message += JSON.stringify(msg, null, 2);
    else if (isArray(msg)) message += JSON.stringify(msg, null, 2);
    else if (isObject(msg)) message += `${msg.constructor.name}: ${JSON.stringify(msg, null, 2)}`;
    else message += JSON.stringify(msg);

    return message;
  }
}
