import { Alert, AlertTitle, Box, Container } from '@mui/material';

interface Props {
  error: Error;
  componentStack: string | null;
}

export const ErrorFallback = ({ error, componentStack }: Props) => (
  <Container>
    <Box mt={2}>
      <Alert severity="error">
        <AlertTitle>An error has been occurred</AlertTitle>
        <div>You have encountered an error</div>
        <div>{error.toString()}</div>
        <div>{componentStack}</div>
      </Alert>
    </Box>
  </Container>
);
