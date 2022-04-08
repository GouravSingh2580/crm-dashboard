import { Button, Grid, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { ReadOnlyForm, ReadOnlyItemType } from 'components/common/ReadOnlyForm';
import { useState } from 'react';
import { PersonalTaxLiabilityForm } from 'components/company/TaxLiability/PersonalTaxLiabilityForm';
import { getPrettyDateTime } from 'helpers/dateTimeFormat';
import { Taxes } from 'models/account';

type TProps = {
  accountId: string | undefined;
  taxes: Taxes | undefined;
};

export const PersonalTaxLiability = ({ accountId, taxes }: TProps) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const readOnlyItems: ReadOnlyItemType[] = [
    {
      title: `Estimated Annual Tax Liability — last update: ${
        taxes?.updatedAt? getPrettyDateTime(taxes?.updatedAt, 'MMM D, YYYY'): ''
      }`,
      value: taxes?.annualEstimated || '',
    },
  ];

  const content = isEdit ? (
    <PersonalTaxLiabilityForm
      accountId={accountId}
      taxes={taxes}
      onSwitch={() => setIsEdit(false)}
    />
  ) : (
    <ReadOnlyForm items={readOnlyItems} titleVariant="body3S" />
  );

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="body1B" component="span">
          Personal Tax Liability
        </Typography>
        <Button
          size="small"
          aria-label="edit"
          sx={{ marginLeft: '24px' }}
          startIcon={<EditIcon />}
          onClick={() => {
            setIsEdit(!isEdit);
          }}
          data-testid="edit-btn"
        >
          Edit
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2S" component="p">
          Setup Estimated Total Liability
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {content}
      </Grid>
    </Grid>
  );
};
