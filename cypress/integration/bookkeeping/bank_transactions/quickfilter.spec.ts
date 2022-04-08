describe('Bank Transactions quick filter', () => {
  beforeEach(() => {
    cy.loginByAuth0Api('cypresstest@formationscorp.com', 'Test@1234');
    cy.waitUntil(() => cy.get('[data-testid="loading"]').should('not.be.visible'));
    cy.get('[data-testid=logo]');
    cy.visit('/dashboard/transactions');
  });

  describe('listing transactions', () => {
    it('Should show quick filter', () => {
      cy.get('[data-testid*=\'quick-filter\']').should('be.visible');
    });

    it('Should have uncategorized cat', () => {
      cy.get('[data-testid*="quick-filter-uncategorized"]+.MuiBadge-badge')
        .then((element) => element.text())
        .should('not.be.empty');
    });

    it('Should able to query uncategory', () => {
      cy.viewport(1920, 1080);
      cy.get('[data-testid*="quick-filter-uncategorized"]').as('button');
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000).waitUntil(() => cy.get('@button')
        .should('be.visible')
        .click());
      cy.get('[data-testid="transaction-category-toggle"]')
        .then((elements) => elements
          .map((index, element) => element.innerText)
          .filter((index, text) => text !== 'Unknown'))
        .should('have.length', 0);
    });
  });
});
