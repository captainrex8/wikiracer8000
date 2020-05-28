'use strict';

const log = (stuff) => console.log(stuff);

module.exports = {
    debug: log,
    info: log,
    warn: log,
    error: log,
    fatal: log
};
