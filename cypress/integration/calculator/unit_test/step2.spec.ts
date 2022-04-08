describe('Calculator - step 2', () => {
  before(() => {
    cy.visit('http://localhost:4040/calculator');
    cy.get('[data-testid=option-sole_prop]').click();
    cy.get('[data-testid=btn-Continue]').should('be.visible').click();
  });

  beforeEach(() => {
    cy.fixture('calculator/revenueOptions.json').as('options');
  });

  it('Should land on step 2', () => {
    cy.get('[data-testid=title]')
      .should('be.visible')
      .contains('How much money will your business generate this year?');
  });

  it('Should show previous button on top', () => {
    cy.get('[data-testid=btn-previous]').should('be.visible');
  });

  it('Should contain select dropdown', () => {
    cy.get('[data-testid=select-revenue]').should('be.visible');
  });

  it('Should be able to click continue button', () => {
    cy.get('[data-testid=btn-Continue]').should('be.visible').click();
  });

  it('Should contain all 4 options', function () {
    cy.get('[data-testid=select-revenue]').click();

    this.options.forEach((option) => {
      cy.get(`[data-testid=option-${option.value}]`).should('be.visible');
    });
  });
});
