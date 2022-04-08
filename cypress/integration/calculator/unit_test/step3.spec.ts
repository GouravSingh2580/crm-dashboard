describe('Calculator - step 3', () => {
  before(() => {
    cy.visit('http://localhost:4040/calculator');
    cy.get('[data-testid=option-sole_prop]').click();
    cy.get('[data-testid=btn-Continue]').click();
    cy.get('[data-testid=select-revenue]').click();
    cy.get('[data-testid=option-40000]').click();
    cy.get('[data-testid=btn-Continue]').click();
  });

  beforeEach(() => {
    cy.fixture('calculator/expenseOptions.json').as('options');
  });

  it('Should land on step 3', () => {
    cy.get('[data-testid=title]')
      .should('be.visible')
      .contains('What are your estimated annual business expenses?');
  });

  it('Should show previous button on top', () => {
    cy.get('[data-testid=btn-previous]').should('be.visible');
  });

  it('Should contain select dropdown', () => {
    cy.get('[data-testid=select-expense]').should('be.visible');
  });

  it('Should be able to click continue button', () => {
    cy.get('[data-testid=btn-Continue]').should('be.visible').click();
  });

  it('Should contain all  options', function () {
    cy.get('[data-testid=select-expense]').click();

    this.options.forEach((option) => {
      cy.get(`[data-testid=option-${option.value}]`).should('be.visible');
    });
  });
});
