'use strict';

class TitleSearch {
    constructor(start, title, parents, destination) {
        if (!start) {
            throw new Error('start cannot be empty');
        }

        if (!title) {
            throw new Error('title cannot be empty');
        }

        if (!destination) {
            throw new Error('destination cannot be empty');
        }
        
        this.start = start;
        this.title = title;
        this.parents = parents;
        this.destination = destination;
        this.duration = -1;
        this.searchNext = [];
    }
}

module.exports = TitleSearch;
