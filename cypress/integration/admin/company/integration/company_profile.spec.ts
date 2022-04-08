describe('Company page / Profile test test', () => {
  beforeEach(() => {
    cy.loginByAuth0Api('admin@formationscorp.com', 'Testing@1234');
    cy.get('[data-testid=logo]');
    cy.visit(
      'http://localhost:4040/dashboard/accounts/61156916630d9f92ee1acaba',
    );
    cy.get('[data-testid="tab-company-profile"]').click();
  });

  it('Should show profile information', () => {
    cy.get('[data-testid="hubspot-data"]').should('be.visible');
    cy.get('[data-testid="company-detail-list"]').should('be.visible');
    cy.get('[data-testid="company-contact-list"]').should('be.visible');
    cy.get('[data-testid="member-list"]').should('be.visible');
    cy.get('[data-testid="deposit-list"]').should('be.visible');
  });

  it('Should able to change profle information', () => {
    const content = `Test description ${new Date().getTime()}`;
    cy.log(`new content: ${content}`);
    cy.get(
      '[data-testid="field-description"] + div > button[aria-label="edit"]',
    ).click();
    cy.get('textarea[name="description"]').clear().type(content.toLowerCase());
    cy.get('[data-testid="button-save"]').click();
    cy.contains(
      '[data-testid="field-description"] [data-testid="field-value"]',
      content,
    );
  });

  it.only('Should able to update date', () => {
    const fields = [
      ['incorporationDate', 'Invalid date of incorporation'],
      ['dob', 'Invalid date of birth'],
    ];
    const wrongDate = '13132000';
    const correctDate = '01012000';
    fields.forEach(([name, errorMessage]) => {
      cy.get(`[data-testid="btn-edit-${name}"]`).click();
      cy.get(`[data-testid="field-${name}"] input`)
        .as('input')
        .clear()
        .type(wrongDate);
      cy.contains(errorMessage).should('be.visible');
      cy.get('@input').clear().type(correctDate);
      cy.contains(errorMessage).should('not.exist');
      cy.get('[data-testid="button-save"]').click();
      cy.contains(
        '[data-testid="field-incorporationDate"]',
        '01/01/2000',
      ).should('be.visible');
    });
  });

  // We should not change the hubspot ID since it can cause problem for other tests
  it.skip('Should be able modify the internal Hubspot contact ID', () => {
    const oldValue = '45901';
    const newValue = '123456';
    cy.get(
      '[data-testid="field-hubspotId"] + div > button[aria-label="edit"]',
    ).click();
    cy.get('input[name="contactId"]').clear().type(newValue);
    cy.get('[data-testid="button-save"]').click();
    cy.contains(
      '[data-testid="field-hubspotId"] [data-testid="field-value"]',
      newValue,
    );

    // change the value back
    cy.get(
      '[data-testid="field-hubspotId"] + div > button[aria-label="edit"]',
    ).click();
    cy.get('input[name="contactId"]').clear().type(oldValue);
    cy.get('[data-testid="button-save"]').click();
    cy.contains(
      '[data-testid="field-hubspotId"] [data-testid="field-value"]',
      oldValue,
    );
  });
});
