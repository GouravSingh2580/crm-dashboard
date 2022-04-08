// eslint-disable-next-line import/prefer-default-export
export const CONSTANTS = {
  TERM_AND_CONDITION_VERSION: '2021-09-06', // YYYY-MM-DD
  USER_ROLES: {
    ADMIN: 'Admin',
    CUSTOMER: 'Customer',
    FULFILLMENT: 'Fulfillment',
    SUPER_ADMIN: 'SuperAdmin',
    SUCCESS: 'Success',
    CUSTOMER_SERVICE: 'CustomerService',
  },
  DEFAULT_DATE_TIME_FORMAT: 'DD-MM-YYYY HH:mm:ss',
};

export const ENTITY_MAPPING = {
  'sole_prop': 'Sole-Prop',
  's_corp': 'S-CORP',
  'c_corp': 'C-CORP',
  'llc': 'LLC'
}

export const ENTITY_OPTIONS = [
  {
    id: ENTITY_MAPPING.sole_prop,
    name: 'Sole Proprietorship',
    value: 'sole_prop',
    desc: 'Unincorporated business owned and run by one individual.',
  },
  {
    id: ENTITY_MAPPING.llc,
    name: 'LLC',
    value: 'llc',
    desc: "Business structure whereby the owners are not personally liable for the company's debts or liabilities.",
  },
  {
    id: ENTITY_MAPPING.s_corp,
    name: 'S-Corp',
    value: 's_corp',
    desc: 'An Entity that elects to pass corporate income, losses, deductions, and credits through to its shareholders for federal tax purposes.',
  },
  {
    id: ENTITY_MAPPING.c_corp,
    name: 'C-Corp',
    value: 'c_corp',
    desc: 'A C-Corporation is a legal business entity taxed as a corporation. The owners, or shareholders, are taxed separately from the entity.',
  },
];
