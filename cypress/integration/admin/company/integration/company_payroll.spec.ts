describe('Company page / Documents tab test', () => {
  beforeEach(() => {
    cy.loginByAuth0Api('admin@formationscorp.com', 'Testing@1234');
    cy.get('button.MuiButtonBase-root');
    cy.visit('/dashboard/accounts/61156916630d9f92ee1acaba');
    cy.get('[data-testid="tab-company-payroll"]').click();
  });

  it('should see Reasonable Compensation', () => {
    cy.contains(
      '[data-testid="field-label-annual-reasonable-compensation"]',
      'Annual Reasonable Compensation',
    ).should('be.visible');
    cy.get('[data-testid="edit-btn"').should('be.visible');
  });

  it('should be able to switch form to view mode', () => {
    cy.get('[data-testid="edit-btn"').click();
    cy.get('[data-testid="field-estimatedSalary"] input').should('be.visible');
    cy.get('[data-testid="edit-btn"').click();
    cy.contains(
      '[data-testid="field-label-annual-reasonable-compensation"]',
      'Annual Reasonable Compensation',
    ).should('be.visible');

    cy.get('[data-testid="edit-btn"').click();
    cy.get('[data-testid="field-estimatedSalary"] input').should('be.visible');
    cy.get('[data-testid="form-cancel-btn"').click();
    cy.contains(
      '[data-testid="field-label-annual-reasonable-compensation"]',
      'Annual Reasonable Compensation',
    ).should('be.visible');
  });

  it('should able to change Reasonable Compensation', () => {
    cy.get('[data-testid="edit-btn"').click();
    cy.get('[data-testid="field-estimatedSalary"] input').clear().type('70000');
    cy.get('[data-testid="form-save-btn"]').click();
    cy.get('[data-testid="field-value-annual-reasonable-compensation"]').should(
      'contain',
      '$70,000',
    );
    // edit again
    cy.get('[data-testid="edit-btn"').click();
    cy.get('[data-testid="field-estimatedSalary"] input').clear().type('80000');
    cy.get('[data-testid="form-save-btn"]').click();
    cy.get('[data-testid="field-value-annual-reasonable-compensation"]').should(
      'contain',
      '$80,000',
    );
  });

  it('should see validate errors', () => {
    cy.get('[data-testid="edit-btn"').click();
    cy.get('[data-testid="field-estimatedSalary"] input').clear();
    cy.get('[data-testid="form-save-btn"]').click();
    cy.get('[data-testid="field-estimatedSalary"]').should(
      'contain',
      'Estimated salary must be a number',
    );
    cy.get('[data-testid="field-estimatedSalary"] input').clear().type('0');
    cy.get('[data-testid="field-estimatedSalary"]').should(
      'contain',
      'Estimated Salary must be a positive number',
    );
    cy.get('[data-testid="field-estimatedSalary"] input')
      .clear()
      .type('100.11');
    cy.get('[data-testid="field-estimatedSalary"]').should(
      'not.contain',
      'Estimated Salary must be an integer',
    );
  });
});
