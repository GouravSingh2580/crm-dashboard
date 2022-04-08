import { Button, Grid, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { ReadOnlyForm, ReadOnlyItemType } from 'components/common/ReadOnlyForm';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAccountByUserId } from 'hooks/api';
import { CompensationForm } from 'components/company/payroll/CompensationForm';
import useLoading from 'hooks/useLoading';
import { numberFormat } from 'helpers/currencyFormat';

export const Compensation = () => {
  const { id } = useParams<{ id: string }>();
  const { account, isLoading } = useAccountByUserId(id);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const loading = useLoading(isLoading);
  if (isLoading || account == null) {
    return loading;
  }

  const estimatedSalary =
    account.estimatedSalary != null
      ? numberFormat(account.estimatedSalary)
      : undefined;
  const readOnlyItems: ReadOnlyItemType[] = [
    {
      title: 'Annual Reasonable Compensation',
      value: estimatedSalary,
    },
  ];

  const content = isEdit ? (
    <CompensationForm account={account} onSwitch={() => setIsEdit(false)} />
  ) : (
    <ReadOnlyForm items={readOnlyItems} />
  );

  return (
    <Grid container direction="column">
      <Grid item container>
        <Grid item container direction="row" alignItems="baseline" rowGap={2}>
          <Typography variant="h5B" component="span">
            Reasonable Compensation
          </Typography>
          <Button
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
        <Grid>
          <Typography variant="body2" component="p" fontWeight={400}>
            Setup Estimated Reasonable Compensation for Business Owner (s)
          </Typography>
        </Grid>
      </Grid>
      {isLoading ? loading : content}
    </Grid>
  );
};
