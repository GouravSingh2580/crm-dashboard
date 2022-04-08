describe('Edit company information test', () => {
  describe('Should show auto complete options', () => {
    beforeEach(() => {
      cy.loginByAuth0Api('admin@formationscorp.com', 'Testing@1234');
      cy.get('button.MuiButtonBase-root');
      cy.visit('http://localhost:4040/dashboard/accounts/61156916630d9f92ee1acaba');
    });

    it('Should able to update status and update count', () => {
      cy.get('[data-testid="btn-edit-industry"]').click();
      cy.get('[data-testid="industry-select"] input').click();
      cy.get('[data-testid*="industry-option-"').should('be.visible');
    });
  });
});
