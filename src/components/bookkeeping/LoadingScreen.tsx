import { Grid, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { ReactComponent as LoadingIcon } from 'icons/bank_loading.svg';
import { ReactComponent as LoadingIcon2 } from 'icons/bank_loading2.svg';
import { ReactComponent as LoadingIcon3 } from 'icons/bank_loading3.svg';

interface IStages {
  icon: ReactNode;
  heading: ReactNode;
  text: string;
}
export const Stages: IStages[] = [
  {
    icon: <LoadingIcon />,
    heading: (
      <>
        Well done!
        <br />
        Your bank is now connected!
      </>
    ),
    text: 'We are loading your bank accounts...',
  },
  {
    icon: <LoadingIcon2 />,
    heading: 'Just a few more seconds',
    text: 'We are loading your bank accounts...',
  },
  {
    icon: <LoadingIcon3 />,
    heading: 'Here we go',
    text: 'All set',
  },
];

interface Props {
  // eslint-disable-next-line react/require-default-props
  stage?: IStages,
}

export const LoadingScreen = ({ stage = Stages[1] }: Props) => (
  <Grid
    container
    direction="column"
    justifyContent="center"
    alignItems="center"
    sx={{
      flexGrow: 1,
    }}
  >
    <Grid item>
      {stage.icon}
    </Grid>
    <Grid item>
      <Typography
        variant="h5B"
        component="h2"
        sx={{
          color: 'text.primary',
          mt: 3,
          mb: 2,
          textAlign: 'center',
        }}
      >
        {stage.heading}
      </Typography>
    </Grid>
    <Grid item>
      <Typography
        variant="subtitle1"
        component="p"
        sx={{ color: 'text.primary' }}
      >
        {stage.text}
      </Typography>
    </Grid>
  </Grid>
);
