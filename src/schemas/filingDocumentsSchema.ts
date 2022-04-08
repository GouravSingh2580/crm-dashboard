import * as yup from 'yup';
import moment from 'moment';

export const BUSINESS_DESCRIPTION_LIMIT = 250;

export const filingDocumentsSchema = yup.object().shape({
  name: yup.string().required('Please enter a company name.'),
  ein: yup
    .string()
    .required('Please enter a EIN')
    .matches(/^$|^(\d{9})$/, 'Please enter a valid EIN.'),
  incorporationDate: yup
    .date()
    .when('$isSoleProp', (isSoleProp: boolean, schema) =>
      isSoleProp
        ? schema.notRequired()
        : yup
            .date()
            .transform((_value, originalValue) => {
              const parsedValue = moment(originalValue, 'M/D/YYYY', true);

              // if it's valid return the date object, otherwise return an `InvalidDate`
              return parsedValue.isValid()
                ? parsedValue.toDate()
                : new Date('');
            })
            .max(new Date(), 'Future date is not allowed.')
            .typeError('Please enter a date of incorporation in MM/DD/YYYY.'),
    ),
});
