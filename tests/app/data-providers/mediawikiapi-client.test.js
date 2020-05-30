jest.mock('../../../app/logger');

const logger = require('../../../app/logger');
const config = require('config');

// Test target
const MediaWikiApiCleint = require('../../../app/data-providers/mediawikiapi-client');

const getClientConfig = () => ({
    baseUrl: config.get('mediaWikiApi.baseUrl'),
    timeout: 1000 * config.get('mediaWikiApi.timeoutInSeconds'),
    logger
});

describe('mediawikiapi-client', () => {
    describe('queryLinks', () => {
        it('should retrieve query result', async () => {
            const client = new MediaWikiApiCleint(getClientConfig());

            const result = await client.queryLinks('Tennessee');
            expect(result.query.pages).toBeInstanceOf(Array);
            expect(result.query.pages.length).toBeGreaterThan(0);
            expect(result.query.pages[0].links).toBeInstanceOf(Array);
            expect(result.query.pages[0].links.length).toBeGreaterThan(0);
        });
    });
});
