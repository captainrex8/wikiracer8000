'use strict';

const config = require('config');
const logger = require('../logger');
const TitleSearch = require('../models/title-search');
const mediawiki = require('./mediawiki');

const _selectTitles = (titles, numToSelect) => {
    if (titles.length === 0) {
        return [];
    }

    if (titles.length <= numToSelect) {
        return [...titles];
    }

    const selected = new Map();

    while(selected.size < numToSelect) {
        const index = Math.floor(Math.random() * Math.floor(titles.length - 1));
        const title = titles[index];

        // Maybe we shouldn't pick titles starting with numbers 
        // if the end title doesn't start with numbers.

        selected.set(title.toLowerCase(), title);
    }

    return [...selected.values()];
};

const NUM_TO_SELECT = 50;

const _search = async (titleSearch) => {
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
            const links = await mediawiki.getAllLinkedTitles(title);

            // logger.info(`"${titleSearch.title}" has ${links.length} linked titles`);
        
            titleSearch.searchNext = [..._selectTitles(links, NUM_TO_SELECT)];
            const end = new Date();
            titleSearch.duration = end - start;

            return titleSearch;
        }    
    } catch (err) {
        logger.error(err);
    }
};

const STOP_AT = 5000;

const _logSearchResult = (searchId, ts, numInQueue) => {
    let idStr;
    if (searchId > -1) {
        idStr = searchId + '';
        while (idStr.length < STOP_AT.toString().length) idStr = '0' + idStr;
    } else {
        idStr = 'start';
    }

    logger.info(`${idStr} ${ts.parent} -> ${ts.title} | ${ts.duration}ms | Queued: ${numInQueue}`);
}

const start = async (start, destination) => {
    const searched = new Map();

    const NUM_SEARCHES = config.get('settings.numConcurrentSearches');

    let searchId = 0;
    let isFound = false;
    let toSearch = [new TitleSearch(start, null, destination)];

    while(!isFound && toSearch.length && searchId < STOP_AT) {
        const searches = toSearch.splice(0, NUM_SEARCHES);
        const promises = searches.map(_search);
        const results = await Promise.all(promises);

        results.forEach((ts) => {
            searched.set(ts.title, ts);

            if (ts.searchNext.some((title) => title === destination)) {
                isFound = true;
            } else {
                ts.searchNext.forEach((title) => {
                    toSearch.push(new TitleSearch(title, ts.title, ts.destination));
                });
            }

            _logSearchResult(searchId, ts, toSearch.length);

            searchId++;
        });
    }

    return { isFound };
};

module.exports = {
    _selectTitles,
    start
};
