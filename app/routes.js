'use strict';

const express = require('express');
const ping = require('./controllers/ping');
const race = require('./controllers/race');

const router = express.Router();

router.route('/ping').get(ping.get);

router.route('/race').post(race.post);

module.exports = router;
