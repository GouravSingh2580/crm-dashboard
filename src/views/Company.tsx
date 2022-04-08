import React, { ReactNode, useMemo, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Tabs, Tab, Breadcrumbs, Link as MaterialLink } from '@mui/material';
import { applyFeatureFlag, FLAGS } from 'hooks/useFeatureFlag';
import { BankTransactionsPage } from 'components/company/banks/BankTransactionsPage';
import { BankAccounts } from 'components/company/banks/BankAccounts';
import { TaxSurvey } from 'components/taxSurvey/taxSurvey';
import { AdminBusinessHealth } from 'components/AdminBusinessHealth';
import { AdminProgressTracker } from 'components/AdminProgressTracker';
import { ProgressTrackerStages } from 'models/account';
import { isStageComplete } from 'helpers/progressTracker';
import { Company as CompanyType } from 'services/companies';
import { EstimatedSalary } from 'components/company/payroll';
import { TaxLiability } from 'components/company/TaxLiability';
import { useUser } from '../hooks/api';
import { useAccount } from '../hooks/api/useAccounts';
import { useCompanyByUserId } from '../hooks/api/useCompanies';
import useContacts from '../hooks/api/useContacts';
import useTaxSurvey from '../hooks/api/useTaxSurvey';
import {
  useCompanyDataForAdminPage,
  useUserDataForAdminPage,
  useAccountDataForAdminPage,
  useCompanyName,
} from '../hooks/dataFormatters';
import { Profile, Info } from '../components/company';
import { Documents } from '../components/documents';
import useLoading from '../hooks/useLoading';
import { Routes } from '../fnRoutes';

