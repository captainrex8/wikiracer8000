'use strict';

const axios = require('axios');

class MediaWikiApiCleint {
    constructor (config) {
        this._baseUrl = config.baseUrl;
        this._timeoutInSeconds = config.timeoutInSeconds;
        this._logger = config.logger;
    }

    static get LIMIT_MAX() {
        return 500;
    }

    static getBaseParams() {
        return {
            action: 'query',
            format: 'json',
            formatversion: 2,
            prop: 'links',
            plnamespace: 0  // only search links in wiki main content
        }
    }

    async _query(params){
        const response = await axios.get(
            this._baseUrl,
            {
                params,
                timeout: this._timeoutInSeconds * 1000
            }
        );

        this._logger.debug(JSON.stringify(response.data));
        this._logger.info(response.request.path);
    
        return response.data;
    }

    async queryLinks(title, pltitles = '', limit = 10, plcontinue = '') {
        if (!title) {
            throw new Error('title cannot be empty');
        }

        if (limit <= 0) {
            throw new Error('limit cannot be less than or equal to 0');
        }

        const params = MediaWikiApiCleint.getBaseParams();
        params.titles = title;
        params.pltitles = pltitles ? pltitles : undefined;
        params.pllimit = limit;

        if (plcontinue) {
            params.plcontinue = plcontinue;
        }

        return await this._query(params);
    }
}

module.exports = MediaWikiApiCleint;
