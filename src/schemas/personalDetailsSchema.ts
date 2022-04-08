import * as yup from 'yup';
import moment from 'moment';

export const PersonalDetailsSchema = yup.object().shape({
  first: yup
    .string()
    .matches(/^\D*$/, 'Please enter a valid first name.')
    .required('Please enter a first name.'),
  middle: yup.lazy(value => !value ? yup.string() : yup.string()
  .matches(/^\D*$/, 'Please enter a valid middle name.')),
  last: yup
    .string()
    .matches(/^\D*$/, 'Please enter a valid last name.')
    .required('Please enter a last name.'),
  dob: yup
    .date()
    .transform((_value, originalValue) => {
      const parsedValue = moment(originalValue, 'M/D/YYYY', true);

      // if it's valid return the date object, otherwise return an `InvalidDate`
      return parsedValue.isValid() ? parsedValue.toDate() : new Date('');
    })
    .min(new Date('1900-01-01'), 'Please enter a valid date of birth.')
    .max(moment().subtract(18, 'y'), 'You need to be at least 18 years old.')
    .typeError('Please enter a date of birth in MM/DD/YYYY.'),
  ssn: yup.string().when('$isSSNRequired', (isSSNRequired: boolean) =>
    isSSNRequired
      ? yup
          .string()
          .test('ssn', 'Please enter a valid SSN.', (val) => {
            if (!val) return true;
            // SSN regex - https://github.com/go-playground/validator/blob/master/regexes.go#L38
            return /^[\d]{3}[ -]?(0[1-9]|[1-9][\d])[ -]?([1-9][\d]{3}|[\d][1-9][\d]{2}|[\d]{2}[1-9][\d]|[\d]{3}[1-9])$/.test(val);
          })
          .required('Please enter a SSN.')
      : yup.string().notRequired(),
  ),
});
