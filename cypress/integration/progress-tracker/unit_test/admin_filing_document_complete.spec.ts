describe('Filling document complete', () => {
  const accountId = '61156916630d9f92ee1acab9';
  const companyId = '61156916630d9f92ee1acaba';
  let isCompleted: boolean = true;

  const stubCompaniesResponse = () => {
    cy.intercept('GET', `/api/v1/users/${companyId}/companies`, {
      fixture: 'progress_tracker/admin_filing_documents_companies_filled.json',
    }).as('companies');
  };
  const stubDocumentResponse = () => {
    cy.intercept(
      {
        method: 'GET',
        pathname: '/api/v1/documents',
        query: {
          accountId,
        },
      },
      { fixture: 'progress_tracker/admin_filing_documents_documents.json' },
    ).as('documents');
  };
  const stubAccountResponse = () => {
    cy.intercept(
      { method: 'GET', pathname: `/api/v1/accounts/${accountId}` },
      (req) => {
        if (isCompleted) {
          req.reply({
            fixture:
              'progress_tracker/admin_filing_documents_account_complete.json',
          });
        } else {
          req.reply({
            fixture: 'progress_tracker/admin_filing_documents_account.json',
          });
        }
      },
    ).as('account');
  };
  const goToProgressTracker = () => {
    cy.visit(`/dashboard/accounts/${companyId}`);
    cy.wait(['@companies', '@account']);
    cy.get('[data-testid="tab-company-progress"]').click();
    cy.get('[data-testid="step-Filing Documents"]').as('stepFilingDocuments').click();
  }

  beforeEach(() => {
    cy.loginByAuth0Api('admin@formationscorp.com', 'Testing@1234');
    cy.get('button.MuiButtonBase-root');
    isCompleted = true;
  });

  it('Should enable complete button', () => {
    isCompleted = false;
    stubCompaniesResponse();
    stubDocumentResponse();
    stubAccountResponse();
    goToProgressTracker();
    cy.get(
      '[data-testid="incorporation-container"] [data-testid="btn-complete-step"]',
    )
      .should('be.enabled')
      .should('have.text', 'Complete');
  })

  it('Should disable complete button', () => {
    stubCompaniesResponse();
    stubDocumentResponse();
    stubAccountResponse();
    goToProgressTracker();
    cy.get(
      '[data-testid="incorporation-container"] [data-testid="btn-complete-step"]',
    )
      .should('be.disabled')
      .should('have.text', 'Completed');
  });

  it('Should disable completed after submit', () => {
    isCompleted = false;
    stubCompaniesResponse();
    stubDocumentResponse();
    stubAccountResponse();
    goToProgressTracker();
    cy.intercept('PATCH', `/api/v1/accounts/${accountId}`, (req) => {
      isCompleted = true;
      req.reply({
        statusCode: 204,
      });
    }).as('saved');
    cy.get(
      '[data-testid="incorporation-container"] [data-testid="btn-complete-step"]',
    )
      .as('btn')
      .click();

    cy.wait('@account');
    cy.get('@stepFilingDocuments').click();
    cy.get('@btn').should('have.text', 'Completed');
  });
});
