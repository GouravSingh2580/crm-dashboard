import * as yup from 'yup';

export const directDepositSchema = yup.object().shape({
  bankName: yup.string().required('Please enter a bank name.'),
  routingNumber: yup
    .string()
    .length(9, 'Routing number should be 9 digits.')
    .required('Please enter a routing number.')
    .matches(/^\d+$/, 'Routing number should be a number.'),
  bankAccountNumber: yup
    .string()
    .required('Please enter an account number.')
    .matches(/^\d+$/, 'Account number should be a number.'),
  bankAccountType: yup
    .string()
    .required('Please enter an account type.')
    .matches(/(checking|savings)/),
});

