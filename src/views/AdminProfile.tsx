import { Button, Container, Typography } from '@mui/material';
import { useGustoCurrentUser } from 'hooks/api/gusto';
import { CONFIG } from 'config';
import useLoading from 'hooks/useLoading';
import { FLAGS, withFeatureFlag } from 'hooks/useFeatureFlag';

const getAuthUrl = () => {
  const params = new URLSearchParams();
  params.set('client_id', CONFIG.gustoClientId);
  params.set('redirect_uri', CONFIG.gustoRedirectUri);
  params.set('response_type', 'code');
  return `${CONFIG.gustoAuthUrl}/?${params.toString()}`;
};

const AdminProfileUI = () => {
  const { currentGustoUser, isLoading } = useGustoCurrentUser();
  const authUrl = getAuthUrl();

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (currentGustoUser) {
    content = <p>you have connected as {currentGustoUser.email}</p>;
  } else {
    content = (<>
      <p>You are not connected to gusto</p>
      <Button variant="contained" href={authUrl} target="_blank">
        Connect
      </Button>
    </>)
  }
  const loadingState = useLoading(isLoading);

  return (
    <Container sx={{ p: 3 }} maxWidth={false}>
      <Typography variant="h3" component="h1">
        Admin profile
      </Typography>
      {loadingState}
      {content}
    </Container>
  );
};

// eslint-disable-next-line import/no-default-export
const AdminProfile = withFeatureFlag(FLAGS.BETA)(AdminProfileUI);
export default AdminProfile;
