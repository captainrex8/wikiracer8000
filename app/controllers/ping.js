'use strict';

const get = (req, res) => {
    res.json({
        data: 'ping!'
    });
};

module.exports = {
    get
};
