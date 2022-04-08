describe('Bank Transactions page test', () => {
  beforeEach(() => {
    cy.loginByAuth0Api('cypress+nobank@formationscorp.com', 'Test@1234');
    cy.get('[data-testid=logo]').should('be.visible');
  });

  describe('listing transactions', () => {
    it('Should show bank transactions menu on sidebar', () => {
      cy.visit('/dashboard/transactions?flag=admin');
      cy.get('[data-testid="menu_item_transactions"]').should('be.visible');
    });

    it('Should see no transactions available message', () => {
      cy.visit('/dashboard/transactions?flag=admin');
      cy.contains('No transactions available!').should('be.visible');
    });

    it('Should see transactions list after connecting to a bank account', () => {
      cy.intercept('GET', '/accounts/*/connections', { fixture: 'bookkeeping/connections' }).as('getConnections');
      cy.intercept('GET', '/accounts/*/bank-accounts', { fixture: 'bookkeeping/accounts' }).as('getAccounts');
      cy.visit('/dashboard/banks?flag=admin');
      cy.wait(['@getConnections', '@getAccounts']);
      cy.contains('h4', 'Chase').should('be.visible');
      cy.intercept('GET', '/accounts/*/transactions?page=1&order=desc&from=2021-01-01', { fixture: 'bookkeeping/transactions' }).as('getTransactions');
      cy.intercept('GET', '/categories', { fixture: 'bookkeeping/categories' }).as('getCategories');
      cy.visit('/dashboard/transactions?page=1&order=desc&from=2021-01-01');
      cy.wait(['@getCategories', '@getTransactions']);
      cy.get('[data-testid="table-transactions"]').should('be.visible');
    });
  });
});
