import { Box } from '@mui/material';

interface ISpacerProps {
  height: number;
}

export const Spacer = ({ height }: ISpacerProps) => (
  <Box sx={{ mt: height, width: '100%' }} />
);
