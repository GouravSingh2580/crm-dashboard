import * as yup from 'yup';
import moment from 'moment';

const validate = (val) => {
  if (!val) return true;

  let formattedValue;

  try {
    formattedValue = val.replace(/-/g, '');
  } catch (e) {
    return false;
  }

  return formattedValue.length === 9;
};

export const existingCompanySchema = {
  name: yup.string().required('Please provide a company name'),
  incorporationDate: yup
    .date()
    .transform((_value, originalValue) => {
      const parsedValue = moment(originalValue, 'M/D/YYYY', true);
      // if it's valid return the date object, otherwise return an `InvalidDate`
      return parsedValue.isValid() ? parsedValue.toDate() : new Date('');
    })
    .min(new Date('1900-01-01'), 'Invalid date of incorporation')
    .max(new Date(), 'Invalid date of incorporation')
    .typeError('Invalid date of incorporation')
    .required('Please provide date of incorporation'),
  ein: yup
    .string()
    .trim()
    .test('ein', 'Please use 9 digits', validate)
    .required('Please provide a EIN number'),
  ssn: yup
    .string()
    .test('ssn', 'Please use 9 digits', validate)
    .required('Please provide a ssn'),
  physicalState: yup.string().required('Please provide a state'),
};

