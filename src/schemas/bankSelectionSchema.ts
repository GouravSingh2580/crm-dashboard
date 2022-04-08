import * as yup from 'yup';

export const bankSelectionSchema = yup.object().shape({
  bankName: yup
    .object()
    .shape({
      code: yup.string(),
      name: yup.string(),
    })
    .nullable()
    .required('Please enter a bank name.'),
});

export const bankSelectionAdminSchema = yup.object().shape({
  bankName: yup.string().required('Please select a bank name.'),
  otherOption: yup
    .string()
    .when('bankName', (val: string | undefined, schema) => (
      val === 'other'
        ? yup.string().required('Please enter other bank name.')
        : schema.notRequired())),
});
