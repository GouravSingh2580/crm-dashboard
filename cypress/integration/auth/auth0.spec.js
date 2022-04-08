describe('Auth0', function () {
  it('Should log in', function () {
    cy.loginByAuth0Api('ferchriquelme@gmail.com');
    cy.url().should('include', Cypress.config().baseUrl);
  });
});
