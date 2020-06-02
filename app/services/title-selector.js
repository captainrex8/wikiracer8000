'use strict';

const select = (titles, numToSelect) => {
    if (titles.length === 0) {
        return [];
    }

    // If the size of available titles is too close to the number of titles
    // we would like to select, it may take a long time to select. Hence,
    // we won't randomly pick titles unless the sample is 1.5x times larger.
    // TODO: Need better way to select randomly.
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

module.exports = {
    select
};
