import * as yup from 'yup';
import moment from 'moment';

const validateCompanyNames = (val: string[] | undefined) => {
  if (!val || val.length === 0) return true;
  // company name shouldn't start with 0
  return !val.some((name: string) => /^0/.test(name.trim()));
};

const checkDuplicates = (val: string[] | undefined) => {
  const arr = val && val.filter(Boolean);
  if (!arr || arr.length < 2) return true;

  const hasDuplicates = new Set(arr.map(i => i.trim())).size !== arr.length;
  return !hasDuplicates;
};

const validateSuggested = (val: string[] | undefined) => {
  if (!val || val.length < 3) return false;
  return val.filter((item) => !!item).length >= 3;
};

export const BUSINESS_DESCRIPTION_LIMIT = 800;

const companyDetailsStep1Schema = {
  name: yup
    .string()
    .when('$isSoleProp', (isSoleProp: boolean, schema) =>
      isSoleProp
        ? schema.notRequired()
        : yup.string().required('Please enter a company name.'),
    ),
  suggested: yup
    .string()
    .when('$isSoleProp', (isSoleProp: boolean, schema) =>
      isSoleProp
        ? yup
            .array()
            .test(
              'invalidCompanyName',
              "Names starting with '0' are not accepted by the IRS. Please choose a different name.",
              validateCompanyNames,
            )
            .test(
              'suggested',
              'Three company name options are required.',
              validateSuggested,
            )
            .test(
              'suggestedDuplicates',
              'Company name options cannot be duplicates.',
              checkDuplicates,
            )
        : schema.notRequired(),
    ),
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
  ein: yup
    .string()
    .when("hasEinNo", {
      is: false,
      then: yup.string().required("Please enter a EIN.")
  })
    .matches(/^$|^(\d{9})$/, 'Please enter a valid EIN.'), // empty or has length 9
    receivedEinNo: yup.bool()
};

const companyDetailsStep2Schema = {
  stateOfIncorporation: yup.mixed().required('Please enter a state of incorporation.'),
  industry: yup.mixed().required('Please enter a business industry.'),
  description: yup
    .string()
    .required('Please enter business description.')
    .max(
      BUSINESS_DESCRIPTION_LIMIT,
      `Please use less than ${BUSINESS_DESCRIPTION_LIMIT} characters`,
    ),
};

export const companyDetailsCustomerStep1 = yup
  .object()
  .shape(companyDetailsStep1Schema);

export const companyDetailsCustomerStep2 = yup
  .object()
  .shape(companyDetailsStep2Schema);

export const adminCompanyDetailSchema = yup.object().shape({
  ...companyDetailsStep2Schema,
  ...companyDetailsStep1Schema,
});
