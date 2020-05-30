'use strict';

const racer = require('../services/racer');

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

        const result = await racer.start(fromTitle, toTitle);
    
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
