'use strict';

const axios = require('axios');
const config = require('config');

class MediaWikiApiCleint {
    constructor (config) {
        this._baseUrl = config.baseUrl;
        this._timeout = config.timeout;
    }

    static getBaseParams() {
        return {
            action: 'query',
            format: 'json',
            formatversion: 2,
            prop: 'links',
            plnamespace: 0
        }
    }

    async _queryLinkedTitles(params){
        const response = await axios.get(
            this._baseUrl,
            {
                params,
                timeout: this._timeout
            }
        );
    
        const links = response &&
            response.data &&
            response.data.query &&
            response.data.query.pages &&
            response.data.query.pages[0] &&
            response.data.query.pages[0].links;
    
        return (links || []).map((link) => link && link.title);
    };

    /**
     * isLinked
     * @param {string} fromTitle 
     * @param {string} toTitle 
     * @returns {boolean} if the two titles are linked
     */
    async isLinked(fromTitle, toTitle) {
        if (!fromTitle) {
            throw new Error('fromTitle cannot be empty');
        }

        if (!toTitle) {
            throw new Error('toTitle cannot be empty');
        }

        const params = MediaWikiApiCleint.getBaseParams();
        params.titles = fromTitle;
        params.pltitles = toTitle;

        const titles = await this._queryLinkedTitles(params);

        return titles.length > 0;
    }

    /**
     * getLinksForTitle
     * @param {string} title 
     * @param {number} limit 
     * @param {string} plcontinue 
     * @returns {Array} Array of titles which current title links to
     */
    async getLinkedTitles(title, limit = 10, plcontinue = '') {
        if (!title) {
            throw new Error('title cannot be empty');
        }

        if (limit <= 0) {
            throw new Error('limit cannot be less than or equal to 0');
        }

        const params = MediaWikiApiCleint.getBaseParams();
        params.titles = title;
        params.pllimit = limit;

        if (plcontinue) {
            params.plcontinue = plcontinue;
        }

        return await this._queryLinkedTitles(params);
    }
}

module.exports = MediaWikiApiCleint;
