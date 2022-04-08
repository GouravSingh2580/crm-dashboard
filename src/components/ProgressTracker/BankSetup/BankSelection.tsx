import { useState, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { HubspotService } from 'services';
import { ProgressTrackerStatus } from 'services/account';
import { UserInfo } from 'services/users';
import { makeStyles } from '@mui/styles';
import { ALLOWED_BANKS } from 'enums';
import { BankNameKey, Company } from 'models/company';
import { ENTITY_MAPPING } from 'constants/common';
import { useUpdateCompany } from 'hooks/api';
import { useUpdateTimeContactProperties } from 'hooks';
import queryClient from 'states/reactQueryClient';
import { HaveAccount } from './HaveAccount';
import { HaveAccountWith } from './HaveAccountWith';
import { BankLikeToUse } from './BankLikeToUse';
import { WillingToSwitch } from './WillingToSwitch';
import { ProvideBankName } from './ProvideBankName';

const useStyles = makeStyles((theme) => ({
  textSecondary: {
    color: theme.palette.text.secondary,
  },
}));

interface TParams {
  company: Company | undefined;
  handleComplete: (status: ProgressTrackerStatus, eventData: Object) => void;
  user: UserInfo | undefined;
}

type TBankSelectionState = {
  hasBankAccount: boolean | undefined;
  willingToSwitch: boolean | null;
  bankName: string;
  otherBankName: string;
  step: number;
  initialBankName: string;
};

export const BankSelection = ({ company, handleComplete, user }: TParams) => {
  const classes = useStyles();

  const [state, setState] = useState<TBankSelectionState>({
    hasBankAccount: undefined,
    willingToSwitch: null,
    bankName: '',
    otherBankName: '',
    step: 0,
    initialBankName: '',
  });

  const [isSubmitting, setSubmitting] = useState(false);

  const {
    step,
    hasBankAccount,
    bankName,
    otherBankName,
    willingToSwitch,
    initialBankName,
  } = state;

  const { mutateAsync: updateCompany } = useUpdateCompany({
    onSuccess: () => {
      queryClient.invalidateQueries(['getCompany', company?.id]);
    },
  });

  const { mutate: updateTimeContactProperties } =
  useUpdateTimeContactProperties();

  useEffect(() => {
    if (company) {
      if (
        company.entityType === ENTITY_MAPPING.sole_prop &&
        !company?.bankName
      ) {
        /**
         * For sole proprietors, we should automatically say "no" to "do you have a
         * business bank account?"
         * because they don't have their EIN yet and so cannot have a business bank account.
         */
        setState({
          ...state,
          step: 3,
          hasBankAccount: company?.hasBankAccount
        });
      } else if (company?.useExistingBank === false && company?.bankName) {
        setState({
          ...state,
          otherBankName: company.bankName,
          willingToSwitch: false,
          hasBankAccount: company?.hasBankAccount,
          bankName: 'other',
          step: 4,
          initialBankName: company.bankName,
        });
      } else if (company?.useExistingBank === true && company?.bankName) {
        setState({
          ...state,
          bankName: company.bankName,
          hasBankAccount: company?.hasBankAccount,
          step: company?.hasBankAccount? 1 : 3,
          initialBankName: company.bankName,
        });
      }
    }
  }, [company]);

  const updateCompanyDetails = async (bank: string) => {
    if (company?.id && user?.contactId) {
      setSubmitting(true);
      const isExistingBank = !!ALLOWED_BANKS[bank];
      const data = {
        bankName: bank as BankNameKey,
        useOtherBank: !isExistingBank,
        useExistingBank: isExistingBank,
        hasBankAccount
      };
      await updateCompany({ id: company.id, data })
      updateTimeContactProperties({
        contactId: user.contactId,
        property: HubspotService.TimestampAccountType.BANKPREFERENCE,
      });
      handleComplete(ProgressTrackerStatus.Completed, {
        'bankName': data.bankName,
        'bankRequired': data.hasBankAccount? 'Yes': 'No'
      });
    }
  };

  const goPrev = (stepIndex: number) => (
    <Button
      onClick={() =>
        setState({
          ...state,
          step: stepIndex,
        })
      }
      startIcon={<ArrowBackIcon />}
      disabled={isSubmitting}
      data-testid="back-btn"
    >
      Back
    </Button>
  );

  return (
    <div data-testid="step-bank-selection">
      <Typography
        variant="body1"
        sx={{
          marginBottom: '8px',
        }}
        className={classes.textSecondary}
      >
        Bank Selection
      </Typography>
      <form>
        {step === 0 && (
          <HaveAccount
            onContinue={(value: boolean) => {
              if (!value) {
                setState({
                  ...state,
                  hasBankAccount: value,
                  otherBankName: '',
                  bankName: value !== hasBankAccount? '': state.bankName,
                  step: 3,
                });
              } else {
                setState({
                  ...state,
                  hasBankAccount: value,
                  bankName: value !== hasBankAccount? '': state.bankName,
                  step: 1,
                });
              }
            }}
            selected={hasBankAccount}
          />
        )}

        {step === 1 && (
          <HaveAccountWith
            onContinue={(value: string) => {
              if (value === 'other') {
                setState({
                  ...state,
                  bankName: value,
                  step: 2,
                });
              } else {
                updateCompanyDetails(value);
              }
            }}
            goPrev={goPrev(0)}
            isSubmitting={isSubmitting}
            selected={bankName}
            initialBankName={initialBankName}
          />
        )}

        {step === 2 && (
          <WillingToSwitch
            onContinue={(value: boolean) => {
              if (value === willingToSwitch) {
                setState({
                  ...state,
                  willingToSwitch: value,
                  step: value ? 3 : 4,
                });
              } else {
                setState({
                  ...state,
                  willingToSwitch: value,
                  otherBankName: '',
                  step: value ? 3 : 4,
                });
              }
            }}
            goPrev={goPrev(1)}
            selected={willingToSwitch}
          />
        )}

        {step === 3 && (
          <BankLikeToUse
            isSubmitting={isSubmitting}
            onContinue={(value: string) => {
              updateCompanyDetails(value);
            }}
            goPrev={company?.entityType !== ENTITY_MAPPING.sole_prop && goPrev(willingToSwitch ? 2 : 0)}
            selected={bankName}
          />
        )}

        {step === 4 && (
          <ProvideBankName
            onContinue={(value: string) => {
              updateCompanyDetails(value);
            }}
            goPrev={goPrev(2)}
            isSubmitting={isSubmitting}
            selected={otherBankName}
            initialBankName={initialBankName}
          />
        )}
      </form>
    </div>
  );
};
