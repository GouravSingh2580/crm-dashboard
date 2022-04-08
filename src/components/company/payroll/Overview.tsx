import { Grid, Typography } from '@mui/material';
import { ReadOnlyForm, ReadOnlyItemType } from 'components/common/ReadOnlyForm';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAccountByUserId } from 'hooks/api';
import { numberFormat } from 'helpers/currencyFormat';

export const getRemainSalary = (
  ytdSalary: number | undefined,
  estimatedSalary: number | undefined,
) => {
  if (ytdSalary == null || estimatedSalary == null) return undefined;
  return numberFormat(Math.max(0, estimatedSalary - ytdSalary), 2);
};

export const getOverPay = (
  ytdSalary: number | undefined,
  estimatedSalary: number | undefined,
) => {
  if (ytdSalary == null || estimatedSalary == null) return '-';
  return estimatedSalary < ytdSalary
    ? numberFormat(ytdSalary - estimatedSalary, 2)
    : '-';
};

export const Overview = () => {
  const { id: userId } = useParams<{ id: string }>();
  const { account } = useAccountByUserId(userId);

  const salaryTaken = useMemo(() => {
    if (account?.ytdSalary == null) return undefined;
    return numberFormat(account.ytdSalary, 2);
  }, [account]);

  const remainSalary = useMemo(
    () => getRemainSalary(account?.ytdSalary, account?.estimatedSalary),
    [account],
  );

  const overPay = useMemo(
    () => getOverPay(account?.ytdSalary, account?.estimatedSalary),
    [account],
  );

  const readOnlyItems: ReadOnlyItemType[] = [
    {
      title: 'Salary Taken',
      value: salaryTaken,
    },
    {
      title: 'Remaining Salary',
      value: remainSalary,
    },
    {
      title: 'Annual Over Reasonable Compensation',
      value: (
        <Typography
          variant="body2B"
          component="span"
          sx={{ color: 'warning.main' }}
        >
          {overPay}
        </Typography>
      ),
    },
  ];
  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h5B" component="span">
          Overview
        </Typography>
      </Grid>
      <Grid item>
        <ReadOnlyForm items={readOnlyItems} />
      </Grid>
    </Grid>
  );
};
