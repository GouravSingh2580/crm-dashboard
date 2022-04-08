describe('Company page test', () => {
  const statusSelector = '[data-testid=select-status] [role=button]';
  let newCount = 0;
  let activeCount = 0;
  describe('Status test', () => {
    beforeEach(() => {
      cy.loginByAuth0Api('admin@formationscorp.com', 'Testing@1234');
      cy.get('button.MuiButtonBase-root');
      cy.visit('http://localhost:4040/dashboard/accounts/61156916630d9f92ee1acaba');
      cy.get(statusSelector).click();
      cy.get('li[role=option][data-value=NEW]').click();
      cy.visit('http://localhost:4040/dashboard/accounts');
      cy.waitUntil(() => cy.get('[data-testid="status-filter-New"] [class*="statusFilterItemCount"]').then(($element) => $element.text() !== '0'));
      cy.get('[data-testid="status-filter-New"] [class*="statusFilterItemCount"]').then(($element) => {
        newCount = parseInt($element.text(), 10);
      });
      cy.get('[data-testid="status-filter-Active"] [class*="statusFilterItemCount"]').then(($element) => {
        activeCount = parseInt($element.text(), 10);
      });
    });

    it.skip('Should able to update status and update count', () => {
      cy.visit('http://localhost:4040/dashboard/accounts/61156916630d9f92ee1acaba');
      cy.get(statusSelector).click();
      cy.get('li[role=option][data-value=ACTIVE]').click();

      cy.visit('http://localhost:4040/dashboard/accounts');
      cy.waitUntil(() => cy.get('[data-testid="status-filter-New"] [class*="statusFilterItemCount"]').then(($element) => $element.text() !== '0'));
      cy.get('[data-testid="status-filter-New"] [class*="statusFilterItemCount"]').should('contain.text', newCount - 1);
      cy.get('[data-testid="status-filter-Active"] [class*="statusFilterItemCount"]').should('contain.text', activeCount + 1);
    });
  });
});
