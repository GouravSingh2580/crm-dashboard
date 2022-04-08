import { Box, Button } from '@mui/material';

type TAccordionCTA = {
  expanded: boolean | string;
  handleExpand: (value: string) => void;
  completed: number;
  totalStep: number;
  testId: string;
  accordionId: string;
};

export const AccordionCTA = ({
  expanded,
  handleExpand,
  completed,
  totalStep,
  testId,
  accordionId,
}: TAccordionCTA) =>
  expanded ? null : (
    <Box
      sx={{
        width: '100%',
        marginTop: '16px',
      }}
    >
      <Button
        variant="contained"
        size="large"
        data-testid={testId}
        onClick={() => handleExpand(accordionId)}
      >
        {completed === 0 && "Let's Start"}
        {completed > 0 && completed < totalStep && 'Continue'}
        {completed === totalStep && 'View'}
      </Button>
    </Box>
  );
