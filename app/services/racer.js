'use strict';

const config = require('config');
const mediawiki = require('./mediawiki');

const _selectTitles = (titles) => {
    const selected = new Map();

    const numTitles = config.get('settings.numConcurrentSearches');

    while(selected.size < numTitles) {
        const index = Math.floor(Math.random() * Math.floor(titles.length));
        const title = titles[index];
        selected.set(title.toLowerCase(), title);
    }

    return [...selected.values()];
};

const start = async (fromTitle, toTitle) => {
    const isDirectlyLinked = await mediawiki.isLinked(fromTitle, toTitle);

    let links;
    let linksContainingToTitle;
    let linksToSearch;
    if (!isDirectlyLinked) {
        links = await mediawiki.getAllLinkedTitles(fromTitle);

        linksContainingToTitle = links.filter((links) => {
            return links.toLowerCase().indexOf(toTitle.toLowerCase()) > -1
        });

        linksToSearch = _selectTitles(links);
    }

    return {
        isDirectlyLinked,
        linksContainingToTitle,
        numLinks: links.length,
        linksToSearch
    };
};

module.exports = {
    _selectTitles,
    start
};
