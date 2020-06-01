jest.mock('../../../app/services/mediawiki');
jest.mock('../../../app/logger');
jest.mock('../../../app/services/mediawiki');

const TitleSearch = require('../../../app/models/title-search');

// Test target
const racer = require('../../../app/services/wiki-racer');

describe('racer', () => {
    describe('_selectTitles', () => {
        it('should return empty array given empty titles array', () => {
            const selected = racer._selectTitles([], 10);
            expect(selected.length).toEqual(0);
        });

        it('should first numToSelect elements of the titles array given number of titles is less than 1.5x of the number to numToSelect', () => {
            const numToSelect = 10;
            const numTitles = numToSelect * 1.2;
            const titles = [];
            for (let i = 0; i < numTitles; i++) {
                titles.push(`title-${i}`);
            }
            const selected = racer._selectTitles(titles, numToSelect);
            expect(selected.length).toEqual(numToSelect);
            expect(selected).toEqual(titles.slice(0, numToSelect));
        });

        it('should first numToSelect elements of the titles array given number of titles is equal to 1.5x of the number to numToSelect', () => {
            const numToSelect = 10;
            const numTitles = numToSelect * 1.5;
            const titles = [];
            for (let i = 0; i < numTitles; i++) {
                titles.push(`title-${i}`);
            }
            const selected = racer._selectTitles(titles, numToSelect);
            expect(selected.length).toEqual(numToSelect);
            expect(selected).toEqual(titles.slice(0, numToSelect));
        });

        it('should randomly pick a number of titles given title count is 1.5 larger than numToSelect', async () => {
            const numToSelect = 10;
            const numTitles = numToSelect * 1.5 + 1;
            const titles = [];
            for (let i = 0; i < numTitles; i++) {
                titles.push(`title-${i}`);
            }

            const selected = racer._selectTitles(titles, 10);
            expect(selected.length).toEqual(numToSelect);
        });
    });

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
