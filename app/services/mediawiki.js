'use strict';

const config = require('config');
const logger = require('../logger');
const MediaWikiApiCleint = require('../data-providers/mediawikiapi-client');

const client = new MediaWikiApiCleint({
    baseUrl: config.get('mediaWikiApi.baseUrl'),
    timeoutInSeconds: config.get('mediaWikiApi.timeoutInSeconds'),
    logger
});

const _getLinks = (data) => {
    const links = data &&
        data.query &&
        data.query.pages &&
        data.query.pages[0] &&
        data.query.pages[0].links;

    return (links || []).map((link) => link && link.title); 
};

const isLinked = async (fromTitle, toTitle) => {
    if (!fromTitle) {
        throw new Error('fromTitle cannot be empty');
    }

    if (!toTitle) {
        throw new Error('toTitle cannot be empty');
    }

    const data = await client.queryLinks(fromTitle, toTitle);
    const links = _getLinks(data);

    return links.length > 0;
};

const getAllLinkedTitles = async (title) => {
    if (!title) {
        throw new Error('title cannot be empty');
    }

    let data = await client.queryLinks(
        title,
        null,
        MediaWikiApiCleint.LIMIT_MAX
    );

    let allLinks = _getLinks(data);

    while(data.continue && data.continue.plcontinue) {
        data = await client.queryLinks(
            title,
            null,
            MediaWikiApiCleint.LIMIT_MAX,
            data.continue.plcontinue
        );

        allLinks = allLinks.concat(_getLinks(data));
    }

    return allLinks;
};

const getFirstPageOfLinkedTitles = async (title) => {
    if (!title) {
        throw new Error('title cannot be empty');
    }

    let data = await client.queryLinks(
        title,
        null,
        100
        // MediaWikiApiCleint.LIMIT_MAX
    );

    return _getLinks(data);
};

module.exports = {
    isLinked,
    getAllLinkedTitles,
    getFirstPageOfLinkedTitles
};
