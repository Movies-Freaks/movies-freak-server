
import expressWinston from 'express-winston';
import winston from 'winston';
import { MESSAGE } from 'triple-beam';

import { Json } from './types';

export default class Loggers {
  private env: Json;
  private colorize: winston.Logform.Colorizer;
  private json: winston.Logform.Format;

  private colorizeOnlyInDevelopment: winston.Logform.FormatWrap;
  private formatByEnvironment: winston.Logform.FormatWrap;
  private jsonWithPrettyErrorStack: winston.Logform.FormatWrap;
  private simpleWithPrettyErrorStack: winston.Logform.FormatWrap;

  logger: any;
  expressLogger: any;

  constructor(env: Json) {
    this.env = env;
    this.colorize = winston.format.colorize();
    this.json = winston.format.json();

    this.setColorizeOnlyInDevelopment();
    this.setFormatByEnvironment();
    this.setJsonWithPrettyErrorStack();
    this.setSimpleWithPrettyErrorStack();

    this.setLogger();
    this.setExpressLogger();
  }

  getTransports() {
    return [
      new winston.transports.Console({ silent: this.env.isTestingEnv })
    ];
  }

  private setColorizeOnlyInDevelopment() {
    this.colorizeOnlyInDevelopment = this.buildFormatter((info, opts) => {
      if (!this.env.isDevelopmentEnv) return info;

      return this.colorize.transform(info, opts);
    });
  }

  private setExpressLogger() {
    this.expressLogger = expressWinston.logger({
      transports: this.getTransports(),
      meta: !this.env.isDevelopmentEnv,
      expressFormat: true,
      colorize: this.env.isDevelopmentEnv,
      format: winston.format.combine(
        this.colorizeOnlyInDevelopment(),
        this.formatByEnvironment({
          development: this.simpleWithPrettyErrorStack(),
          production: winston.format.json()
        })
      )
    });
  }

  private setFormatByEnvironment() {
    this.formatByEnvironment = this.buildFormatter((info, opts) => {
      if (this.env.isDevelopmentEnv) return opts.development.transform(info, opts);

      return opts.production.transform(info, opts);
    });
  }

  private setJsonWithPrettyErrorStack() {
    this.jsonWithPrettyErrorStack = this.buildFormatter((info, opts) => {
      if (info instanceof Error) {
        return this.json.transform({ ...info, error: info.payload }, opts);
      }

      this.json.transform(info, opts);
    });
  }

  private setLogger() {
    this.logger = winston.createLogger({
      transports: this.getTransports(),
      format: winston.format.combine(
        this.colorizeOnlyInDevelopment(),
        this.formatByEnvironment({
          development: this.simpleWithPrettyErrorStack(),
          production: this.jsonWithPrettyErrorStack()
        })
      )
    });
  }

  private setSimpleWithPrettyErrorStack() {
    this.simpleWithPrettyErrorStack = this.buildFormatter((info) => {
      const padding = (info.padding && info.padding[info.level]) ?? '';
      info[MESSAGE] = `${info.level}:${padding} ${info.message}`;

      if (info instanceof Error && info.stack) {
        info[MESSAGE] += `\n${info.stack}`;
      }

      return info;
    });
  }

  private buildFormatter(fn: winston.Logform.TransformFunction) {
    return winston.format(fn)
  }
}
