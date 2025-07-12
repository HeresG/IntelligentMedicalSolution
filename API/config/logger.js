import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.printf(({ level, message, timestamp, ...meta }) => {
        const { method, url, statusCode } = meta;
        const coloredStatusCode = (statusCode >= 400) ? `\x1b[31m${statusCode}\x1b[0m` : `\x1b[32m${statusCode}\x1b[0m`; 

        return `[${level}][${method || 'undefined'} - ${coloredStatusCode || 'undefined'}]: ${url || 'undefined'} (${timestamp})`;
      })
    )
  }));
}

// Middleware for request logging
export const logRequest = (req, res, next) => {
  res.on('finish', () => {
    logger.info(`Request handled`, {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode
    });
  });
  next();
};
