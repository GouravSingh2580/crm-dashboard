describe('Company page / bank account test', () => {
  describe('No bank available', () => {
    beforeEach(() => {
      cy.loginByAuth0Api('admin@formationscorp.com', 'Testing@1234');
      cy.get('button.MuiButtonBase-root');
      cy.visit('http://localhost:4040/dashboard/accounts/619c1744d23789a535a44e80');
      cy.get('[data-testid="tab-company-banks"]').click();
    });

    it('should see bank account tab', () => {
      cy.get('[data-testid="tab-company-banks"]').should('be.visible');
    });

    it('Should see no account connected message', () => {
      cy.contains('The customer does not connect to a bank yet').should('be.visible');
    });
  });
  describe('bank available', () => {
    beforeEach(() => {
      cy.loginByAuth0Api('admin@formationscorp.com', 'Testing@1234');
      cy.get('button.MuiButtonBase-root');
      cy.visit('http://localhost:4040/dashboard/accounts/61156916630d9f92ee1acaba');
      cy.get('[data-testid="tab-company-banks"]').click();
    });

    it('Should see bank account list', () => {
      cy.get('[data-testid="bank-account-table"] > li').should('have.length', 9);
      cy.contains('Plaid 401k').should('be.visible');
    });
  });
});
