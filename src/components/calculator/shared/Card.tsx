import { FormEvent } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Checkbox } from '@mui/material';
import { FormationsIcon } from 'components/common/FormationsIcon';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    boxShadow:
      '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12)',
    borderRadius: '4px',
    width: '176px',
    height: '126px',
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3, 3),
    position: 'relative',
  },
  iconContainer: {
    display: 'flex',
    marginBottom: theme.spacing(3),
  },
  desc: {
    marginTop: theme.spacing(1),
    color: theme.palette.graylight.main,
    fontSize: '12px',
    textAlign: 'center',
  },
  name: {
    color: theme.palette.black.main,
    ...theme.typography.body3,
    textAlign: 'center',
  },
  centerAlign: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  checkbox: {
    position: 'absolute',
    top: '1%',
    left: '1%',
  },
}));

type TProps = {
  icon: string;
  name: string;
  desc?: string;
  isChecked: boolean;
  isDisabled: boolean;
  onChange: (e: FormEvent<HTMLInputElement>) => void;
  dataTestId: string;
};

export const Card = ({
  icon,
  name,
  desc,
  isChecked,
  isDisabled,
  onChange,
  dataTestId,
}: TProps) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.iconContainer}>
        <Checkbox
          disabled={isDisabled}
          checked={isChecked}
          onChange={onChange}
          className={classes.checkbox}
          data-testid={`option-${dataTestId}`}
        />
        <div className={classes.centerAlign}>
          <FormationsIcon name={icon} size={48} />
        </div>
      </div>
      <div>
        <div className={classes.name}>{name}</div>
        {desc && <div className={classes.desc}>{desc}</div>}
      </div>
    </div>
  );
};
