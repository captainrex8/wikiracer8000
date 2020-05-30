jest.mock('../../../app/logger');
// jest.mock('../../../app/data-providers/mediawikiapi-client');

const MediaWikiApiCleint = require('../../../app/data-providers/mediawikiapi-client');

// Test target
const mediawiki = require('../../../app/services/mediawiki');

describe('mediawiki', () => {
    describe('isLinked', () => {
        it('should return true given titles are linked', async () => {
            const result = await mediawiki.isLinked('Ground sloth', 'Sloth');
            expect(result).toEqual(true);
        });
    });

    describe('getAllLinkedTitles', () => {
        it('should return all linked titles given multiple pages of data', async () => {
            const result = await mediawiki.getAllLinkedTitles('Tennessee');
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBeGreaterThan(MediaWikiApiCleint.LIMIT_MAX);
        });
    });
});
