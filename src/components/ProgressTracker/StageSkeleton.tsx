import { Box, Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

export const StageSkeleton = () => (
  <Box
    sx={{
      padding: '40px',
      marginBottom: '24px',
      backgroundColor: '#fff',
      border: '1px solid rgba(13, 34, 89, 0.23)',
      boxSizing: 'border-box',
      borderRadius: '5px',
    }}
  >
    <Grid container spacing={8}>
      <Grid item xs={10}>
        <Skeleton variant="text" width={240} height={32} />
        <Skeleton variant="text" width="100%" height={28} />
        <Skeleton variant="text" width="50%" height={28} />
        <Skeleton variant="text" width={300} height={20} />
        <Skeleton variant="rectangular" width={126} height={42} style={{ marginTop: '16px' }} />
      </Grid>
      <Grid
        item
        xs={2}
      >
        <Skeleton variant="text" width={80} height={28} />
      </Grid>
    </Grid>
  </Box>
);
