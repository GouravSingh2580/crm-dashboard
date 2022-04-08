// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import { decode } from 'jsonwebtoken';
import 'cypress-localstorage-commands';
import 'cypress-wait-until';
import 'cypress-file-upload';

declare global {
  namespace Cypress {
    interface Chainable {
      loginByAuth0Api(username: string, password?: string);
      signUpAuth0(email: string, password?: string);
      agreeTerms();
      getAutocompleteOptions();
    }
  }
}

const DEFAULT_PASSWORD = 'Test@1234';

Cypress.Commands.add(
  'loginByAuth0Api',
  (username, password = DEFAULT_PASSWORD) => {
    cy.log(`Logging in as ${username}`);
    const clientId = Cypress.env('auth0_client_id');
    const audience = Cypress.env('auth0_audience');

    cy.request({
      method: 'POST',
      url: `https://${Cypress.env('auth0_domain')}/oauth/token`,
      body: {
        grant_type: 'password',
        username,
        password,
        audience,
        scope: 'openid profile email',
        client_id: clientId,
      },
    }).then(({ body }) => {
      const user = decode(body.id_token);
      const userItem = {
        token: body.access_token,
        user,
      };
      localStorage.setItem('auth0Cypress', JSON.stringify(userItem));
      cy.visit('/postlogin');
    });
  },
);

Cypress.Commands.add('signUpAuth0', (email, password = DEFAULT_PASSWORD) => {
  const clientId = Cypress.env('auth0_client_id');
  const connection = 'Username-Password-Authentication';

  cy.log(`Signing up user ${email}`);
  cy.request({
    method: 'POST',
    url: `https://${Cypress.env('auth0_domain')}/dbconnections/signup`,
    body: {
      client_id: clientId,
      email,
      password,
      connection,
    },
  });
});

Cypress.Commands.add('agreeTerms', () => {
  // when terms and codition page loads
  cy.url().should('contain', 'terms').then(() => {
    cy.get('[data-testid=t-and-c-user-consent]').should('be.visible').click();
    cy.url().should('contain', '/onboarding/business-type');
  });
});

Cypress.Commands.add('getAutocompleteOptions', () => cy.get('.MuiAutocomplete-popper [role="listbox"] [role="option"]'));
