import { useEffect, useState } from 'react';
import moment from 'moment';
import { Button, Divider, Typography } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import makeStyles from '@mui/styles/makeStyles';
import * as yup from 'yup';

import { HealthStatusSection } from 'components/AdminBusinessHealth';
import { Company } from 'services';
import {
  checkAdminIncorporationRenewStatus,
  getStatusFromScore,
  getAdminIncorporationStatusByScore,
} from 'helpers/businessHealth';
import { Spacer } from 'components/Spacer';
import { formatDate } from 'helpers/dateTimeFormat';
import {
  FormationsForm,
  FormationsFormFields,
  IFormField,
} from 'components/common/FormationsForm';

const useStyles = makeStyles((theme) => ({
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  title: {
    color: theme.palette.text.primary,
    opacity: 0.7,
  },
  statusText: {
    color: theme.palette.text.primary,
  },
  editButton: {
    color: theme.palette.text.primary,
    opacity: 0.7,
    fontSize: 14,
    padding: 0,
  },
  editActionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}));

const schema = yup.object().shape({
  incorporationRenewalDate: yup
    .date()
    .transform((_value, originalValue) => {
      const parsedValue = moment(originalValue, 'M/D/YYYY', true);
      // if it's valid return the date object, otherwise return an `InvalidDate`
      return parsedValue.isValid() ? parsedValue.toDate() : new Date('');
    })
    .typeError('Invalid date of incroporation renewal'),
});

const fieldMap: IFormField[] = [
  {
    type: FormationsFormFields.Date,
    name: 'incorporationRenewalDate',
    placeholder: 'MM/DD/YYYY',
    label: 'Incorporation Renewal Date',
    startAdornment: '',
  },
];

interface Props {
  companyData: Company;
  updateCompanyData: (fieldName: string, newStatus: string) => void;
}

export const IncorporationHealth = (props: Props) => {
  const classes = useStyles();
  const { companyData, updateCompanyData } = props;
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [incorporationRenewalDate, setIncorporationRenewalDate] =
    useState<string>();

  useEffect(() => {
    if (companyData.incorporationRenewalDate) {
      setIncorporationRenewalDate(companyData.incorporationRenewalDate);
    }
  }, [companyData]);
  const score = checkAdminIncorporationRenewStatus(
    companyData.incorporationRenewalDate,
    companyData.incorporationDate,
  );
  const status = getStatusFromScore(score);
  const incorporationDateText = formatDate(
    companyData.incorporationDate,
    'N/A',
  );

  const handleSaveRenewalDate = (data: {
    incorporationRenewalDate: string;
  }) => {
    const formatedDate = formatDate(data.incorporationRenewalDate);
    setIsEditMode(false);
    updateCompanyData('incorporationRenewalDate', formatedDate);
    setIncorporationRenewalDate(formatedDate);
  };

  const handleCancelEditRenewalDate = () => {
    setIsEditMode(false);
    setIncorporationRenewalDate(companyData.incorporationRenewalDate);
  };

  const incorporationRenewalDateText: string = formatDate(
    incorporationRenewalDate,
    'Not yet entered',
  );

  const EditView = () => (
    <>
      <div className={classes.titleContainer}>
        <Typography variant="body3S" className={classes.title}>
          Incorporation Renewal Date
        </Typography>

        <Button
          aria-label="edit"
          data-testid="btn-edit-incorporationRenewalDate"
          onClick={() => setIsEditMode(true)}
          size="large"
          className={classes.editButton}
        >
          <EditIcon fontSize="small" />
          Edit
        </Button>
      </div>
      <FormationsForm
        onChange={(fieldName, data) => {
          if (
            fieldName === 'incorporationRenewalDate' &&
            data?.incorporationRenewalDate
          ) {
            setIncorporationRenewalDate(
              formatDate(data?.incorporationRenewalDate),
            );
          }
        }}
        onSubmit={handleSaveRenewalDate}
        fieldsMap={fieldMap}
        onCancel={handleCancelEditRenewalDate}
        validationSchema={schema}
        defaultValues={{
          incorporationRenewalDate,
        }}
      />
    </>
  );

  const ReadOnlyView = () => (
    <>
      <div className={classes.titleContainer}>
        <Typography variant="body3S" className={classes.title}>
          Incorporation Renewal Date
        </Typography>

        <Button
          aria-label="edit"
          data-testid="btn-edit-incorporationRenewalDate"
          onClick={() => setIsEditMode(true)}
          size="large"
          className={classes.editButton}
        >
          <EditIcon fontSize="small" />
          Edit
        </Button>
      </div>
      <Typography variant="body2B" className={classes.statusText}>
        {incorporationRenewalDateText}
      </Typography>
    </>
  );

  return (
    <HealthStatusSection title="Incorporation" status={status}>
      <div className={classes.titleContainer}>
        <Typography variant="body3S" className={classes.title}>
          Incorporation Status
        </Typography>
      </div>
      <Typography variant="body2B" className={classes.statusText}>
        {getAdminIncorporationStatusByScore(score)}
      </Typography>
      <Spacer height={2} />
      <Divider />
      <Spacer height={2} />
      <div className={classes.titleContainer}>
        <Typography variant="body3S" className={classes.title}>
          Date of Incorporation
        </Typography>
      </div>
      <Typography variant="body2B" className={classes.statusText}>
        {incorporationDateText}
      </Typography>
      <Spacer height={2} />
      <Divider />
      <Spacer height={2} />
      {isEditMode ? <EditView /> : <ReadOnlyView />}
    </HealthStatusSection>
  );
};
