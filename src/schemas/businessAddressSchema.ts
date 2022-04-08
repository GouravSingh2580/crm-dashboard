import * as yup from 'yup';

const validateMailing = (
  val: object | string | undefined,
  context: any,
): boolean | yup.ValidationError => {
  const physicalSameAsMailing = context?.options?.parent?.physicalSameAsMailing;
  return !!(!physicalSameAsMailing ? val : true);
};

const validateWorkPhone = (val: string | undefined) => {
  if (!val) {
    return false;
  }
  const pureValue = val.replace(/_|-|\(|\)|\s/g, '');
  if (!pureValue) {
    return false;
  }
  return pureValue?.length === 10;
};

export const businessAddressSchema = yup.object().shape({
  mailingAddress1: yup.string().required('Please enter an address.'),
  mailingAddress2: yup.string(),
  mailingCity: yup.string().required('Please enter a city.'),
  mailingState: yup
    .object()
    .shape({
      code: yup.string(),
      name: yup.string(),
    })
    .nullable()
    .required('Please enter a state.'),
  mailingZip: yup
    .string()
    .matches(/^\d{5}(?:-?\d{4})?$/, 'Please enter a valid ZIP code.')
    .required('Please enter a ZIP code.'),
  workPhone: yup
    .string()
    .required('Please enter a Phone Number.')
    .test('workPhone', 'Please enter a valid Phone Number.', validateWorkPhone),
  physicalSameAsMailing: yup.boolean(),
  physicalAddress1: yup
    .string()
    .test('physicalAddress1', 'Please enter an address.', validateMailing),
  physicalAddress2: yup.string(),
  physicalCity: yup
    .string()
    .test('physicalCity', 'Please enter a city.', validateMailing),
  physicalState: yup
    .object()
    .shape({
      code: yup.string(),
      name: yup.string(),
    })
    .nullable()
    .test('physicalState', 'Please enter a state.', validateMailing),
  physicalZip: yup
    .string()
    .matches(/^\d{5}(?:-?\d{4})?$/, 'Please enter a valid ZIP code.')
    .test('physicalZip', 'Please enter a ZIP code.', validateMailing)
});
