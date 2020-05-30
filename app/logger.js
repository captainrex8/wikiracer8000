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

module.exports = logger;
