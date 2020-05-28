'use strict';

const express = require('express');
const ping = require('./controllers/ping');

const router = express.Router();

router.route('/ping').get(ping.get);

module.exports = router;
