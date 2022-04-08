describe('Calculator - step 1', () => {
  beforeEach(() => {
    cy.fixture('calculator/legalEntitiesOptions.json').as('options');
  });

  it('Should open calculator page', () => {
    cy.visit('http://localhost:4040/calculator');
    cy.get('[data-testid=calculator_header]')
      .should('be.visible')
      .contains('Calculator');
  });

  it('Should land on step 1', () => {
    cy.get('[data-testid=title]')
      .should('be.visible')
      .contains('What is your current business legal entity?');
  });

  it('Should contain all 4 option in form', function () {
    this.options.forEach((option) => {
      cy.get(`[data-testid=option-${option.value}]`)
        .should('be.visible')
        .not('be.checked');

      cy.get(`[data-testid=option-${option.value}]+span`).contains(option.name);
    });
  });

  it('Should be able to click continue button', () => {
    cy.get('[data-testid=btn-Continue]').should('be.visible').click();
  });
});
