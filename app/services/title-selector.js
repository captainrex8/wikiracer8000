'use strict';

const select = (titles, numToSelect) => {
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

module.exports = {
    select
};
