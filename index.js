'use strict';

const pacakge = require('./package.json');
const express = require('express');
const cors = require('cors');
const csurf = require('csurf'); // eslint-disable-line no-unused-vars
const bodyParser = require('body-parser');
const config = require('config');
const helmet = require('helmet');
const compression = require('compression');
const logger = require('./app/logger');
const routes = require('./app/api/routes');
const errorHandlerMiddleware = require('./app/api/mw-error-handler');

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

const makeErrorSerializable = () => {
    if (!('toJSON' in Error.prototype))
    Object.defineProperty(Error.prototype, 'toJSON', {
        value: function () {
            var alt = {};

            Object.getOwnPropertyNames(this).forEach(function (key) {
                alt[key] = this[key];
            }, this);

            return alt;
        },
        configurable: true,
        writable: true
    });
}

const initServer = (port) => {
    server.use(helmet());
    server.use(compression({ threshold: 0 }));
    server.use(cors()); // Add restrictions when there's UI
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

    makeErrorSerializable();

    logger.info(`starting ${config.get('serviceName')} v${pacakge.version} on port ${PORT}...`);
    await initServer(PORT);
    logger.info('started. listening on traffic ...');
};

start();
