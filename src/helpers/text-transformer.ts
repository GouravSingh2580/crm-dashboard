export function capitalizeFirstLetter(str: string) {
  if (!str) return '';

  const result = str.toLowerCase();
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function formatSsn(val: string) {
  let value = val;
  value = value.replace(/\D/g, '');
  value = value.replace(/^(\d{3})/, '$1-');
  value = value.replace(/-(\d{2})/, '-$1-');
  value = value.replace(/(\d)-(\d{4}).*/, '$1-$2');
  return value;
}

export function formatNumberWithDashes(val: string) {
  return val.replace(/-/g, '');
}

export const transformTextForKey = (text: unknown) =>
  String(text).replace(/\s+/gi, '-').toLowerCase();

export const pluralize = (
  count: number,
  singleText: string,
  pluralText: string,
) => count <= 1 ? singleText : pluralText;

export const TextTransformer = {
  /**
   * @deprecated use named export instead
   */
  capitalizeFirstLetter,
  /**
   * @deprecated use named export instead
   */
  formatSsn,
  /**
   * @deprecated use named export instead
   */
  formatNumberWithDashes,
};

export default TextTransformer;
