import { Radio, RadioGroup, FormControl, FormHelperText } from '@mui/material';
import { ENTITY_OPTIONS } from 'constants/common';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import makeStyles from '@mui/styles/makeStyles';
import { Options } from './shared/Options';
import { Title } from './shared/Title';

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(2),
  },
  desc: {
    marginBottom: theme.spacing(4),
    color: theme.palette.graylight.main,
    ...theme.typography.body3,
  },
}));

type TProps = {
  control: Control;
  errors: FieldErrors;
};

export const LegalEntity = ({ control, errors }: TProps) => {
  const classes = useStyles();
  return (
    <>
      <Title title="What is your current business legal entity?" />
      <div className={classes.desc}>
        Please provide your current operating structure. If you are not yet
        incorporated please select Sole Proprietorship. If you are already a LLC
        and S-Corp, select S-Corp.
      </div>
      <div>
        <Controller
          name="legalEntity"
          control={control}
          as={
            <FormControl component="fieldset" error={!!errors.legalEntity}>
              <RadioGroup aria-label="legal-entity">
                {ENTITY_OPTIONS.map((option) => (
                  <Options
                    {...option}
                    key={option.id}
                    control={<Radio data-testid={`option-${option.value}`} />}
                  />
                ))}
              </RadioGroup>
              <FormHelperText>
                {errors.legalEntity ? errors.legalEntity.message : ''}
              </FormHelperText>
            </FormControl>
          }
        />
      </div>
    </>
  );
};
