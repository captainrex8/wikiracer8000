'use strict';

const config = require('config');
const winston = require('winston');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: config.get('logger.level'),
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// NOTE: Serialize js object to JSON to avoid being logged as [Object object]
const log = (level, item) => logger[level](typeof item === 'string' ? item : JSON.stringify(item, null, 2));

const debug = (item) => log('debug', item);
const info = (item) => log('info', item);
const warn = (item) => log('warn', item);
const error = (item) => log('error', item);
const fatal = (item) => log('error', item);

module.exports = {
    debug,
    info,
    warn,
    error,
    fatal
};
