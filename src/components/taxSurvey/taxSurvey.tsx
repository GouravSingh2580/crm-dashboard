import { useEffect } from 'react';
import {
  Box,
  Button,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import * as Sentry from '@sentry/react';
import makeStyles from '@mui/styles/makeStyles';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useTaxSurvey from 'hooks/api/useTaxSurvey';
import {
  HEALTH_INSURANCE_OPTION,
  RETIREMENT_PLAN_LIST,
  RETIREMENT_PROGRAM_OPTION,
  Vendor1099OptionToLabel,
  FilingStatusOptionToLabel,
  HealthInsuranceOptionToLabel,
  RetirementProgramOptionToLabel,
  RetirementPlanListToLabel,
  TargetRetirementContributionToLabel,
  COMPLETION_STATUS,
  CompletionStatusToLabel,
} from 'enums/taxSurveyOptions';
import { showErrorToast, showSuccessToast } from 'components/toast/showToast';
import { FormField, FieldData } from './formField';

const useStyles = makeStyles((theme: any) => ({
  container: {
    padding: theme.spacing(4),
  },
  title: {
    color: theme.palette.primary.main,
  },
  groupSubtitle: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(4),
  },
  heading: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  divider: {
    marginBottom: theme.spacing(4),
  },
  buttonBox: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

const validationSchema = yup.object().shape({
  completionStatus: yup.string().optional(),
  filingStatus: yup.string().required('Please indicate your filing status'),
  additionalIncome: yup
    .string()
    .required('Please report any additional income (enter 0 if none)'),
  annualHouseholdIncome: yup
    .string()
    .required('Please estimate your annual household income'),
  taxesPaidForCurrentYear: yup
    .boolean()
    .nullable(true)
    .required(
      'Please indicate whether you made tax payments outside of payroll',
    ),
  currentYearFederalTaxAmount: yup
    .string()
    .when('taxesPaidForCurrentYear', {
      is: true,
      then: yup.string().required('This is a required field'),
    }),
  currentYearStateTaxAmount: yup
    .string()
    .when('taxesPaidForCurrentYear', {
      is: true,
      then: yup.string().required('This is a required field'),
    }),
  healthInsuranceOption: yup
    .string()
    .required('Please confirm your health insurance option'),
  paidHealthInsuranceThroughBusiness: yup
    .boolean()
    .nullable(true)
    .when('healthInsuranceOption', {
      is: HEALTH_INSURANCE_OPTION.INDEPENDENT_PURCHASE,
      then: yup.boolean().required('This is a required field'),
    }),
  totalInsurancePaymentAmount: yup
    .string()
    .when('paidHealthInsuranceThroughBusiness', {
      is: false,
      then: yup.string().required('This is a required field'),
    }),
  vendorsFor1099s: yup
    .string()
    .required('Please indicate whether you need to issue 1099s'),
  businessRetirementProgramExists: yup
    .string()
    .required(
      'Please indicate whether you currently have a business retirement plan',
    ),
  currentBusinessRetirementPlans: yup
    .object()
    .shape({
      selections: yup.array().of(yup.string()),
      other: yup.string(),
    })
    .nullable(true)
    .default({
      selections: [],
      other: '',
    })
    .when('businessRetirementProgramExists', {
      is: RETIREMENT_PROGRAM_OPTION.RETIREMENT_PLAN_EXISTS,
      then: yup
        .object()
        .shape({
          selections: yup.array().of(yup.string()).min(1, 'At least one selection required'),
          other: yup.string().when('selections', {
            is: (s: any) => Array.isArray(s) && s.includes('OTHER'),
            then: yup.string().min(1, 'Please indicate your other retirement plan'),
          }),
        })
        .required('This is a required field'),
    }),
  totalRetirementContributions: yup
    .string()
    .when('businessRetirementProgramExists', {
      is: RETIREMENT_PROGRAM_OPTION.RETIREMENT_PLAN_EXISTS,
      then: yup.string().required('This is a required field'),
    }),
  targetRetirementContributions: yup
    .string()
    .when('businessRetirementProgramExists', {
      is:
        RETIREMENT_PROGRAM_OPTION.RETIREMENT_PLAN_EXISTS
        || RETIREMENT_PROGRAM_OPTION.RETIREMENT_PLAN_DESIRED,
      then: yup.string().required('This is a required field'),
    }),
}).strict(true);

export const TaxSurvey = ({
  userData,
  taxSurveyData,
  taxSurveyDataIsFetched,
  isAdmin,
}: any) => {
  const classes = useStyles();

  const resolver = isAdmin ? undefined : yupResolver(validationSchema);

  const {
    control, errors, handleSubmit, watch, setValue, reset,
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver,
  });

  useEffect(() => {
    if (taxSurveyDataIsFetched) {
      reset(taxSurveyData);
    }
  }, [reset, taxSurveyData, taxSurveyDataIsFetched]);

  const shouldBeDisabled = !isAdmin
    && taxSurveyData?.completionStatus !== COMPLETION_STATUS.NO_INFORMATION;

  const { mutateAsync: updateTaxLiability, isLoading } = useTaxSurvey
    .UpsertTaxSurveyDataForUser({
      onSuccess: () => {
        showSuccessToast('Successfully saved tax projections form');
      },
      onError: () => {
        showErrorToast('Failed to save tax projections form');
      },
    });

  const onSubmit = (formData: FormData) => {
    const data = { ...formData };
    if (userData?.id && !shouldBeDisabled) {
      updateTaxLiability({ userId: userData?.id, data });
    }
  };

  const watchedValues = watch();

  const onError = (submitErrors: any) => {
    showErrorToast('Failed to submit form. Please check to see all required field were entered.');
    const sentryScope = new Sentry.Scope();
    const valuesForReporting = Object.entries(watchedValues).reduce((prev, [key, val]) => {
      const type = typeof val;
      const result = {
        ...prev,
        [key]: {
          type,
          value: val,
        },
      };
      // If valid user input exists, redact it so it doesn't show up in error logs
      if (val) {
        const len = type === 'string' || Array.isArray(val) ? val.length : null;
        result[key].len = len;
        result[key].value = 'REDACTED';
      }
      return result;
    }, {} as any);
    sentryScope.setExtra('submitErrors', submitErrors);
    sentryScope.setExtra('formValues', valuesForReporting);
    Sentry.captureMessage('Failed to submit tax survey', sentryScope);
  };

  const hideOnTaxesPaidForCurrentYear = () => {
    if (watchedValues.taxesPaidForCurrentYear) {
      return false;
    }
    return true;
  };

  const hideOnHealthInsuranceOption = () => {
    if (
      watchedValues.healthInsuranceOption === HEALTH_INSURANCE_OPTION.INDEPENDENT_PURCHASE
    ) {
      return false;
    }
    return true;
  };

  const hideOnPaidHealthInsuranceThroughBusiness = () => {
    if (watchedValues.paidHealthInsuranceThroughBusiness === false) {
      return false;
    }
    return true;
  };

  const hideOnBusinessRetirementProgramExists = () => {
    if (
      // eslint-disable-next-line max-len
      watchedValues.businessRetirementProgramExists === RETIREMENT_PROGRAM_OPTION.RETIREMENT_PLAN_EXISTS
    ) {
      return false;
    }
    return true;
  };

  const hideOnBusinessRetirementProgramDeclined = () => {
    if (!watchedValues.businessRetirementProgramExists) {
      return true;
    }
    if (
      // eslint-disable-next-line max-len
      watchedValues.businessRetirementProgramExists === RETIREMENT_PROGRAM_OPTION.RETIREMENT_PLAN_DECLINED
    ) {
      return true;
    }
    return false;
  };

  const hideIfNotAdmin = () => {
    if (isAdmin) {
      return false;
    }
    return true;
  };

  const fields: FieldData[] = [
    {
      name: 'completionStatus',
      title: 'Survey Completion Status',
      type: 'RADIO',
      defaultValue: taxSurveyData.completionStatus,
      options: Object.entries(CompletionStatusToLabel).map(
        ([value, label]) => ({
          label,
          value,
          type: 'LABEL',
        }),
      ),
      hideIf: [hideIfNotAdmin],
    },
    {
      name: 'filingStatus',
      title: '1. What is your filing status for tax year 2021',
      type: 'RADIO',
      defaultValue: taxSurveyData.filingStatus,
      options: Object.entries(FilingStatusOptionToLabel).map(
        ([value, label]) => ({
          label,
          value,
          type: 'LABEL',
        }),
      ),
    },
    {
      name: 'additionalIncome',
      title:
        '2. Please report any additional income you expect to receive from today until 12/31/2021. We already have your income for the year recorded.',
      subtitle:
        'We have all your income until now recorded in your business account, so please do not report your annual income expectation. This is for the additional income you will receive for the business from today until 12/31/2021',
      type: 'TEXT',
      defaultValue: taxSurveyData.additionalIncome,
    },
    {
      name: 'annualHouseholdIncome',
      title:
        '3. Estimate your annual household income outside of the business (spousal income, interest, dividends, other income or employment).',
      subtitle:
        'Do not include the W-2 from your business that we created for you or income received from your self employment activity.',
      type: 'TEXT',
      defaultValue: taxSurveyData.annualHouseholdIncome,
    },
    {
      title: 'Taxes Paid for 2021',
      subtitle:
        'Please tell us about any additional tax payments you made for 2021, separate from what was withheld from your payroll.',
      name: '',
      type: 'GROUP',
      children: [
        {
          name: 'taxesPaidForCurrentYear',
          title:
            '4. Did you make federal or state estimated payments outside of payroll?',
          type: 'RADIO',
          defaultValue: taxSurveyData.taxesPaidForCurrentYear,
          options: [
            { label: 'Yes', value: true, type: 'LABEL' },
            { label: 'No', value: false, type: 'LABEL' },
          ],
        },
        {
          name: 'currentYearFederalTaxAmount',
          title:
            '4a. Federal Taxes: How much in estimated payments did you make for your personal tax liability for 2021 already this year?',
          type: 'TEXT',
          defaultValue: taxSurveyData.currentYearFederalTaxAmount,
          hideIf: [hideOnTaxesPaidForCurrentYear],
        },
        {
          name: 'currentYearStateTaxAmount',
          title:
            '4b. State Taxes: How much in estimated payments did you make for your personal tax liability for 2021 already this year?',
          type: 'TEXT',
          defaultValue: taxSurveyData.currentYearStateTaxAmount,
          hideIf: [hideOnTaxesPaidForCurrentYear],
        },
      ],
    },
    {
      title: 'Health Insurance',
      subtitle: 'Please help us to verify our records for 2021',
      name: '',
      type: 'GROUP',
      children: [
        {
          name: 'healthInsuranceOption',
          title:
            '5. Please confirm how you received your health insurance for 2021',
          type: 'RADIO',
          defaultValue: taxSurveyData.healthInsuranceOption,
          options: Object.entries(HealthInsuranceOptionToLabel).map(
            ([value, label]) => ({
              label,
              value,
              type: 'LABEL',
            }),
          ),
        },
        {
          name: 'paidHealthInsuranceThroughBusiness',
          title:
            '5a. Did all the payments for your health insurance premiums in the year come from your business checking account/business credit card?',
          type: 'RADIO',
          defaultValue: taxSurveyData.paidHealthInsuranceThroughBusiness,
          options: [
            { label: 'Yes', value: true, type: 'LABEL' },
            { label: 'No', value: false, type: 'LABEL' },
          ],
          hideIf: [hideOnHealthInsuranceOption],
        },
        {
          name: 'totalInsurancePaymentAmount',
          title:
            '5b. Tell us how much your health, dental, and vision insurance premium payments are monthly throughout the year',
          subtitle:
            'In order to optimize your tax savings, we need the exact amount. However, feel free to estimate for now by writing "Estimate $xx.00"',
          type: 'TEXT',
          defaultValue: taxSurveyData.totalInsurancePaymentAmount,
          hideIf: [
            hideOnHealthInsuranceOption,
            hideOnPaidHealthInsuranceThroughBusiness,
          ],
        },
      ],
    },
    {
      title: '1099s for Vendors',
      subtitle:
        'We will need to issue 1099s for any vendor you gave cash, check, venmo, or other cash transfer payments made to that total over $600 in the year.',
      name: '',
      type: 'GROUP',
      children: [
        {
          name: 'vendorsFor1099s',
          title: '6. Do you have vendors you need to issue 1099s for?',
          type: 'RADIO',
          defaultValue: taxSurveyData.vendorsFor1099s,
          options: Object.entries(Vendor1099OptionToLabel).map(
            ([value, label]) => ({
              label,
              value,
              type: 'LABEL',
            }),
          ),
        },
      ],
    },
    {
      title: 'Retirement Program',
      type: 'GROUP',
      name: '',
      children: [
        {
          name: 'businessRetirementProgramExists',
          title:
            '7. Do you currently have a business retirement program set up?',
          subtitle:
            'Examples: Solo 401k, SEP, SIMPLE, 401k for small employers. We need to confirm this information each year to align your contributions and planning.',
          type: 'RADIO',
          defaultValue: taxSurveyData.businessRetirementProgramExists,
          options: Object.entries(RetirementProgramOptionToLabel).map(
            ([value, label]) => ({
              label,
              value,
              type: 'LABEL',
            }),
          ),
        },
        {
          name: 'currentBusinessRetirementPlans',
          title:
            '7a. What type of business retirement plan do you currently have set up?',
          subtitle: 'Select all that apply.',
          type: 'CHECKBOX',
          defaultValue: taxSurveyData.currentBusinessRetirementPlans || {
            selections: [],
            other: '',
          },
          options: Object.entries(RetirementPlanListToLabel).map(
            ([value, label]) => ({
              label,
              value,
              type: value === RETIREMENT_PLAN_LIST.OTHER ? 'TEXT' : 'LABEL',
            }),
          ),
          hideIf: [hideOnBusinessRetirementProgramExists],
        },
        {
          name: 'totalRetirementContributions',
          title: '7b. What are your total contributions already made for 2021?',
          subtitle:
            'Estimations are okay. If you use an estimation, please indicate "Estimated $XX.00"',
          type: 'TEXT',
          defaultValue: taxSurveyData?.totalRetirementContributions,
          hideIf: [hideOnBusinessRetirementProgramExists],
        },
        {
          name: 'targetRetirementContributions',
          title:
            '7c. How much in total would you like to contribute to retirement for 2021',
          type: 'RADIO',
          defaultValue: taxSurveyData?.targetRetirementContributions,
          options: Object.entries(TargetRetirementContributionToLabel).map(
            ([value, label]) => ({
              label,
              value,
              type: value === RETIREMENT_PLAN_LIST.OTHER ? 'TEXT' : 'LABEL',
            }),
          ),
          hideIf: [hideOnBusinessRetirementProgramDeclined],
        },
      ],
    },
  ];

  const renderController = (field: FieldData) => (
    <Controller
      key={field.name}
      name={field.name}
      control={control}
      defaultValue={field.defaultValue}
      // eslint-disable-next-line object-curly-newline
      render={({ onChange, onBlur, value, ref, name }) => (
        <FormField
          error={errors[name]}
          field={field}
          onChange={onChange}
          value={value}
          setValue={setValue}
          disabled={shouldBeDisabled}
          onBlur={onBlur}
          inputRef={ref}
          shouldHide={Array.isArray(field.hideIf)
            && field.hideIf.some((cond: any) => cond())}
        />
      )}
    />
  );

  return (
    <Paper className={classes.container}>
      {fields.map((field: FieldData, i: number) => {
        const key = `group-${i}`;
        if (field.type === 'GROUP') {
          return (
            <div key={key} className={classes.heading}>
              <Divider variant="middle" className={classes.divider} />
              <Typography variant="h4">{field.title}</Typography>
              {field.subtitle && (
                <div className={classes.groupSubtitle}>{field.subtitle}</div>
              )}
              {field.children && field.children.map((child: any) => renderController(child))}
            </div>
          );
        }
        return renderController(field);
      })}
      {
        !shouldBeDisabled && (
          <Box className={classes.buttonBox}>
            <Button
              color="secondary"
              fullWidth
              onClick={handleSubmit(onSubmit, onError)}
              size="large"
              variant="contained"
              disabled={isLoading}
            >
              {isAdmin ? 'Save' : 'Submit'}
            </Button>
          </Box>
        )
      }
    </Paper>
  );
};
