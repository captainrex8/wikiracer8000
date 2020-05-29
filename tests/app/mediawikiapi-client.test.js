const config = require('config');

// Test target
const MediaWikiApiCleint = require('../../app/mediawikiapi-client');

describe('mediawikiapi-client', () => {
    describe('getLinksForTitle', () => {
        it('should work', async () => {
            const clientConfig = {
                baseUrl: config.get('mediaWikiApi.baseUrl'),
                timeout: 1000 * config.get('mediaWikiApi.timeoutInSeconds')
            };

            const client = new MediaWikiApiCleint(clientConfig);

            const result = await client.getLinksForTitle('Tennessee');
            expect(result).toBeDefined();
        });
    });
});
