'use strict';

class TitleSearch {
    constructor(title, parent, destination) {
        if (!title) {
            throw new Error('title cannot be empty');
        }

        if (!destination) {
            throw new Error('destination cannot be empty');
        }
        
        this.title = title;
        this.parent = parent;
        this.destination = destination;
        this.duration = -1;
        this.searchNext = [];
    }
}

module.exports = TitleSearch;
