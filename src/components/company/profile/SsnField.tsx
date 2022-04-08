import { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { showErrorToast } from 'components/toast/showToast';

import { useUpdateUserIdentity, useUserIdentityById } from 'hooks/api';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  TextField,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import * as yup from 'yup';

import queryClient from 'states/reactQueryClient';
import InputMask from 'react-input-mask';
import makeStyles from '@mui/styles/makeStyles';
import { formatSsn } from 'helpers/text-transformer';

function validateSsn(val: string | undefined) {
  if (!val) return true;

  const isValid = /^\d{3}-\d{2}-\d{4}$/.test(val) || /^\d{9}$/.test(val);

  return !!isValid;
}

const validationSchema = yup.object().shape({
  ssn: yup
    .string()
    .test('workPhone', 'Please use 9 digits', validateSsn)
    .required('Please provide a ssn'),
});

const useStyles = makeStyles((theme) => ({
  listItem: {
    display: 'flex',
    paddingRight: theme.spacing(15),
    minHeight: theme.spacing(10),
  },
  listItemLabel: {
    fontWeight: 'bold',
    margin: theme.spacing(1, 0),
  },
  listItemValue: {
    margin: theme.spacing(1, 0),
  },
  listItemText: {},
  listItemLinkValue: {
    color: '#2196F3',
    margin: theme.spacing(1, 0),
  },
  textField: {},
}));

export const SsnField = () => {
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  const [ssn, setSsn] = useState({ value: '', show: false });
  const [isEdit, setIsEdit] = useState(false);
  const [originalValue, setOriginalValue] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [validationError, setValidationError] = useState([]);

  const handleEdit = async (shouldEdit: boolean) => {
    if (!shouldEdit) {
      setSsn({ show: true, value: originalValue });
    }
    setIsEdit(shouldEdit);
  };

  const { userIdentity } = useUserIdentityById(id, {
    enabled: ssn.show,
    onError: (accessError) => {
      setSsn({ show: false, value: '' });
      showErrorToast(`${accessError}`);
    },
  });

  useEffect(()=>{
    if(userIdentity){
      const { ssn: ssnNumber } = userIdentity ?? {};
      const { first5, last4 } = ssnNumber ?? {};
      const fullSsn = first5 ? first5 + last4 : 'Not Exist';
      setOriginalValue(fullSsn);
      setSsn({ ...ssn, value: fullSsn });
    }
  }, [userIdentity])

  const { updateUserIdentity: updateSsn, isLoading: isUpdating } =
    useUpdateUserIdentity({
      onSuccess: () => {
        queryClient.invalidateQueries(['user', 'identity', id]);
        handleEdit(false);
      },
      onError: (updateError) => {
        setError(updateError as Error);
      },
    });

  const label = 'SSN';
  const getShowValue = () => {
    if (ssn.show) {
      if (ssn.value === 'Loading...') {
        return ssn.value;
      }
      return formatSsn(ssn.value);
    }
    return '***-**-****';
  };
  const showValue = getShowValue();

  const getSsn = () => {
    setSsn({ show: true, value: 'Loading...' });
  };

  const handleSsn = async () => {
    setSsn((state) => ({ show: !state.show, value: state.value }));

    if (!ssn.show && !ssn.value) {
      getSsn();
    }
  };

  const handleSsnChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    let newValue = value;

    if (value) {
      newValue = value.replace(/[-_]/g, '');
    }

    const isOnlyDigits = /^\d*$/.test(newValue);

    if (isOnlyDigits) {
      validationSchema
        .validate({ ssn: newValue })
        .then(() => {
          setValidationError([]);
        })
        .catch((err) => {
          setValidationError(err.errors);
        });
      setSsn({ value: newValue, show: true });
    }
  };

  const handleUpdateSsn = () => {
    const ssnFull = formatSsn(ssn.value);
    updateSsn({ ssn: ssnFull, id });
  };

  const updateIcon = isUpdating ? (
    <CircularProgress size={20} />
  ) : (
    <CheckIcon />
  );

  const EditView = () => (
    <ListItem className={classes.listItem} key={label} divider>
      <div className={classes.listItemText}>
        <InputMask
          mask="999-99-9999"
          value={ssn.value}
          onChange={handleSsnChange}
        >
          {() => (
            <TextField
              className={classes.textField}
              variant="outlined"
              margin="normal"
              fullWidth
              required
              label="SSN"
              name="ssn"
              error={validationError.length > 0}
              helperText={
                validationError.length > 0 ? validationError[0] : null
              }
            />
          )}
        </InputMask>
      </div>

      <ListItemSecondaryAction>
        {ssn.show ? (
          <>
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={handleUpdateSsn}
              disabled={validationError.length > 0}
              size="large"
            >
              {updateIcon}
            </IconButton>
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={() => handleEdit(false)}
              size="large"
            >
              <CloseIcon />
            </IconButton>
          </>
        ) : (
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={handleSsn}
            size="large"
          >
            <VisibilityIcon />
          </IconButton>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );

  const ReadOnlyView = () => (
    <ListItem className={classes.listItem} key={label} divider>
      <div className={classes.listItemText}>
        <div className={classes.listItemLabel}>{label}</div>
        <div className={classes.listItemValue}>{showValue}</div>
      </div>

      <ListItemSecondaryAction>
        {ssn.show ? (
          <>
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={handleSsn}
              size="large"
            >
              <VisibilityOffIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={() => handleEdit(true)}
              size="large"
            >
              <EditIcon />
            </IconButton>
          </>
        ) : (
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={handleSsn}
            size="large"
          >
            <VisibilityIcon />
          </IconButton>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );

  return (
    <>
      {isEdit ? EditView() : ReadOnlyView()}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <MuiAlert onClose={() => setError(null)} severity="error">
          {error?.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};
