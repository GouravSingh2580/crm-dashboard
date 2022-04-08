describe('Calculator - step 8', () => {
  before(() => {
    cy.visit('http://localhost:4040/calculator');
    cy.get('[data-testid=option-sole_prop]').click();
    cy.get('[data-testid=btn-Continue]').click();
    cy.get('[data-testid=select-revenue]').click();
    cy.get('[data-testid=option-40000]').click();
    cy.get('[data-testid=btn-Continue]').click();
    cy.get('[data-testid=select-expense]').click();
    cy.get('[data-testid=option-10000]').click();
    cy.get('[data-testid=btn-Continue]').click();
    cy.get('[data-testid=option-retirement_savings] input[type=checkbox]').check();
    cy.get('[data-testid=btn-Continue]').click();
    cy.get('[data-testid=option-health] input[type=checkbox]').check();
    cy.get('[data-testid=btn-Continue]').click();
    cy.get('[data-testid=select-timespend]').click();
    cy.get('[data-testid=option-30]').click();
    cy.get('[data-testid=btn-Continue]').click();
  });

  beforeEach(() => {
    cy.fixture('calculator/annualcostOptions.json').as('options');
  });

  it('Should land on step 8', () => {
    cy.get('[data-testid=title]')
      .should('be.visible')
      .contains(
        'What is your total annual cost for managing your business financials?',
      );
  });

  it('Should show previous button on top', () => {
    cy.get('[data-testid=btn-previous]').should('be.visible');
  });

  it('Should contain select dropdown', () => {
    cy.get('[data-testid=select-totalannualcost]').should('be.visible');
  });

  it('Should be able to click continue button', () => {
    cy.get('[data-testid=btn-Continue]').should('be.visible').click();
  });

  it('Should contain all options', function () {
    cy.get('[data-testid=select-totalannualcost]').click();
    this.options.forEach((option) => {
      cy.get(`[data-testid=option-${option.value}]`).should('be.visible');
    });
  });
});
