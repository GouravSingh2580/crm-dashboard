import {
  Box, Button, Container, Grid, Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Routes } from 'fnRoutes';

export const NotFoundPage = () => (
  <Container>
    <Grid container justifyContent="center">
      <Grid sx={{ maxWidth: 800 }}>
        <Box mt={8} sx={{ textAlign: 'center' }}>
          <Typography variant="h1" data-testid="title-not-found">Page not found</Typography>
          <Typography mt={4}>
            We are sorry, the page you requested could not be found. Please go back to homepage.
          </Typography>
          <Box mt={2}>
            <Link to={Routes.HOME()}>
              <Button variant="contained" data-testid="btn-homepage">Go to Homepage</Button>
            </Link>
          </Box>
        </Box>
      </Grid>
    </Grid>
  </Container>
);
