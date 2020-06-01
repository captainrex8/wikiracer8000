'use strict';

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

        const journey = await wikiracer.race(startTitle, endTitle);
    
        res.json({
            data: {
                startTitle,
                endTitle,
                message: journey.length ? 'race complete!' : 'race failed :(',
                journey
            }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    post
};
