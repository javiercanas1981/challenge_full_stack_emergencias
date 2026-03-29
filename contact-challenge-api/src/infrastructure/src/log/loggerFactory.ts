export function loggerFactory() {
  return (function () {
    const LOG_LEVEL = process.env.LOG_LEVEL || "info";
    const SERVICE_NAME = process.env.SERVICE_NAME || "api-rest";

    console.log(`process.env.LOG_LEVEL: ${LOG_LEVEL}`);

    const levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };

    const currentLevel =
      levels[LOG_LEVEL as keyof typeof levels] || levels.info;

    function shouldLog(level: string): boolean {
      const levelValue = levels[level as keyof typeof levels];
      return levelValue !== undefined && levelValue >= currentLevel;
    }

    function validateParams(message: string, level: string) {
      if (!message || typeof message !== "string") {
        throw new Error(
          "Missing message parameter or wrong type. Expected type: STRING",
        );
      }

      if (!level || typeof level !== "string") {
        throw new Error(
          "Missing level parameter or wrong type. Expected type: STRING",
        );
      }

      if (!["debug", "info", "warn", "error"].includes(level.toLowerCase())) {
        throw new Error(`Invalid level parameter value: ${level}`);
      }
    }

    function formatMessage(message: string, level: string, extendObj?: any) {
      validateParams(message, level);

      return {
        service_name: SERVICE_NAME,
        message: message,
        level: level.toLowerCase(),
        timestamp: new Date().toISOString(),
        ...(extendObj || {}),
      };
    }

    function simpleLogger(messageObj: any, callback?: () => void) {
      if (!shouldLog(messageObj.level)) {
        if (callback) callback();
        return;
      }

      const timestamp = messageObj.timestamp;
      const level = messageObj.level.toUpperCase();
      const service = messageObj.service_name;
      const msg = messageObj.message;

      const {
        service_name,
        message,
        level: lvl,
        timestamp: ts,
        ...meta
      } = messageObj;

      const metaStr = Object.keys(meta).length
        ? JSON.stringify(meta, null, 2)
        : "";

      const colors = {
        debug: "\x1b[36m",
        info: "\x1b[32m",
        warn: "\x1b[33m",
        error: "\x1b[31m",
        reset: "\x1b[0m",
      };

      const color =
        colors[messageObj.level as keyof typeof colors] || colors.info;

      console.log(
        `${color}[${timestamp}] [${level}] [${service}] - ${msg}${metaStr ? "\n" + metaStr : ""}${colors.reset}`,
      );

      if (callback && typeof callback === "function") {
        callback();
      }
    }

    return {
      send: async function (
        message: string,
        level: string,
        extendObj?: any,
        callback?: () => void,
      ) {
        const messageObject = formatMessage(message, level, extendObj);
        simpleLogger(messageObject, callback);
      },
    };
  })();
}
