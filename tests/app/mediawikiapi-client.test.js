const config = require('config');

// Test target
const MediaWikiApiCleint = require('../../app/mediawikiapi-client');

const getClientConfig = () => ({
    baseUrl: config.get('mediaWikiApi.baseUrl'),
    timeout: 1000 * config.get('mediaWikiApi.timeoutInSeconds')
});

describe('mediawikiapi-client', () => {
    describe('isLinked', () => {
        it('should work', async () => {
            const client = new MediaWikiApiCleint(getClientConfig());

            const result = await client.isLinked('Tennessee', 'Sloth');
            expect(result).toEqual(false);
        });
    });

    describe('getLinkedTitles', () => {
        it('should work', async () => {
            const client = new MediaWikiApiCleint(getClientConfig());

            const result = await client.getLinkedTitles('Tennessee');
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toEqual(10);
        });
    });
});
