describe('Filling document form', () => {
  beforeEach(() => {
    cy.loginByAuth0Api('admin@formationscorp.com', 'Testing@1234');
    cy.get('button.MuiButtonBase-root');
  });
  it('Should display form if customer does not have data', () => {
    cy.intercept('GET', '/api/v1/users/61156916630d9f92ee1acaba/companies', {
      fixture: 'progress_tracker/admin_filing_documents_companies.json',
    }).as('companies');
    cy.visit('/dashboard/accounts/61156916630d9f92ee1acaba');
    cy.get('[data-testid="tab-company-progress"]').click();
    cy.get('[data-testid="step-Filing Documents"]').click();
    cy.get('[name="name"]').should('be.visible');
    cy.get('[name="ein"]').should('be.visible');
    cy.get('[name="incorporationDate"]').should('be.visible');
    cy.get('[data-testid="saveFilingDocumentForm"]').should('be.visible');
  });
  it('Should display label if customer have data', () => {
    cy.intercept('GET', '/api/v1/users/61156916630d9f92ee1acaba/companies', {
      fixture: 'progress_tracker/admin_filing_documents_companies_filled.json',
    }).as('companies');
    cy.visit('/dashboard/accounts/61156916630d9f92ee1acaba');
    cy.get('[data-testid="tab-company-progress"]').click();
    cy.get('[data-testid="step-Filing Documents"]').click();
    cy.contains('h6', 'example name').should('be.visible');
    cy.contains('h6', '555566666').should('be.visible');
    cy.contains('h6', '01/01/2000').should('be.visible');
    cy.get('[data-testid="filingDocumentEditBtn"]').should('be.visible');
  });
});
