'use strict';

class Queue {
    constructor() {
        this._q = [];
    }

    enqueue(item) {
        this._q.push(item);
    }

    dequeue() {
        return this._q.shift();
    }

    getCount() {
        return this._q.length;
    }

    isEmpty() {
        return this._q.length === 0;
    }
}

module.exports = Queue;
