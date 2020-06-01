jest.mock('../../../app/logger');
jest.mock('../../../app/data-providers/mediawikiapi-client');

const MediaWikiApiCleint = require('../../../app/data-providers/mediawikiapi-client');

// Test target
const mediawiki = require('../../../app/services/mediawiki');

describe('mediawiki', () => {
    describe('isLinked', () => {
        it('should return true given titles are linked', async () => {
            const response = {
                query: {
                    pages: [
                        {
                            links: [{ title: 'Sloth' }]
                        }
                    ]
                }
            };

            MediaWikiApiCleint.prototype.queryLinks.mockResolvedValue(response);

            const result = await mediawiki.isLinked('Ground sloth', 'Sloth');
            expect(result).toEqual(true);
        });
    });

    describe('getAllLinkedTitles', () => {
        it('should return all linked titles given multiple pages of data', async () => {
            const responseP1 = {
                continue: {
                    plcontinue: '123|0|abc'
                },
                query: {
                    pages: [
                        { links: [{ title: 'abc' }] }
                    ]
                }
            };

            const responseP2 = {
                continue: {
                },
                query: {
                    pages: [
                        { links: [{ title: 'cde' }] }
                    ]
                }
            };

            MediaWikiApiCleint.prototype.queryLinks.mockResolvedValueOnce(responseP1);
            MediaWikiApiCleint.prototype.queryLinks.mockResolvedValueOnce(responseP2);

            const result = await mediawiki.getAllLinkedTitles('Tennessee');
            expect(result).toBeInstanceOf(Array);
            expect(result).toEqual(['abc','cde']);
        });
    });
});
