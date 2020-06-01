jest.mock('../../../app/services/mediawiki');
jest.mock('../../../app/logger');
jest.mock('../../../app/services/mediawiki');

const TitleSearch = require('../../../app/models/title-search');

// Test target
const racer = require('../../../app/services/wiki-racer');

describe('racer', () => {
    describe('_getJourney', () => {
        it('should return the path of the search with duration of each step', () => {
            const start = 'Giant sloth';
            const mid = 'Ground sloth';
            const end = 'Sloth';

            const ts1 = new TitleSearch(start, start, [], end);
            ts1.duration = 123;
            const ts2 = new TitleSearch(start, mid, [ts1.title], end);
            ts2.duration = 121;

            const searched = new Map();
            searched.set(ts1.title, ts1);
            searched.set(ts2.title, ts2);

            const journey = racer._getJourney(searched, mid);
            expect(journey).toEqual([
                `${ts1.title} - ${ts1.duration}ms`,
                `${ts2.title} - ${ts2.duration}ms`,
                `${end}`,
            ])
        });
    });
});
