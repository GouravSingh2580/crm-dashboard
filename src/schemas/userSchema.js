import * as yup from 'yup';
import moment from 'moment';

export const userSchema = {
  first: yup.string().required('Please provide a first name'),
  middle: yup.string(),
  last: yup.string().required('Please provide a last name'),
  dob: yup
    .date()
    .transform((_value, originalValue) => {
      const parsedValue = moment(originalValue, 'M/D/YYYY', true);

      // if it's valid return the date object, otherwise return an `InvalidDate`
      return parsedValue.isValid() ? parsedValue.toDate() : new Date('');
    })
    .min(new Date('1900-01-01'), 'Invalid date of birth')
    .max(moment().subtract(18, 'y'), 'You need to be at least 18 years old')
    .typeError('Invalid date of birth'),
};

