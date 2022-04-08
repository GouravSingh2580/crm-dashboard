describe('Company page / Documents tab test', () => {
  beforeEach(() => {
    cy.loginByAuth0Api('admin@formationscorp.com', 'Testing@1234');
    cy.get('button.MuiButtonBase-root');
    cy.visit('http://localhost:4040/dashboard/accounts/61156916630d9f92ee1acaba');
    cy.get('[data-testid="tab-company-documents"]').click();
  });

  it('should see document table panel', () => {
    cy.get('[data-testid="table-documents"]').should('be.visible');
  });

  it('should see upload button panel', () => {
    cy.get('[data-testid="btn-upload"]').should('be.visible');
  });
});
