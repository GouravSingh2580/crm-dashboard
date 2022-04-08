import { useState } from 'react';
import { Paper, Skeleton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { EditableTextField } from 'components/common';
import { useCurrentUser, useUpdateUser } from 'hooks/api';
import { useCompanyByUserId, useUpdateCompany } from 'hooks/api/useCompanies';
import queryClient from 'states/reactQueryClient';
import { APIErrorResponse } from 'services/errors';
import { userSchema } from 'schemas';
import { get } from 'lodash';
import { Title } from './Title';

function validateWorkPhone(val: string | undefined) {
  if (!val) return true;

  const pureValue = val.replace(/_|-|\(|\)|\s/g, '');

  if (!pureValue) return false;

  return pureValue?.length === 10;
}

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
  },
  form: {
    paddingTop: theme.spacing(6),
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
}));

const validationSchema = yup.object().shape({
  first: userSchema.first,
  middle: userSchema.middle,
  last: userSchema.last,
  email: yup
    .string()
    .email('Invalid Email.')
    .required('Please enter an email address.'),
  workPhone: yup
    .string()
    .test('workPhone', 'Please use 10 digits', validateWorkPhone)
    .required('Please enter a phone number.'),
});

export const PersonalInfo = () => {
  const classes = useStyles();
  const [isEdit, setIsEdit] = useState(false);

  const { currentUser, status: userStatus } = useCurrentUser();
  const { company: companyData, status: companyStatus } = useCompanyByUserId();

  const { handleSubmit, control, reset, errors, setError } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(validationSchema),
  });

  const handleErrors = (data?: APIErrorResponse) => {
    if (!data) return;
    if (data.type === 'BadRequestError' && data.properties) {
      const props = data.properties;
      Object.entries(props).forEach(([, errorProperty]) => {
        setError(errorProperty.field, {
          message: errorProperty.message,
          shouldFocus: true,
        });
      });
    }
  };

  const { updateUser, isLoading: isUserUpdating } = useUpdateUser({
    onSuccess: () => queryClient.invalidateQueries('currentUser'),
    onError: (err: unknown) => {
      if (err instanceof Error) {
        handleErrors(get(err, 'response.data', err.message));
      } else {
        handleErrors(get(err, 'message', 'An error has been occurred'));
      }
      return queryClient.invalidateQueries('currentUser');
    },
  });

  const { mutateAsync: updateCompany, isLoading: isCompanyUpdating } =
    useUpdateCompany({
      onSuccess: () => queryClient.invalidateQueries(['company', 'userid']),
    });

  const onSubmit = (dataToSubmit: any) => {
    const userDataToSubmit = {
      email: dataToSubmit.email,
      name: {
        first: dataToSubmit.first,
        middle: dataToSubmit.middle,
        last: dataToSubmit.last,
      },
    };

    Promise.allSettled([
      updateUser({ data: userDataToSubmit }),
      updateCompany({
        id: companyData?.id || '',
        data: { contactDetails: { workPhone: dataToSubmit.workPhone } },
      }),
    ]).then((settledPromises) => {
      if (settledPromises.every((settled) => settled.status === 'fulfilled')) {
        setIsEdit(false);
      }
    });
  };

  const fields = [
    {
      name: 'first',
      defaultValue: currentUser?.name?.first,
      labelText: 'First Name',
    },
    {
      name: 'middle',
      defaultValue: currentUser?.name?.middle,
      labelText: 'Middle Name',
    },
    {
      name: 'last',
      defaultValue: currentUser?.name?.last,
      labelText: 'Last Name',
    },
    {
      name: 'email',
      defaultValue: currentUser?.email,
      labelText:
        'Login Email Address (Changing this may require you to reauthenticate)',
    },
    {
      name: 'workPhone',
      defaultValue: companyData?.contactDetails?.workPhone,
      labelText: 'Phone Number',
      isPhone: true,
    },
  ];

  return (
    <Paper className={classes.container}>
      <Title
        text="Personal Info"
        isEdit={isEdit}
        onEdit={() => setIsEdit(true)}
        onSave={handleSubmit(onSubmit)}
        onCancel={() => {
          setIsEdit(false);
          reset();
        }}
        isSubmitting={isUserUpdating || isCompanyUpdating}
      />
      {(userStatus === 'loading' || companyStatus === 'loading') && (
        <div className={classes.form}>
          <Skeleton height="80px" />
          <Skeleton height="80px" />
          <Skeleton height="80px" />
        </div>
      )}
      {userStatus === 'success' && companyStatus === 'success' && (
        <form className={classes.form}>
          {fields.map((field) => (
            <Controller
              key={field.name}
              name={field.name}
              defaultValue={field.defaultValue}
              control={control}
              render={({ onChange, onBlur, value, ref }, { isDirty }) => (
                <EditableTextField
                  editable={isEdit}
                  labelText={field.labelText}
                  value={value}
                  onBlur={onBlur}
                  onChange={(e) => onChange(e.target.value)}
                  inputRef={ref}
                  isDirty={isDirty}
                  error={!!errors[field.name]}
                  isPhone={field.isPhone}
                  helperText={
                    errors[field.name] ? errors[field.name].message : ''
                  }
                />
              )}
            />
          ))}
        </form>
      )}
    </Paper>
  );
};

