import { AppMock } from 'helpers/__tests__/MockApp';
import { render } from '@testing-library/react';
import { Payroll } from 'components/AdminBusinessHealth/healthStatus/Payroll';
import { IAccount } from 'models/account';

describe('Payroll component test', () => {
  let account: IAccount;
  let updateAccount: jest.Mock;
  beforeEach(() => {
    account = {
      companyName: '',
      createdAt: '',
      entityType: '',
      estimatedSalary: 0,
      healthInsurance: 'todo',
      payrollEnabled: false,
      payrollRunNumber: 0,
      progress: [],
      retirementPlan: 'todo',
      status: { label: 'NEW' },
      taxLiability: { estimatedTaxLiability: '', updatedAt: '' },
      id: '123',
    };
    updateAccount = jest.fn();
  })

  it('should render checkbox unchecked', () => {
    account.payrollRunNumber = 3;
    const result = render(
      <AppMock>
        <Payroll accountData={account} updateAccountData={updateAccount} />
      </AppMock>,
    );
    const field = result.getByTestId('field-payroll-enabled');
    const checkbox = field.querySelector('input');
    expect(checkbox?.checked).toBe(false);
    expect(result.getByTestId('number-payroll-run').textContent).toBe('N/A');
  });

  it('should render number of 0', () => {
    account.payrollEnabled = true;
    const result = render(
      <AppMock>
        <Payroll accountData={account} updateAccountData={updateAccount} />
      </AppMock>,
    );
    const field = result.getByTestId('field-payroll-enabled');
    const checkbox = field.querySelector('input');
    expect(checkbox?.checked).toBe(true);
    expect(result.getByTestId('number-payroll-run').textContent).toBe('0');
  });

  it('should render number of non-zero', () => {
    account.payrollEnabled = true;
    account.payrollRunNumber = 3;
    const result = render(
      <AppMock>
        <Payroll accountData={account} updateAccountData={updateAccount} />
      </AppMock>,
    );
    const field = result.getByTestId('field-payroll-enabled');
    const checkbox = field.querySelector('input');
    expect(checkbox?.checked).toBe(true);
    expect(result.getByTestId('number-payroll-run').textContent).toBe('3');
  });
});
