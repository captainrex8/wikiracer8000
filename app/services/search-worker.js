'use strict';

const logger = require('../logger');
const mediawiki = require('./mediawiki');
const titleSelector = require('./title-selector');

const find = async (title, target) => {
    const isLinkedToend = await mediawiki.isLinked(title, target);

    if (isLinkedToend) {
        return {
            isFound: true,
            linkedTitles: []
        };
    }

    let titles = await mediawiki.getAllLinkedTitles(title);

    return {
        isFound: false,
        linkedTitles: titles
    }
};

const search = async (titleSearch, numToSelect) => {
    const { title, end } = titleSearch;

    try {
        const start = new Date();
        const isLinkedToend = await mediawiki.isLinked(title, end);

        if (isLinkedToend) {
            titleSearch.searchNext.push(titleSearch.end);
            const end = new Date();
            titleSearch.duration = end - start;

            return titleSearch;
        } else {
            const titles = await mediawiki.getAllLinkedTitles(title);

            titleSearch.searchNext = [...titleSelector.select(titles, numToSelect)];
            const end = new Date();
            titleSearch.duration = end - start;

            return titleSearch;
        }
    // TODO: move logging and try .. catch out of this
    //       function and onto the consuming level.
    } catch (err) {
        
        logger.error(err);
    }
};

module.exports = {
    find,
    search
};
