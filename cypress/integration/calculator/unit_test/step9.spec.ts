describe('Calculator - step 9', () => {
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
    cy.get('[data-testid=select-totalannualcost]').click();
    cy.get('[data-testid=option-0]').click();
    cy.get('[data-testid=btn-Continue]').click();
  });

  it('Should land on step 9', () => {
    cy.get('[data-testid=title]')
      .should('be.visible')
      .contains('How much did you pay in taxes last year?');
  });

  it('Should show previous button on top', () => {
    cy.get('[data-testid=btn-previous]').should('be.visible');
  });

  it('Should be able to click continue button', () => {
    cy.get('[data-testid="btn-See Results"]').should('be.visible').click();
  });

  it('Should be able to add digits', () => {
    cy.get('[data-testid=txtinp-taxes]').should('be.visible').type('4000');
    cy.get('[data-testid=txtinp-taxes]>div>input').blur();
  });

  it('Should not add characters', () => {
    cy.get('[data-testid=txtinp-taxes]>div>input')
      .should('be.visible')
      .type('abcd');
    cy.get('[data-testid=txtinp-taxes]>div>input').should(
      'have.value',
      '4,000',
    );
    cy.get('[data-testid=txtinp-taxes]>div>input').blur();
  });

  it('Should allow decimal number', () => {
    cy.get('[data-testid=txtinp-taxes]>div>input').should('be.visible').clear();
    cy.get('[data-testid=txtinp-taxes]').should('be.visible').type('4000.45');
    cy.get('[data-testid=txtinp-taxes]>div>input').should(
      'have.value',
      '4,000.45',
    );
    cy.get('[data-testid=txtinp-taxes]>div>input').blur();
  });
});
