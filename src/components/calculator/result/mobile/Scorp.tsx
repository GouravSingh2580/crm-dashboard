import { ChangeEvent, useState } from 'react';
import { Button, TextField, Divider } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import sCorpImage from '../../../../icons/s-corp-mobile.png';
import { HubspotService } from '../../../../services/hubspot';
import { useContactId } from '../../../../hooks';
import { DOWNLOAD_PDF } from '../constant';

const useStyles = makeStyles((theme) => ({
  sCorpContainer: {
    padding: theme.spacing(4, 2),
  },
  reportTitle: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: theme.palette.primary.main,
    marginTop: '24px',
  },
  reportDesc: {
    fontSize: '0.875rem',
    fontWeight: '400',
    color: theme.palette.graylight.main,
    marginTop: theme.spacing(3),
    lineHeight: '20px',
  },
  field: {
    marginTop: '24px',
  },
  divider: {
    background: theme.palette.blue.light,
    margin: theme.spacing(3, 0),
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
    const detailsError = { name: false, email: false };
    if (!name) detailsError.name = true;
    if (!email) detailsError.email = true;
    setError(detailsError);
    return !Object.keys(detailsError).length;
  };
  const onDownload = () => {
    if (!validate()) return;
    HubspotService.upsertContactProperties({
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
      <div>
        <img src={sCorpImage} alt="s-corp" />
        <div>
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
        <Divider className={classes.divider} />
        <div>
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
  );
};
