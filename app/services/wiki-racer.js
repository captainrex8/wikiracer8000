'use strict';

const config = require('config');
const Queue = require('../models/queue');
const logger = require('../logger');
const TitleSearch = require('../models/title-search');
const searchWorker = require('./search-worker');
const mediawiki = require('./mediawiki');
require('dns');
require('dnscache')({
    enable : true,
    ttl : 300,
    cachesize : 1000
});

const _logSearchResult = (searchId, ts, numInQueue) => {
    let idStr;
    if (searchId > -1) {
        idStr = searchId + '';
        while (idStr.length < config.get('settings.numMaxSearches').toString().length) idStr = '0' + idStr;
    } else {
        idStr = 'start';
    }

    const parent = ts.parents.length ? ts.parents[ts.parents.length - 1] : '';

    logger.info(`${idStr} ${parent} -> ${ts.title} | ${ts.duration}ms | Queued: ${numInQueue}`);
}

const _getJourney = (searched, lastTitle) => {
    const lastTitleSearch = searched.get(lastTitle);
    const path = [...lastTitleSearch.parents];
    path.push(lastTitle);
    const journey = path.map((p) => {
        const ts = searched.get(p);
        return `${p} - ${ts.duration}ms`;
    });
    journey.push(lastTitleSearch.end);

    return journey;
};

const queueTitles = (q, titles, end) => {
    if (end[0].toLowerCase() < 'n') {
        for (let i = 0; i < titles.length; i++) {
            q.enqueue(titles[i]);
        }
    } else {
        for (let i = titles.length - 1; i >= 0; i--) {
            q.enqueue(titles[i]);
        }
    }
};

const race = async (start, end) => {
    const isLinked = await mediawiki.isLinked(start, end);

    if (isLinked) return;

    let titles = await mediawiki.getAllLinkedTitles(start);

    const q = new Queue();
    const nextLayerQ = new Queue();

    queueTitles(q, titles, end);

    const searched = new Map();
    searched.set(start.toLowerCase(), true);

    let batch = [];

    let numSearched = 1;
    while(!q.isEmpty()) {
        if (numSearched >= config.get('settings.numMaxSearches')) {
            break;
        }

        const title = q.dequeue();
        nextLayerQ.enqueue(title);
        if (searched.has(title.toLowerCase())) {
            continue;
        }

        searched.set(title.toLowerCase(), true);
        numSearched++;
        const run1 = async (numSearched) => {
            try {
                const result = await mediawiki.isLinked(title, end);
                logger.info(`${numSearched.toString().padStart(4,'0')} ${result ? '\x1b[33mT\x1b[0m' : 'F'} ${title} ...`);
                return result;
            } catch (err) {
                logger.error(`${numSearched.toString().padStart(4,'0')} E ${err.message}`);
                return false;
            }
        };

        batch.push(run1(numSearched));

        if (batch.length === 250 || (q.isEmpty() && batch.length > 0)) {
            const results = await Promise.all(batch);
            logger.info('============= BATCH END ======');

            if (results.some((r) => r)) {
                logger.info('FOUND!');
                batch = [];
                break;
            }

            batch = [];
        }
        
        if (q.isEmpty() && !nextLayerQ.isEmpty()) {
            const nextLayerTitle = nextLayerQ.dequeue();
            const moreTitles = await mediawiki.getAllLinkedTitles(nextLayerTitle);
            queueTitles(q, moreTitles, end);
            logger.info(`============= QUEUED MORE TITLES: ${moreTitles.length} ======`);
        }
    }

    logger.info('=================== END ======');
    logger.info(`==== SEARCHED: ${searched.size} ===`);
};

const race_old = async (start, end) => {
    const NUM_CONCURRENT_SEARCHES = config.get('settings.numConcurrentSearches');
    const NUM_MAX_SEARCHES = config.get('settings.numMaxSearches');
    
    const searched = new Map();
    const queue = [];

    let searchId = 0;
    let lastTitle = '';

    queue.push(new TitleSearch(start, start, [], end));

    // NOTE: The race will stop either:
    //       - We are at the last title before the destionation
    //       - There is nothing more to search (complete dead end everywhere)
    //       - We searched long enough and it is time to call it quit
    while(!lastTitle && queue.length && searchId < NUM_MAX_SEARCHES) {
        const batch = queue.splice(0, NUM_CONCURRENT_SEARCHES);
        const promises = batch.map((ts) => searchWorker.search(ts, NUM_CONCURRENT_SEARCHES));
        const results = await Promise.all(promises);

        results.forEach((ts) => {
            searched.set(ts.title, ts);

            if (ts.searchNext.some((title) => title === end)) {
                lastTitle = ts.title;
            } else {
                ts.searchNext.forEach((next) => {
                    const parents = [...ts.parents];
                    parents.push(ts.title);
                    if (queue.length < NUM_MAX_SEARCHES) {
                        queue.push(new TitleSearch(start, next, parents, ts.end));
                    }
                });
            }

            _logSearchResult(searchId, ts, queue.length);

            searchId++;
        });
    }

    let journey = lastTitle ? _getJourney(searched, lastTitle) : [];

    return journey;
};

module.exports = {
    _getJourney,
    race,
    race_old
};
