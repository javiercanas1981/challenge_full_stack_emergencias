// infrastructure/log/requestLogger.ts
import { loggerFactory } from "./loggerFactory";

export function requestLogger() {
  return (function () {
    const logger = loggerFactory();

    return {
      logger: logger,

      addDefaultLogger: function ({
        app,
        bodyParser,
        schema,
      }: {
        app: any;
        bodyParser?: any;
        schema?: any;
      }) {
        app.use((req: any, res: any, next: any) => {
          const startTime = Date.now();

          const extendedInfo = {
            method: req.method,
            url: req.originalUrl || req.url,
            params: req.params,
            query: req.query,
            body: req.method !== "GET" && req.body ? req.body : undefined,
            ip: req.ip || req.connection?.remoteAddress,
            userAgent: req.get("user-agent"),
          };

          logger.send("Request received", "debug", extendedInfo);

          res.on("finish", () => {
            const duration = Date.now() - startTime;
            const responseInfo = {
              method: req.method,
              url: req.originalUrl || req.url,
              statusCode: res.statusCode,
              duration: `${duration}ms`,
            };

            if (res.statusCode >= 400) {
              logger.send("Request completed with error", "warn", responseInfo);
            } else {
              logger.send(
                "Request completed successfully",
                "info",
                responseInfo,
              );
            }
          });

          next();
        });

        return { app, bodyParser, schema, logger };
      },

      addErrorLogger: function (app: any) {
        app.use((err: any, req: any, _res: any, next: any) => {
          const extendedInfo = {
            method: req.method,
            url: req.originalUrl || req.url,
            params: req.params,
            query: req.query,
            body: req.method !== "GET" && req.body ? req.body : undefined,
            error: {
              message: err.message,
              stack: err.stack,
              status: err.status || 500,
            },
          };

          logger.send("Request ended with error", "error", extendedInfo);
          return next(err);
        });

        return app;
      },
    };
  })();
}
