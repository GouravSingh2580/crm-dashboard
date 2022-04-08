describe('Calculator - step 5', () => {
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
  });

  beforeEach(() => {
    cy.fixture('calculator/healthOptions.json').as('options');
  });

  it('Should land on step 5', () => {
    cy.get('[data-testid=title]')
      .should('be.visible')
      .contains('What type of health coverage do you have?');
  });

  it('Should show previous button on top', () => {
    cy.get('[data-testid=btn-previous]').should('be.visible');
  });

  it('Should be able to click continue button', () => {
    cy.get('[data-testid=btn-Continue]').should('be.visible').click();
  });

  it('Should contain all options', function () {
    this.options.forEach((option) => {
      cy.get(`[data-testid=option-${option.value}]`).should('be.visible');
    });
  });

  it('Should disable other options when "I don\'t have health insurance" option is selected', function () {
    cy.get(`[data-testid=option-${this.options[4].value}] input[type=checkbox]`).check();
    cy.get(`[data-testid=option-${this.options[1].value}] input[type=checkbox]`).should(
      'be.disabled',
    );
    cy.get(
      `[data-testid=option-${this.options[4].value}] input[type=checkbox]`,
    ).uncheck();
    cy.get(`[data-testid=option-${this.options[4].value}] input[type=checkbox]`).blur();
  });

  it('Should be able to select multi options', function () {
    cy.get(`[data-testid=option-${this.options[3].value}] input[type=checkbox]`).check();
    cy.get(`[data-testid=option-${this.options[0].value}] input[type=checkbox]`).check();
    cy.get(
      `[data-testid=option-${this.options[0].value}] input[type=checkbox]`,
    ).uncheck();
    cy.get(`[data-testid=option-${this.options[1].value}] input[type=checkbox]`).check();
    cy.get(
      `[data-testid=option-${this.options[3].value}] input[type=checkbox]`,
    ).uncheck();
    cy.get(
      `[data-testid=option-${this.options[1].value}] input[type=checkbox]`,
    ).uncheck();
    cy.get(`[data-testid=option-${this.options[1].value}] input[type=checkbox]`).blur();
  });
});
