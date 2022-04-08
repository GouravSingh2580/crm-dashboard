describe('Calculator - Flow 1', () => {
  before(() => {
    cy.visit('http://localhost:4040/calculator');
  });

  beforeEach(() => {
    cy.fixture('calculator/legalEntitiesOptions.json').as('legalOptions');
    cy.fixture('calculator/revenueOptions.json').as('revenueOptions');
    cy.fixture('calculator/expenseOptions.json').as('expenseOptions');
    cy.fixture('calculator/benefitsOptions.json').as('benefitsOptions');
    cy.fixture('calculator/healthOptions.json').as('healthOptions');
    cy.fixture('calculator/timespendOptions.json').as('timespendOptions');
    cy.fixture('calculator/annualcostOptions.json').as('annualcostOptions');
  });

  it('Should select Sole Proprietorship option in legal entity options', function () {
    cy.get(`[data-testid=option-${this.legalOptions[0].value}]`).click();
    cy.get('[data-testid=btn-Continue').click();
  });

  it('Should select less than $40,000 option in Revenue options', function () {
    cy.get('[data-testid=select-revenue]').click();
    cy.get(`[data-testid=option-${this.revenueOptions[0].value}]`).click();
    cy.get('[data-testid=btn-Continue').click();
  });

  it('Should select less than $10,000 option in Expense options', function () {
    cy.get('[data-testid=select-expense]').click();
    cy.get(`[data-testid=option-${this.expenseOptions[0].value}]`).click();
    cy.get('[data-testid=btn-Continue').click();
  });

  it('Should select Retirement Savings option in benefits options', function () {
    cy.get(
      `[data-testid=option-${this.benefitsOptions[0].value}] input[type=checkbox]`,
    ).check();
    cy.get('[data-testid=btn-Continue').click();
  });

  it('Should select health option in health options', function () {
    cy.get(
      `[data-testid=option-${this.healthOptions[0].value}] input[type=checkbox]`,
    ).check();
    cy.get('[data-testid=btn-Continue').click();
  });

  it('Should select less than 10hrs per month option in Time spend options', function () {
    cy.get('[data-testid=select-timespend]').click();
    cy.get(`[data-testid=option-${this.timespendOptions[0].value}]`).click();
    cy.get('[data-testid=btn-Continue').click();
  });

  it('Should select $0 I do it all by myself option in Annual cost options', function () {
    cy.get('[data-testid=select-totalannualcost]').click();
    cy.get(`[data-testid=option-${this.annualcostOptions[0].value}]`).click();
    cy.get('[data-testid=btn-Continue').click();
  });

  it('Should add 5000 as tax', () => {
    cy.get('[data-testid=txtinp-taxes]').type('5000');
    cy.get('[data-testid="btn-See Results"]').click();
    cy.get('[data-testid="txtinp-taxes"] .Mui-error').should('not.exist');
    cy.getLocalStorage('calculatorform');
    cy.saveLocalStorage();
  });

  it('Should show result page', () => {
    cy.restoreLocalStorage();
    cy.visit('/calculator/result');
    cy.url().should('include', '/result');
  });

  it('should show $5,000 as saving in title and $2,000 - $5,000 as saving in subtitle', () => {
    cy.restoreLocalStorage();
    cy.visit('/calculator/result');
    cy.get('[data-testid=txt-result-heading]')
      .should('be.visible')
      .should('contain.text', '$5,000');
    cy.get('[data-testid=txt-result-sub-heading]')
      .should('be.visible')
      .should('contain.text', '$2,000 - $5,000');
  });
});
