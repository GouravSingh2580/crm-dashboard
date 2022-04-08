import { ChangeEvent, useState } from 'react';
import { Button, TextField } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { HubspotService } from '../../../../services/hubspot';
import sCorpImage from '../../../../icons/s-corp.png';
import { useContactId } from '../../../../hooks';
import { DOWNLOAD_PDF } from '../constant';

const useStyles = makeStyles((theme) => ({
  sCorpContainer: {
    background: theme.palette.secondary.lighter,
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
    padding: '0 16px',
  },
  container: {
    maxWidth: '1155px',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
  },
  reportContainer: {
    background: theme.palette.white.main,
    zIndex: 1,
    padding: theme.spacing(0, 2),
    display: 'flex',
  },
  reportTitle: theme.typography.body5,
  reportDesc: {
    fontSize: '14px',
    fontWeight: '400',
    color: theme.palette.graylight.main,
    marginTop: theme.spacing(3),
    lineHeight: '20px',
  },
  descContainer: {
    width: '260px',
  },
  fieldContainer: {
    margin: theme.spacing(0, 3),
    padding: theme.spacing(0, 4),
    borderLeft: `1px solid ${theme.palette.secondary.lighter}`,
    width: '30%',
  },
  field: {
    marginTop: '24px',
  },
}));

type TContactDetails = {
  name?: string;
  email?: string;
};

type TError = {
  name?: boolean;
  email?: boolean;
};

type TProps = {
  results: object
}

export const Scorp = ({ results }: TProps) => {
  const classes = useStyles();
  const { saveContactId } = useContactId();
  const [error, setError] = useState<TError>({});
  const [contactDetails, setContactDetails] = useState<TContactDetails>({});
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, id } = e.target;
    setError({ ...error, [id]: false });
    setContactDetails({ ...contactDetails, [id]: value });
  };
  const validate = () => {
    const { name, email } = contactDetails;
    const detailsError = {name: false, email: false};
    if (!name) detailsError.name = true;
    if (!email) detailsError.email = true;
    setError(detailsError);
    return !Object.keys(detailsError).length;
  };
  const onDownload = () => {
    if (!validate()) return;
    HubspotService
      .upsertContactProperties({
        email: contactDetails.email,
        firstName: contactDetails.name,
        results,
      })
      .then((data) => {
        const { contactId } = data;
        saveContactId(contactId);
      })
      .catch((err) => console.error(err));
    window.open(DOWNLOAD_PDF);
  };

  return (
    <div className={classes.sCorpContainer}>
      <div className={classes.container}>
        <div className={classes.reportContainer}>
          <img src={sCorpImage} alt="s-corp" style={{ marginRight: '24px' }} />
          <div className={classes.descContainer}>
            <div className={classes.reportTitle}>Become An S-Corp</div>
            <div className={classes.reportDesc}>
              There’s no better tax structure for self-employed businesses than an
              S-Corp. As an S-Corp, you can enjoy all the benefits of a
              corporation without losing your independence as a self-employed
              business. You will also be able to pay yourself a salary and reduce
              your taxes. And unlike C-Corps, you will not have to pay corporate
              tax.
            </div>
          </div>
          <div className={classes.fieldContainer}>
            <div className={classes.reportTitle}>Download S-Corp Report</div>
            <TextField
              error={error.name}
              id="name"
              label="Your Name"
              helperText={error.name ? 'Name is Required' : ''}
              variant="outlined"
              required
              fullWidth
              onChange={onChange}
              className={classes.field}
            />
            <TextField
              error={error.email}
              id="email"
              label="Your Email Address"
              helperText={error.email ? 'Email is Required' : ''}
              variant="outlined"
              required
              fullWidth
              onChange={onChange}
              className={classes.field}
            />
            <Button
              type="button"
              size="large"
              variant="outlined"
              color="secondary"
              style={{ marginTop: '24px' }}
              onClick={onDownload}
            >
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