const useStyles = makeStyles((theme) => ({
  documentsContainer: {
    paddingTop: theme.spacing(4),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

interface ITabPanel extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  value: string;
  currentTab: string;
}

const TabPanel = ({ children, currentTab, value, ...rest }: ITabPanel) => (
  <div
    role="tabpanel"
    id={`full-width-tabpanel-${value}`}
    aria-labelledby={`full-width-tab-${value}`}
    {...rest}
  >
    {value === currentTab && children}
  </div>
);

const Company = () => {
  const classes = useStyles();
  const { state = {} } = useLocation<{ page?: string }>();
  const { page } = state;

  const { id: userId } = useParams<{ id: string }>();
  const { user: userData, isLoading: isLoadingUser } = useUser(userId);

  const { company: companyData, isLoading: isLoadingCompany } =
    useCompanyByUserId(userId);

  const userDataFormatted = useUserDataForAdminPage(userData);

  const companyDataFormatted = useCompanyDataForAdminPage(
    companyData,
  ) as CompanyType;

  const { accountId } = userDataFormatted;
  const { account: accountData, isLoading: isLoadingAccount } =
    useAccount(accountId);

  const accountDataFormatted = useAccountDataForAdminPage(accountData);

  const isDocumentSigningCompleted = useMemo(
    () =>
      isStageComplete(
        ProgressTrackerStages.DocumentSigning,
        accountData?.progress || [],
      ),
    [accountData],
  );

  const { contactId } = userDataFormatted;
  const { data: contactData, isLoading: isLoadingContact } =
    useContacts.GetContact(contactId);

  const { id: companyId } = companyDataFormatted;
  const { name } = useCompanyName(companyDataFormatted);

  const {
    data: taxSurveyData,
    isLoading: isLoadingTaxSurvey,
    isFetched: isFetchedTaxSurvey,
  } = useTaxSurvey.GetTaxSurveyDataForUser(userData ? userData.id : '');

  const [tab, setTab] = useState<string>('profile');
  const loadingAnimation = useLoading(
    isLoadingUser ||
      isLoadingCompany ||
      isLoadingAccount ||
      isLoadingContact ||
      isLoadingTaxSurvey,
  );

  const handleTabChange = (event: React.SyntheticEvent, value: string) => {
    setTab(value);
  };

  return (
    <main className={classes.content}>
      {loadingAnimation}
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          color="inherit"
          to={{
            pathname: Routes.ACCOUNTS,
            state: { page },
          }}
        >
          Accounts
        </Link>
        {name && (
          <MaterialLink color="textPrimary" aria-current="page">
            {name}
          </MaterialLink>
        )}
      </Breadcrumbs>
      <Info
        accountData={accountDataFormatted}
        companyData={companyDataFormatted}
        userData={userDataFormatted}
      />
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleTabChange}
        data-testid="tab-company-container"
      >
        <Tab
          value="profile"
          label="Profile"
          data-testid="tab-company-profile"
        />
        <Tab
          value="documents"
          label="Documents"
          data-testid="tab-company-documents"
        />
        {companyData?.entityType && (
          <Tab
            value="progress-tracker"
            label="Progress Tracker"
            data-testid="tab-company-progress"
          />
        )}
        <Tab
          value="businessHealth"
          label="Business Health"
          data-testid="tab-company-businessHealth"
        />
        {applyFeatureFlag(
          FLAGS.BETA,
          <Tab
            value="payroll"
            label="Payroll"
            data-testid="tab-company-payroll"
          />,
        )}
        <Tab
          value="taxLiability"
          label="Tax Liability"
          data-testid="tab-company-taxLiability"
        />
        <Tab
          value="tax"
          label="EOY survey"
          data-testid="tab-company-tax-form"
        />
        {applyFeatureFlag(
          FLAGS.BOOKKEEPING,
          <Tab
            value="bank-accounts"
            label="Bank Accounts"
            data-testid="tab-company-banks"
          />,
        )}
        {applyFeatureFlag(
          FLAGS.BOOKKEEPING,
          <Tab
            value="bank-transactions"
            label="Bank Transactions"
            data-testid="tab-company-transactions"
          />,
        )}
      </Tabs>
      <TabPanel value="profile" currentTab={tab}>
        {contactData && (
          <Profile
            documentSigningCompleted={isDocumentSigningCompleted}
            companyData={companyDataFormatted}
            userData={userDataFormatted}
            contactData={contactData}
            accountData={accountDataFormatted}
          />
        )}
      </TabPanel>
      <TabPanel value="progress-tracker" currentTab={tab}>
        {companyId && (
          <AdminProgressTracker
            companyId={companyId}
            companyData={companyDataFormatted}
            userData={userDataFormatted}
          />
        )}
      </TabPanel>
      <TabPanel value="documents" currentTab={tab}>
        <div className={classes.documentsContainer}>
          {companyId && (
            <Documents companyId={companyId} accountId={accountId} />
          )}
        </div>
      </TabPanel>
      <TabPanel value="tax" currentTab={tab}>
        <div>
          <TaxSurvey
            userData={userData}
            taxSurveyData={taxSurveyData}
            taxSurveyDataIsFetched={isFetchedTaxSurvey}
            isAdmin
          />
        </div>
      </TabPanel>

      {applyFeatureFlag(
        FLAGS.BETA,
        <TabPanel currentTab={tab} value="payroll">
          <EstimatedSalary />
        </TabPanel>,
      )}

      {applyFeatureFlag(
        FLAGS.BOOKKEEPING,
        <TabPanel value="bank-accounts" currentTab={tab}>
          <div>
            <BankAccounts accountId={accountId} />
          </div>
        </TabPanel>,
      )}
      {applyFeatureFlag(
        FLAGS.BOOKKEEPING,
        <TabPanel value="bank-transactions" currentTab={tab}>
          <div>
            <BankTransactionsPage accountId={accountId} />
          </div>
        </TabPanel>,
      )}
      <TabPanel currentTab={tab} value="taxLiability">
        <TaxLiability />
      </TabPanel>
      <TabPanel value="businessHealth" currentTab={tab}>
        <div>
          <AdminBusinessHealth
            accountData={accountDataFormatted}
            companyData={companyDataFormatted}
            userData={userDataFormatted}
          />
        </div>
      </TabPanel>
    </main>
  );
};

export default Company;
