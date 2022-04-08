describe('Bank Account page test', () => {
  beforeEach(() => {
    cy.loginByAuth0Api('cypress+nobank@formationscorp.com', 'Test@1234');
    cy.get('[data-testid=logo]');
    cy.get('[data-testid="loading"]').should('not.exist');
  });

  describe('listing accounts', () => {
    it('Should show bank accounts menu', () => {
      cy.visit('/dashboard/banks');
      cy.get('[data-testid="menu_item_banks"]').should('be.visible');
    });

    it('Should see no account connected message', () => {
      cy.visit('/dashboard/banks?flag=admin');
      cy.contains("You haven't connected your bank account yet").should(
        'be.visible',
      );
    });

    it('should see connection with no accounts', () => {
      cy.intercept('GET', '/accounts/*/connections', {
        fixture: 'bookkeeping/connections',
      }).as('getConnections');
      cy.intercept('GET', '/accounts/*/bank-accounts', []).as('getAccounts');
      cy.visit('/dashboard/banks?flag=admin');
      cy.wait(['@getConnections', '@getAccounts']);

      cy.contains(
        'Please refresh the page to view the bank accounts. It might take few minutes to retrieve and list the accounts',
      ).should('be.visible');
    });

    it('should see accounts', () => {
      cy.intercept('GET', '/accounts/*/connections', {
        fixture: 'bookkeeping/connections',
      }).as('getConnections');
      cy.intercept('GET', '/accounts/*/bank-accounts', {
        fixture: 'bookkeeping/accounts',
      }).as('getAccounts');
      cy.visit('/dashboard/banks?flag=admin');
      cy.wait(['@getConnections', '@getAccounts']);
      cy.contains('h4', 'Chase').should('be.visible');
    });

    it('Should show message', () => {
      cy.intercept('GET', '/accounts/*/connections', {
        fixture: 'bookkeeping/connections_error',
      }).as('getConnectionsWithError');
      cy.intercept('GET', '/accounts/*/bank-accounts', {
        fixture: 'bookkeeping/accounts',
      }).as('getAccounts');
      cy.intercept('PUT', '/accounts/*/connections/*', {
        token: 'link-sandbox-0fd4770a-86dc-4fb6-938f-425d5311176e',
      }).as('updateLinkToken');
      cy.visit('/dashboard/banks?flag=admin');
      cy.wait(['@getConnectionsWithError', '@getAccounts', '@updateLinkToken']);

      cy.contains(
        '[data-testid="toast-error"]',
        /the login details of this item have changed/,
      );
    });

    it('Should not show reconnect button', () => {
      cy.intercept('GET', '/accounts/*/connections', {
        fixture: 'bookkeeping/connections_error',
      }).as('getConnectionsWithError');
      cy.intercept('GET', '/accounts/*/bank-accounts', {
        fixture: 'bookkeeping/accounts',
      }).as('getAccounts');
      cy.intercept('PUT', '/accounts/*/connections/*', {
        statusCode: 200,
        body: {
          token: 'test_link_token',
        },
      }).as('updateLinkToken');
      cy.visit('/dashboard/banks?flag=admin');
      cy.wait(['@getConnectionsWithError', '@getAccounts', '@updateLinkToken']);

      cy.get('[data-testid="reconnect-button"]').should('be.visible');
    });
  });

  describe('connection', () => {
    it('Should connect button enable', () => {
      cy.visit('/dashboard/banks?flag=admin');
      cy.get("[data-testid='connectButton']").should('be.enabled');
    });
    it('Should connect button disable', () => {
      cy.intercept('GET', '/accounts/*/connections', {
        fixture: 'bookkeeping/connections',
      }).as('getConnections');
      cy.intercept('GET', '/accounts/*/bank-accounts', {
        fixture: 'bookkeeping/accounts',
      }).as('getAccounts');

      cy.visit('/dashboard/banks?flag=admin');
      cy.wait(['@getConnections', '@getAccounts']);
      cy.get("[data-testid='connectButton']").should('not.exist');
    });
  });
});
