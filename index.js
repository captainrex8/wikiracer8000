'use strict';

const pacakge = require('./package.json');
const server = require('express')();
const bodyParser = require('body-parser');
const config = require('config');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const logger = require('./app/logger');
const routes = require('./app/routes');

const MAX_REQUEST_SIZE = config.get('express.maxRequestSize');
const PORT = config.get('express.port');

server.use(helmet());
server.use(compression({ threshold: 0 }));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json({ limit: MAX_REQUEST_SIZE }));
server.use('/api/v1', routes);

const startServer = (port) => {
    return new Promise((resolve, reject) => {
        server.listen(port, (err) => {
            err ? reject(err) : resolve();
        });
    });
}

const start = async () => {
    logger.info(`starting ${config.get('serviceName')} v${pacakge.version} on port ${PORT}...`);
    await startServer(PORT);
};

start();
