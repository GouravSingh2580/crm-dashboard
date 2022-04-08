import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Select, FormControl, InputLabel, MenuItem } from '@mui/material';
import { DocumentEmail } from 'services/documentTypes';

interface IEmailTemplateSelectorProp {
  value: string;
  emailTemplateOptions: DocumentEmail[];
  handleChange: (value: string) => void;
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1, 0),
    minHeight: '4.5rem',
  },
}));

export const EmailTemplateSelector: React.FC<IEmailTemplateSelectorProp> = ({
  value,
  emailTemplateOptions,
  handleChange,
}) => {
  const classes = useStyles();

  return (
    <FormControl variant="outlined" fullWidth className={classes.formControl}>
      <InputLabel>Select Email to Send to Customer</InputLabel>
      <Select
        value={value || ''}
        onChange={({ target: { value: v } }) => handleChange(v)}
        label="Select Email to Send to Customer"
      >
        {emailTemplateOptions &&
          emailTemplateOptions.map((option) => (
            <MenuItem value={option.id} key={option.id}>{option.name}</MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};
