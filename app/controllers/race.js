'use strict';

const wikiracer = require('../services/wiki-racer');

const post = async (req, res, next) => {
    const { from, to } = req.body;

    try {
        if (!from) {
            res.status(400).json({
                error: '\'from\' cannot be empty'
            });
            return;
        }
    
        if (!to) {
            res.status(400).json({
                error: '\'to\' cannot be empty'
            });
            return;
        }

        const fromTitle = String(from);
        const toTitle = String(to);

        if (fromTitle.toLowerCase() === toTitle.toLowerCase()) {
            res.status(400).json({
                error: '\'from\' and \'to\' cannot be the same'
            });
            return;
        }

        const result = await wikiracer.race(fromTitle, toTitle);
    
        res.json({
            data: {
                fromTitle,
                toTitle,
                ...result
            }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    post
};
