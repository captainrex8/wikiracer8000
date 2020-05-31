'use strict';

class TitleSearchResult {
    constructor(titleSearch, duration) {
        if (!titleSearch) {
            throw new Error('title cannot be empty');
        }

        if (!destination) {
            throw new Error('destination cannot be empty');
        }
        
        this.title = title;
        this.parent = parent;
        this.destination = destination;
        this.duration = duration;
    }
}

module.exports = TitleSearch;
