// Test target
const titleSelector = require('../../../app/services/title-selector');

describe('title-selector', () => {
    describe('select', () => {
        it('should return empty array given empty titles array', () => {
            const selected = titleSelector.select([], 10);
            expect(selected.length).toEqual(0);
        });

        it('should first numToSelect elements of the titles array given number of titles is less than 1.5x of the number to numToSelect', () => {
            const numToSelect = 10;
            const numTitles = numToSelect * 1.2;
            const titles = [];
            for (let i = 0; i < numTitles; i++) {
                titles.push(`title-${i}`);
            }
            const selected = titleSelector.select(titles, numToSelect);
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
            const selected = titleSelector.select(titles, numToSelect);
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

            const selected = titleSelector.select(titles, 10);
            expect(selected.length).toEqual(numToSelect);
        });
    });
});
