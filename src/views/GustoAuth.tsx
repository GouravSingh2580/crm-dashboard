import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { processGustoAuth } from 'services/payroll';
import { RouteChildrenProps } from 'react-router';

const GustoAuth = ({ location }: RouteChildrenProps) => {
  const history = useHistory();
  const query = new URLSearchParams(location.search);
  const code = query.get('code');
  // run auth after init
  useEffect(() => {
    if (code) {
      processGustoAuth(code)
        .then(() => {
          history.push('/dashboard/profile');
        })
        .catch((e) => {
          console.log('error ', e.message);
        });
    }
  }, []);
  if (!code) {
    return <>Code is required</>;
  }
  return <>Loading...</>;
};

// eslint-disable-next-line import/no-default-export
export default GustoAuth;
