export const switchFn = (
  lookupObject:
    { [key: string]: string | number },
  defaultCase = '_default',
) => (expression: string) => (lookupObject[expression] || lookupObject[defaultCase]);
