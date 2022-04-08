import React, { ReactNode } from 'react';
import { ButtonBase, Grid } from '@mui/material';
import { GridProps } from '@mui/material/Grid/Grid';

export interface IconTextProps {
  icon: ReactNode;
  content?: string;
  rootProps?: GridProps & { 'data-testid'?: string };
  textProps?: GridProps;
  onClick?: () => void;
}

export const IconText = ({
  icon,
  content = '',
  rootProps,
  textProps,
  onClick,
}: IconTextProps) => (
  <Grid container alignItems="center" {...rootProps}>
    <Grid item xs="auto">
      {icon}
    </Grid>
    <Grid item sx={{ pl: 1 }} {...textProps}>
      {onClick != null ? (
        <ButtonBase onClick={onClick} sx={{ fontWeight: 600 }}>
          {content}
        </ButtonBase>
      ) : (
        content
      )}
    </Grid>
  </Grid>
);
