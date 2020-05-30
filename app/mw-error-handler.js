'use strict';

const uuid = require('uuid');
const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
    if (res.headerSent) {
        return next(err);
    }

    const id = uuid.v4();
    logger.error({
        id,
        error: err
    });

    if (err instanceof SyntaxError) {
        res.status(400).json({
            error: {
                id,
                message: err.message
            }
        });
    } else {
        res.status(500).json({
            error: {
                id,
                message: 'Unexpected error occurred'
            }
        });
    }
};

module.exports = errorHandler;
