
export const ALLOWED_BANKS: {[key:string] : string} = {
  chase: 'Chase',
  bankOfAmerica: 'Bank of America',
  relay: 'Relay',
  wellFargo: 'Wells Fargo',
};

export const ALLOWED_BANKS_BACKEND: {[key:string] : string} = {
  chase: 'Chase',
  bankOfAmerica: 'Bank Of America',
  relay: 'Relay',
  wellFargo: 'Wells Fargo',
};

export const ALLOWED_BANKS_OPTIONS = Object.keys(ALLOWED_BANKS).map((key: string)=>({value:key, label: ALLOWED_BANKS[key]}))

export const getBankDisplayName = (value: string): string | undefined => Object.keys(ALLOWED_BANKS_BACKEND).find(key => ALLOWED_BANKS_BACKEND[key] === value);
