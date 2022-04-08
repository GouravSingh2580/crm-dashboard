describe('mobile basic test', () => {
  describe('admin mobile view', () => {
    beforeEach(() => {
      cy.viewport(479, 640);
      cy.loginByAuth0Api('admin@formationscorp.com', 'Testing@1234');
    });

    it('should show mobile view', () => {
      cy.get('[data-testid=mobile-navigation]').should('be.visible');
      cy.get('[data-testid="mobile-mi-accounts"]').should('be.visible');
      cy.get('[data-testid="mobile-mi-menu"]').should('be.visible');
    });
  });

  describe('user mobile view', () => {
    beforeEach(() => {
      cy.viewport(480, 640);
      cy.intercept('GET', '/contacts/*/properties').as('userLifeCycle');
      cy.loginByAuth0Api('cypresstest@formationscorp.com', 'Test@1234');
      cy.wait('@userLifeCycle');
      cy.get('[data-testid="loading"]').should('not.exist');
    });

    it('should show mobile view', () => {
      cy.visit('/dashboard/welcome');
      cy.get('[data-testid=mobile-navigation]').should('be.visible');
      cy.get('[data-testid="mobile-mi-welcome"]').should('be.visible');
      cy.get('[data-testid="mobile-mi-documents"]').should('be.visible');
      cy.get('[data-testid="mobile-mi-menu"]').should('be.visible');
    });
  });
});
