import { createLogger, transports, format } from "winston";

export const logger = createLogger({
  level: "debug",
  format: format.json(),
  transports: [
    new transports.File({ filename: "errors.log", level: "error" }),
    new transports.File({ filename: "combind.log" }),
  ],
});

logger.add(new transports.Console({ format: format.simple() }));
