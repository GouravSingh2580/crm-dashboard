import * as yup from 'yup';

const isUrl = (val: string | undefined) => {
  if (!val) return false;
  try { return Boolean(new URL(val)); } catch (e) { return false; }
};

export const documentSigningSchema = yup.object().shape({
  rightSignatureURL: yup.string().test('rightSignatureURL', 'Please enter a valid URL.', isUrl),
});
