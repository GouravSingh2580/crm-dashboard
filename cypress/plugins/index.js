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

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars

require('dotenv').config();

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // Auth0
  config.env.auth0_domain = process.env.REACT_APP_AUTH0_DOMAIN;
  config.env.auth0_audience = process.env.REACT_APP_AUTH0_AUDIENCE;
  config.env.auth0_client_id = process.env.REACT_APP_AUTH0_CLIENT_ID;

  // Ignore tests in example folder to keep them as docs
  config.ignoreTestFiles = "**/examples/*.spec.js";

  return config;
};
