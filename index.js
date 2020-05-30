'use strict';

const pacakge = require('./package.json');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const helmet = require('helmet');
const compression = require('compression');
const logger = require('./app/logger');
const routes = require('./app/routes');
const errorHandlerMiddleware = require('./app/mw-error-handler');

const server = express();
const MAX_REQUEST_SIZE = config.get('express.maxRequestSize');
const PORT = config.get('express.port');

const uncaughtExceptionHandler = (error) => {
    logger.fatal({ error });
    process.exit(1);
};

const unhandledRejectionHandler = ({ message, stack}) => {
    logger.warn({
        isUnhandledRejection: true,
        message,
        stack
    });
};

const initServer = (port) => {
    server.use(helmet());
    server.use(compression({ threshold: 0 }));
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(bodyParser.json({ limit: MAX_REQUEST_SIZE }));
    server.use('/api/v1', routes);
    server.use(errorHandlerMiddleware);

    return new Promise((resolve, reject) => {
        server.listen(port, (err) => {
            err ? reject(err) : resolve();
        });
    });
}

const start = async () => {
    process.on('uncaughtException', uncaughtExceptionHandler);
    process.on('unhandledRejection', unhandledRejectionHandler);

    logger.info(`starting ${config.get('serviceName')} v${pacakge.version} on port ${PORT}...`);
    await initServer(PORT);
    logger.info('started. listening on traffic ...');
};

start();
