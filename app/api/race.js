'use strict';

const logger = require('../logger');
const wikiracer = require('../services/wiki-racer');

const post = async (req, res, next) => {
    const { start, end } = req.body;

    try {
        if (!start) {
            res.status(400).json({
                error: '\'start\' cannot be empty'
            });
            return;
        }
    
        if (!end) {
            res.status(400).json({
                error: '\'end\' cannot be empty'
            });
            return;
        }

        const startTitle = String(start);
        const endTitle = String(end);

        if (startTitle.toLowerCase() === endTitle.toLowerCase()) {
            res.status(400).json({
                error: '\'start\' and \'end\' cannot be the same'
            });
            return;
        }

        const startTime = new Date();
        await wikiracer.race(startTitle, endTitle);
        const endTime = new Date();
        logger.info(endTime - startTime);
    
        res.json({
            data: {
                startTitle,
                endTitle
            }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    post
};
