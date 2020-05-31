'use strict';

const get = (req, res) => {
    res.json({
        data: {
            message: 'I am still alive!'
        }
    });
};

module.exports = {
    get
};
