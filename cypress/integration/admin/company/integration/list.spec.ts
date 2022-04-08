describe.skip('Listing company', () => {
  const options = { timeout: 16000 }; // double time out for waiting data being fetched
  beforeEach(() => {
    cy.loginByAuth0Api('admin@formationscorp.com', 'Testing@1234');
    cy.get('[data-testid=logo]');
    cy.visit('/dashboard/accounts');
  });

  const waitUntilFinishLoading = () =>
    cy.waitUntil(
      () =>
        cy
          .contains(/Total number of rows: [\d]/)
          .invoke('text')
          .then((text) => text !== 'Total number of rows: 1'),
      options,
    );

  it('Should show companies list', () => {
    cy.url().should('include', 'dashboard/accounts');
    cy.get('table[data-testid="table-accounts"]').should('be.visible');
  });

  it('Should go to company page', () => {
    cy.get(
      'table tbody tr[data-testid*="table-row-account-"]:nth-child(1)',
    ).click();
    cy.url().should('include', '/dashboard/accounts/');
    cy.get(
      '[data-testid="tab-company-container"] button:nth-child(1)',
      options,
    ).should('include.text', 'Profile');
  });

  it('Should able to use quick filter', () => {
    let pageNumText = '';
    waitUntilFinishLoading();
    cy.waitUntil(() =>
      cy
        .contains(/Total number of rows: [\d]/)
        .invoke('text')
        .then((text) => {
          pageNumText = text;
          return text !== 'Total number of rows: 1';
        }),
    );
    cy.get('[data-testid="status-filter-New"]').click();
    cy.get('[class*=makeStyles-activeStatusFilter]').contains(
      '[data-testid="status-filter-New"]',
      'New',
    );
    waitUntilFinishLoading();
    cy.get('[class*=paginationContainer]')
      .contains('div', /Total number of rows: [\d]+/)
      .invoke('text')
      .then((text) => {
        expect(text).not.to.eq(pageNumText);
      });
  });

  it('Should be able to go to next page', () => {
    cy.wait(1000);
    cy.get('[aria-label="Go to next page"]').click();
    cy.wait(2000);
    cy.get('button[aria-label="page 2"].Mui-selected', options).should('be.visible');
  });

  it('Should be able to paginate', () => {
    cy.wait(1000);
    cy.get('button[aria-label="Go to page 2"]').click();
    cy.wait(2000);
    cy.get('button[aria-label="page 2"].Mui-selected', options).should('be.visible');
  });

  // TODO: enable this after improve search that not trigger request whenever typing
  it.skip('Should be able to search', () => {
    let pageNumText = '';
    waitUntilFinishLoading()
    cy.get('[class*=paginationContainer]')
      .contains('div', /Total number of rows: [\d]+/)
      .invoke('text')
      .then((text) => {
        pageNumText = text;
        cy.log(pageNumText);
      });
    cy.get('input[placeholder="Search"]').clear().type('Formations');
    waitUntilFinishLoading();
    cy.get('[class*=paginationContainer]')
      .contains('div', /Total number of rows: [\d]+/, { timeout: 10000 })
      .invoke('text')
      .then((text) => {
        expect(text).not.to.eq(pageNumText);
      });
  });

  it('Should be able to filter', () => {
    let pageNumText = '';
    waitUntilFinishLoading();
    cy.get('[class*=paginationContainer]')
      .contains('div', /Total number of rows: [\d]+/)
      .invoke('text')
      .then((text) => {
        pageNumText = text;
      });
    cy.get('[data-testid="accounts-filter"]').click();
    cy.get('[data-testid="filter-from-date-input"] input')
      .clear()
      .type('08/12/2021');
    cy.get('[data-testid="filter-to-date-input"] input')
      .clear()
      .type('08/13/2021');
    cy.get('[data-testid="apply-filter"]').click();
    waitUntilFinishLoading();
    cy.get('[class*=paginationContainer]', options)
      .contains('div', /Total number of rows: [\d]+/)
      .invoke('text')
      .then((text) => {
        expect(text).not.to.eq(pageNumText);
      });
  });
});
