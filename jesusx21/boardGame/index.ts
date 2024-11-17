import cors from 'cors';
import morgan from 'morgan';
import os from 'os';
import express, {
  Application,
  NextFunction,
  Request,
  Response as ExpressResponse,
  Router
} from 'express';

import Loggers from './loggers';
import Monopoly from './monopoly';
import { HTTPError, HTTPInternalError } from './httpResponses';
import { TokenNotSupported, TokenNotUsed } from './errors';
import {
  APIError,
  Endpoint,
  ErrorCodes,
  HTTPStatusCode,
  Json,
  Middleware,
  Response,
  SpecifedJson,
  Tokens,
  Verb
} from './types';

export { Monopoly };
export * from './httpResponses';

export const RESOURCE_EVENTS_SUPPORTED = [
  Tokens.ON_DELETE,
  Tokens.ON_GET,
  Tokens.ON_POST,
  Tokens.ON_PUT
];

export default abstract class BoardGame {
  protected app: Application;
  protected router: Router;
  private host: string;
  private port: number;

  protected endpointBase: string;
  protected dependencies: Json;
  protected logger: any;
  protected expressLogger: any;

  private endpoints: Endpoint;

  constructor(host?: string, port?: number) {
    this.host = host ?? 'localhost';
    this.port = port ?? 9000;

    this.app = express();
    this.router = express.Router();

    this.endpoints = {};

    this.setEndpointBase();

    const loggers = new Loggers({
      isProductionEnv: this.isProductionEnv(),
      isDevelopmentEnv: this.isDevelopmentEnv(),
      isTestingEnv: this.isTestingEnv(),
    });

    this.logger = loggers.logger;
    this.expressLogger = loggers.expressLogger;

    this.app.use(express.json());
    this.app.use(express.static(`${os.tmpdir()}`));
    this.app.use(this.endpointBase, this.router);
  }

  registerResource(
    resourcePath: string,
    resourceInstance: Monopoly,
    middlewares: Middleware[] = []
  ) {
    const [resource, path = ''] = resourcePath.split('/');

    if (!this.endpoints[resource]) {
      this.endpoints[resource] = []
    }

    this.endpoints[resource].push({
      path,
      resourceInstance,
      middlewares
    });
  }

  start() {
    this.app.listen(this.port, this.host, () => {
      console.log(`Movies Freak Server listening on ${this.host}:${this.port}`);
    });
  }

  public abstract initialize(...args: any[]): this;
  protected abstract buildAPI(): this;
  protected abstract isDevelopmentEnv(): boolean;
  protected abstract isProductionEnv(): boolean;
  protected abstract isTestingEnv(): boolean;
  protected abstract setEndpointBase(): this;

  protected disablePoweredBy() {
    this.app.disable('x-powered-by');
  }

  protected addCORSMiddleware() {
    this.app.use(cors());

    return this;
  }

  protected addRequestLogger(format: string) {
    this.app.use(morgan(format));

    return this;
  }

  protected setHeaders(headers: SpecifedJson<string>) {
    const headersMiddleware = (_req: Request, res: ExpressResponse, next: NextFunction) => {
      Object.keys(headers)
        .forEach((headerKey) => {
          const headerValue = headers[headerKey];

          res.append(headerKey, headerValue);
        });

      next();
    };

    this.app.use(headersMiddleware);

    return this;
  }

  protected setLogger() {
    this.app.use(this.expressLogger);

    return this;
  }

  protected setUnexpectedErrorHandler() {
    const handleError = (error: Error, _req: Request, res: ExpressResponse, next: NextFunction) => {
      const payload: APIError = { code: ErrorCodes.UNEXPECTED_ERROR };

      if (!this.isProductionEnv()) payload.error = error;

      this.logger.error(error);
      res.status(HTTPStatusCode.UNEXPECTED_ERROR).send(payload);

      next();
    }

    this.app.use(handleError);
  }

  protected buildEndpoints() {
    Object.keys(this.endpoints)
      .forEach((resource) => {
        const resourceRouter = express.Router();
        const endpoints = this.endpoints[resource];

        endpoints.forEach((endpoint) => {
          RESOURCE_EVENTS_SUPPORTED.forEach((eventName) => {
            const verb = eventName.substring(2).toLowerCase() as Verb;

            let play: Function;

            switch(verb) {
              case Verb.DELETE:
                play = resourceRouter.delete.bind(resourceRouter);
                break;
              case Verb.GET:
                play = resourceRouter.get.bind(resourceRouter);
                break;
              case Verb.POST:
                play = resourceRouter.post.bind(resourceRouter);
                break;
              case Verb.PUT:
                play = resourceRouter.put.bind(resourceRouter);
                break;
              default:
                // TODO: throw new PlayNotSupported(verb);
                return;
            }

            const middlewaresBuilt = endpoint
              .middlewares
              .map((middleware) => {
                return async (req: Request, res: ExpressResponse, next: NextFunction) => {
                  try {
                    await middleware(req, this, endpoint.resourceInstance);
                  } catch(error: any) {
                    if (error instanceof HTTPError) {
                      return res.status(error.statusCode).send(error.payload);
                    }

                    return next(error);
                  }

                  next();
                }
              });

            if (!play) return;

            try {
              play(
                `/${endpoint.path}`,
                middlewaresBuilt,
                this.buildController(endpoint.resourceInstance, eventName)
              )
            } catch (error) {
              if (error instanceof TokenNotUsed) return;

              throw error;
            }
          });
        });

        this.router.use(`/${resource}`, resourceRouter)
      });

    return this;
  }

  private buildController(resource: Monopoly, tokenName: Tokens) {
    return async (req: Request, res: ExpressResponse) => {
      resource.setTitles({
        logger: this.logger,
        ...this.dependencies
      });

      let moveToken: Function;

      switch(tokenName) {
        case Tokens.ON_DELETE:
          moveToken = resource.onDelete.bind(resource);
          break;
        case Tokens.ON_GET:
          moveToken = resource.onGet.bind(resource);
          break;
        case Tokens.ON_POST:
          moveToken = resource.onPost.bind(resource);
          break;
        case Tokens.ON_PUT:
          moveToken = resource.onPut.bind(resource);
          break;
        default:
          throw new TokenNotSupported(tokenName);
      }

      let result: Response;

      try {
        result = await moveToken(req);
      } catch (error) {
        if (error instanceof TokenNotUsed) throw error;

        if (!(error instanceof HTTPError)) {
          // eslint-disable-next-line no-ex-assign
          error = new HTTPInternalError(error);
        }

        if (!this.isProductionEnv()) error.showCause();
        if (error.statusCode >= HTTPStatusCode.UNEXPECTED_ERROR) {
          this.logger.error(error.cause);
        }

        result = {
          status: error.statusCode,
          data: error.payload
        };
      }

      return res.status(result.status).send(result.data);
    };
  }
}
