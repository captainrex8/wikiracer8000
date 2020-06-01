'use strict';

class TitleSearch {
    constructor(start, title, parents, end) {
        if (!start) {
            throw new Error('start cannot be empty');
        }

        if (!title) {
            throw new Error('title cannot be empty');
        }

        if (!end) {
            throw new Error('end cannot be empty');
        }
        
        this.start = start;
        this.title = title;
        this.parents = parents;
        this.end = end;
        this.duration = -1;
        this.searchNext = [];
    }
}

module.exports = TitleSearch;
