'use strict';

const axios = require('axios');
const config = require('config');

const QUERY_PARAMS = 'action=query&format=json&formatversion=2&prop=links&plnamespace=0';

class MediaWikiApiCleint {
    constructor (config) {
        this._baseUrl = config.baseUrl;
        this._timeout = config.timeout;
    }

    isLinked(fromTitle, toTitle) {

    }

    static _getBaseParams() {
        return {
            action: 'query',
            format: 'json',
            formatversion: 2,
            prop: 'links',
            plnamespace: 0,
        };
    }

    async getLinksForTitle(title, limit = 10, plcontinue = '') {
        const params = MediaWikiApiCleint._getBaseParams();
        params.titles = title;
        params.pllimit = limit;

        if (plcontinue) {
            params.plcontinue = plcontinue;
        }

        // Make the call to get data
        const response = await axios.get(this._baseUrl, {
            params,
            timeout: this._timeout
        });

        const links = response &&
            response.data &&
            response.data.query &&
            response.data.query.pages &&
            response.data.query.pages[0] &&
            response.data.query.pages[0].links;

        return (links || []).map((link) => link && link.title);
    }

    // Nice to have
    async getLinksWithUrl(title) {

    }
}

module.exports = MediaWikiApiCleint;
