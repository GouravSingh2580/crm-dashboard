import { Radio, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FormationsIcon } from 'components/common/FormationsIcon';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-block',
    padding: theme.spacing(3),
    border: '1px solid rgba(13, 34, 89, 0.23)',
    borderRadius: '8px',
    transition: 'border 0.3s linear',
    height: '100%',
    width: '100%',
    boxSizing: 'border-box'
  },
  label: {
    marginBottom: theme.spacing(4),
  },
  active: {
    border: '8px solid #70CE73',
  },
  secondary: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    '& > svg': {
      marginRight: theme.spacing(3),
      minWidth: '72px',
    },
  },
  [theme.breakpoints.up('md')]: {
    secondary: {
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 0,
      '& > svg': {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(4),
      },
    },
    secondaryLabel: {
      marginBottom: theme.spacing(4),
    },
  },
}));

type TEntityOption = {
  icon: string;
  label: string;
  secondaryLabel?: string;
  secondaryText: string;
  value: string;
};

type TEntitySelectionRadio = TEntityOption & {
  onChange: (value: string) => void;
  selectedValue: string;
  isDesktop: boolean;
};

export const EntitySelectionRadio = ({
  icon,
  label,
  secondaryLabel = '',
  secondaryText,
  value,
  onChange,
  selectedValue,
  isDesktop,
}: TEntitySelectionRadio) => {
  const classes = useStyles();
  return (
    <label
      htmlFor={value}
      className={`${classes.root} ${
        selectedValue === value ? classes.active : ''
      }`}
    >
      <Radio
        checked={selectedValue === value}
        onChange={(e) => onChange(e.target?.value)}
        value={value}
        name="radio-buttons"
        id={value}
        data-test-id={value}
      />
      <Typography
        component="span"
        variant={isDesktop ? 'body1B' : 'body2B'}
        color="primary"
        className={classes.label}
      >
        {label}
      </Typography>
      <div className={classes.secondary}>
        <FormationsIcon name={icon} />
        <div>
          {secondaryLabel && (
            <Typography
              variant={isDesktop ? 'subtitle1' : 'body2B'}
              color="primary"
              className={classes.secondaryLabel}
            >
              {secondaryLabel}
            </Typography>
          )}
          <Typography
            variant={isDesktop ? 'subtitle1' : 'body2'}
            color="primary"
          >
            {secondaryText}
          </Typography>
        </div>
      </div>
    </label>
  );
};

