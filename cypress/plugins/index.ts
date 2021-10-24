/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
import _ from 'lodash';
import axios from 'axios';
import dotenv from 'dotenv';
import Promise from 'bluebird';

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars

dotenv.config({ path: '.env.local' });
dotenv.config();

export default (on, config) => {
  const testDataApiEndpoint = `${config.env.apiUrl}/testData`;

  const queryDatabase = ({ entity, query }, callback) => {
    const fetchData = async (attrs: any) => {
      const { data } = await axios.get(`${testDataApiEndpoint}/${entity}`);
      return callback(data, attrs);
    };

    return Array.isArray(query) ? Promise.map(query, fetchData) : fetchData(query);
  };

  const percyHealthCheck = require('@percy/cypress/task');

  on('task', percyHealthCheck);

  on('task', {
    async 'db:seed'() {
      // seed database with test data
      const { data } = await axios.post(`${testDataApiEndpoint}/seed`);
      return data;
    },

    // fetch test data from a database (MySQL, PostgreSQL, etc...)
    'filter:database'(queryPayload) {
      return queryDatabase(queryPayload, (data, attrs) => _.filter(data.results, attrs));
    },
    'find:database'(queryPayload) {
      return queryDatabase(queryPayload, (data, attrs) => _.find(data.results, attrs));
    },
  });
  return config;
};
