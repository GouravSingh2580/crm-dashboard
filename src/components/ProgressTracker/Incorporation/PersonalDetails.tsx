import { makeStyles } from '@mui/styles';
import { Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import queryClient from 'states/reactQueryClient';
import { TextTransformer } from 'helpers';
import { useState } from 'react';
import moment from 'moment';
import { ReadOnlyForm } from 'components/common/ReadOnlyForm';
import { PersonalDetailsSchema } from 'schemas/personalDetailsSchema';
import {
  useCurrentUser,
  useUpdateUser,
  useUpdateUserIdentity,
  useUserIdentityById,
} from 'hooks/api';
import {
  FormationsForm,
  FormationsFormFields,
} from 'components/common/FormationsForm';
import { UIDateFormat } from 'helpers/dateTimeFormat';

const formFields = [
  {
    type: FormationsFormFields.Text,
    name: 'first',
    placeholder: 'Mary',
    autoCapitalize: true,
    label: 'First Name',
    autoFocus: true,
    maxLength: 25
  },
  {
    type: FormationsFormFields.Text,
    name: 'middle',
    placeholder: 'D.',
    autoCapitalize: true,
    label: 'Middle Name',
    maxLength: 25
  },
  {
    type: FormationsFormFields.Text,
    name: 'last',
    placeholder: 'Wang',
    autoCapitalize: true,
    label: 'Last Name',
    maxLength: 25
  },
  {
    type: FormationsFormFields.Date,
    name: 'dob',
    placeholder: 'MM/DD/YYYY',
    label: 'Date of Birth',
  },
  {
    type: FormationsFormFields.SecuredText,
    name: 'ssn',
    placeholder: '',
    label: 'Social Security Number',
    readOnly: false,
    maxLength: 11,
    helperText:
      'The government requires your SSN to incorporate your business (and later, to file your taxes). We use high encryption for added security.',
  },
];

const useStyles = makeStyles((theme) => ({
  textSecondary: {
    color: theme.palette.text.secondary,
  },
}));

interface TParams {
  handleComplete: () => void;
  stageCompleted: boolean;
}

export const PersonalDetails = ({
  handleComplete,
  stageCompleted,
}: TParams) => {
  const classes = useStyles();

  const [submitting, setSubmitting] = useState(false);

  const { currentUser: user } = useCurrentUser();
  const { userIdentity } = useUserIdentityById(user?.id || '', {
    enabled: !!user?.id,
  });

  const { updateUserAsync: updateUser } = useUpdateUser({
    onSuccess: () => {
      queryClient.invalidateQueries(['currentUser']);
    },
  });
  const { updateUserIdentityAsync: updateSSN } = useUpdateUserIdentity({
    onSuccess: () => {
      queryClient.invalidateQueries(['user', 'identity', user?.id]);
    },
  });

  const onFormSubmit = async (formData: {
    dob: string;
    first: string;
    middle: string;
    last: string;
    ssn: string;
  }) => {
    setSubmitting(true);
    const data = {
      name: {
        first: formData.first,
        middle: formData.middle,
        last: formData.last,
      },
      dob: UIDateFormat(formData.dob),
    };
    await updateUser({ data });
    if (formData.ssn && user && !userIdentity?.ssn.last4) {
      await updateSSN({
        id: user.id,
        ssn: TextTransformer.formatSsn(formData.ssn),
      });
    }
    handleComplete();
  };

  return (
    <div>
      <Typography variant="h5B" component="h5" data-test-id="personal-details">
        Personal Details
      </Typography>
      {stageCompleted ? (
        <ReadOnlyForm
          items={[
            {
              title: 'First Name',
              value: user?.name?.first,
            },
            {
              title: 'Middle Name',
              value: user?.name?.middle,
            },
            {
              title: 'Last Name',
              value: user?.name?.last,
            },
            {
              title: 'Date of Birth',
              value: user?.dob,
            },
            {
              title: 'Social Security Number',
              value: userIdentity?.ssn?.last4
                ? `*****${userIdentity?.ssn?.last4}`
                : '',
            },
          ]}
        />
      ) : (
        <>
          <Typography variant="body1" className={classes.textSecondary}>
            Let&apos;s get to know you better!
          </Typography>
          <FormationsForm
            onSubmit={onFormSubmit}
            fieldsMap={formFields.map((field) => {
              const newField = { ...field };
              if (
                field.type === FormationsFormFields.SecuredText &&
                userIdentity?.ssn.last4
              ) {
                newField.readOnly = true;
              }
              return newField;
            })}
            defaultValues={{
              first: user?.name?.first,
              middle: user?.name?.middle,
              last: user?.name?.last,
              dob: user?.dob ? moment(user.dob, 'M/D/YYYY', true) : null,
              ssn: userIdentity?.ssn.last4
                ? `*****${userIdentity.ssn.last4}`
                : '',
              mode: 'onSubmit',
              reValidateMode: 'onChange',
            }}
            validationSchema={PersonalDetailsSchema}
            renderFormControls={() => (
              <LoadingButton
                type="submit"
                variant="outlined"
                size="large"
                data-testid="save-personal-details"
                loading={submitting}
                loadingPosition="end"
                endIcon={<SaveIcon />}
              >
                Save and Continue
              </LoadingButton>
            )}
            showLoader={false}
            formContext={{
              isSSNRequired: !userIdentity?.ssn?.last4,
            }}
          />
        </>
      )}
    </div>
  );
};
