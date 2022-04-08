describe('Not found page', () => {
  beforeEach(() => {
    cy.loginByAuth0Api('cypresstest@formationscorp.com', 'Test@1234');
    cy.get('[data-testid=logo]');
    cy.get('[data-testid="loading"]').should('not.exist');
  });

  it('should show not found page', () => {
    cy.visit('/dashboard/not-found-page');
    cy.get('[data-testid="title-not-found"]').should('be.visible');
  });

  it('should show go to homepage when click on go to homepage', () => {
    cy.visit('/dashboard/not-found-page');
    cy.get('[data-testid="btn-homepage"]').click();
    cy.get('[data-testid="loading"]').should('not.exist');
    cy.url().should('contains', '/dashboard/welcome');
  });
});
