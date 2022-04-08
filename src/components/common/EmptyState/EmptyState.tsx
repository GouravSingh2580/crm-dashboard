import { Grid } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
  icon?: ReactNode;
  message: string;
  button?: ReactNode;
}

export const EmptyState = ({ icon = null, message, button = null }: Props) => (
  <Grid container direction="column" spacing={2} alignItems="center">
    {icon != null && <Grid item>{icon}</Grid>}
    <Grid item>{message || 'No item available!'}</Grid>
    {button != null && <Grid item>{button || null}</Grid>}
  </Grid>
);
