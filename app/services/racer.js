'use strict';

const config = require('config');
const logger = require('../logger');
const TitleSearch = require('../models/title-search');
const mediawiki = require('./mediawiki');

const _selectTitles = (titles, numToSelect) => {
    if (titles.length === 0) {
        return [];
    }

    if (titles.length <= numToSelect * 1.5) {
        return titles.slice(0, numToSelect);
    }

    const selected = [];
    while(selected.length < numToSelect) {
        const index = Math.floor(Math.random() * Math.floor(titles.length - 1));
        const title = titles[index];

        selected.push(title);
    }

    return selected;
};

const _search = async (titleSearch, numToSelect) => {
    const { title, destination } = titleSearch;

    try {
        const start = new Date();
        const isLinkedToDestination = await mediawiki.isLinked(title, destination);

        if (isLinkedToDestination) {
            titleSearch.searchNext.push(titleSearch.destination);
            const end = new Date();
            titleSearch.duration = end - start;

            return titleSearch;
        } else {
            const titles = await mediawiki.getAllLinkedTitles(title);

            titleSearch.searchNext = [..._selectTitles(titles, numToSelect)];
            const end = new Date();
            titleSearch.duration = end - start;

            return titleSearch;
        }    
    } catch (err) {
        logger.error(err);
    }
};

const _logSearchResult = (searchId, ts, numInQueue) => {
    let idStr;
    if (searchId > -1) {
        idStr = searchId + '';
        while (idStr.length < config.get('settings.numMaxSearches').toString().length) idStr = '0' + idStr;
    } else {
        idStr = 'start';
    }

    const parent = ts.parent.length ? ts.parent[ts.parent.length - 1] : '';

    logger.info(`${idStr} ${parent} -> ${ts.title} | ${ts.duration}ms | Queued: ${numInQueue}`);
}

const _getJourney = (searched, start, startAt) => {
    const journey = [];
    let ts = searched.get(startAt);
    while(ts) {
        journey.unshift(ts.title);
        if (ts.title === start) break;
        ts = searched.get(ts.parent);
    }

    return journey;
};

const start = async (start, destination) => {
    const searched = new Map();

    const NUM_CONCURRENT_SEARCHES = config.get('settings.numConcurrentSearches');
    const NUM_MAX_SEARCHES = config.get('settings.numMaxSearches');

    let searchId = 0;
    let destionationParent = '';
    let toSearch = [new TitleSearch(start, start, [], destination)];

    while(!destionationParent && toSearch.length && searchId < NUM_MAX_SEARCHES) {
        const searches = toSearch.splice(0, NUM_CONCURRENT_SEARCHES);
        const promises = searches.map((ts) => _search(ts, NUM_CONCURRENT_SEARCHES));
        const results = await Promise.all(promises);

        results.forEach((ts) => {
            searched.set(ts.title, ts);

            if (ts.searchNext.some((title) => title === destination)) {
                destionationParent = ts.title;
            } else {
                ts.searchNext.forEach((next) => {
                    const parents = ts.parent.slice();
                    parents.push(ts.title);
                    if (toSearch.length < NUM_MAX_SEARCHES) {
                        toSearch.push(new TitleSearch(start, next, parents, ts.destination));
                    }
                });
            }

            _logSearchResult(searchId, ts, toSearch.length);

            searchId++;
        });
    }

    const journey = destionationParent ? searched.get(destionationParent).parents : [];

    return { journey };
};

module.exports = {
    _selectTitles,
    _search,
    _getJourney,

    start
};
