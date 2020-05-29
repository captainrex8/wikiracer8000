'use strict';

const get = (req, res) => {
    res.json({
        data: 'I am still alive!'
    });
};

module.exports = {
    get
};
