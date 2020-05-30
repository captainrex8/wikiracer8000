jest.mock('../../../app/services/mediawiki');

const config = require('config');
// const mediawiki = require('../../../app/services/mediawiki');

// Test target
const racer = require('../../../app/services/racer');

describe('racer', () => {
    describe('_selectTitles', () => {
        it('should randomly pick a configured number of titles', async () => {
            const titles = [];
            for (let i = 0; i < 100; i++) {
                titles.push(`title-${i}`);
            }

            const selected = racer._selectTitles(titles);
            expect(selected.length).toEqual(config.get('settings.numConcurrentSearches'));
        });
    });

    describe('start', () => {

    });
});
