import nock from 'nock';
import { CONFIG } from 'config';

export const bookkeepingApiMock = nock(CONFIG.apiBookkeepingUrl);

export const sampleBankAccountsForTable = [{
  bankId: '95b7ffba-337c-11ec-97db-acde48001122',
  name: 'Test Bank',
  errorMsg: '',
  accounts: [{
    id: 'EbM8pmlkGbUPwb95A8gafK9VK563RkcXvJpBJ', accountId: '61268a98f3bb3878775c469f', connectionId: '95b7ffba-337c-11ec-97db-acde48001122', name: 'Plaid 401k', officialName: null, balance: 0, currency: 'USD', type: 'investment', subtype: '401k', isConnected: false, connectionName: 'Chase',
  }, {
    id: 'pZoqyKkWNZHxBGjzArJ8uQd9QL1PMGCLy3AvB', accountId: '61268a98f3bb3878775c469f', connectionId: '95b7ffba-337c-11ec-97db-acde48001122', name: 'Plaid CD', officialName: 'Plaid Bronze Standard 0.2% Interest CD', balance: 0, currency: 'USD', type: 'depository', subtype: 'cd', isConnected: false, connectionName: 'Chase',
  }, {
    id: '15XzqN79d5uDjr9qLwgziDe1DgqbJ4c5LlAzW', accountId: '61268a98f3bb3878775c469f', connectionId: '95b7ffba-337c-11ec-97db-acde48001122', name: 'Plaid Checking', officialName: 'Plaid Gold Standard 0% Interest Checking', balance: 0, currency: 'USD', type: 'depository', subtype: 'checking', isConnected: false, connectionName: 'Chase',
  }, {
    id: 'oQplGqdw4Qt3AjermK58s4pJ4ZaRe3uRx8WZE', accountId: '61268a98f3bb3878775c469f', connectionId: '95b7ffba-337c-11ec-97db-acde48001122', name: 'Plaid Credit Card', officialName: 'Plaid Diamond 12.5% APR Interest Credit Card', balance: 0, currency: 'USD', type: 'credit', subtype: 'credit card', isConnected: true, connectionName: 'Chase',
  }, {
    id: '8ABNdMy9eAsXyvqd9AVNSRGlRwQ7LMcw4jkXV', accountId: '61268a98f3bb3878775c469f', connectionId: '95b7ffba-337c-11ec-97db-acde48001122', name: 'Plaid IRA', officialName: null, balance: 0, currency: 'USD', type: 'investment', subtype: 'ira', isConnected: true, connectionName: 'Chase',
  }, {
    id: 'gdjEGnlmKdI9DBZeAKqVUldElRDaxWcgaqv6w', accountId: '61268a98f3bb3878775c469f', connectionId: '95b7ffba-337c-11ec-97db-acde48001122', name: 'Plaid Money Market', officialName: 'Plaid Platinum Standard 1.85% Interest Money Market', balance: 0, currency: 'USD', type: 'depository', subtype: 'money market', isConnected: false, connectionName: 'Chase',
  }, {
    id: 'A67LZAyB86SdQy9ZJewlS1541Kqonrf1KEnpP', accountId: '61268a98f3bb3878775c469f', connectionId: '95b7ffba-337c-11ec-97db-acde48001122', name: 'Plaid Mortgage', officialName: null, balance: 0, currency: 'USD', type: 'loan', subtype: 'mortgage', isConnected: false, connectionName: 'Chase',
  }, {
    id: 'L6EmrKxqv6S1pye5BEgGIDp9DgVwQ7cPvGVxN', accountId: '61268a98f3bb3878775c469f', connectionId: '95b7ffba-337c-11ec-97db-acde48001122', name: 'Plaid Saving', officialName: 'Plaid Silver Standard 0.1% Interest Saving', balance: 0, currency: 'USD', type: 'depository', subtype: 'savings', isConnected: false, connectionName: 'Chase',
  }, {
    id: 'WV6a7jqPvVSLKBN5QWzXIpgDpN6x9nClAKJb1', accountId: '61268a98f3bb3878775c469f', connectionId: '95b7ffba-337c-11ec-97db-acde48001122', name: 'Plaid Student Loan', officialName: null, balance: 0, currency: 'USD', type: 'loan', subtype: 'student', isConnected: false, connectionName: 'Chase',
  }],
}];

export const sampleConnectionsResp = [{
  id: '95b7ffba-337c-11ec-97db-acde48001122',
  account_id: '61268a98f3bb3878775c469f',
  name: 'Chase',
  item_id: '65ra3Qy9j5u5Zex36DJaSp6q6zvPzWugwopa1',
  last_fetch_date: '2021-10-25T13:34:40.251369-07:00',
  error_msg: '',
  created_by: '612686d0032e980069c6f357',
  created_at: '2021-10-22T14:11:12.249556-07:00',
  updated_at: '2021-10-25T13:34:40.253334-07:00',
}];

export const sampleAccountResp = [
  {
    id: 'L6EmrKxqv6S1pye5BEgGIDp9DgVwQ7cPvGVxN',
    connection_id: '95b7ffba-337c-11ec-97db-acde48001122',
    name: 'Plaid Saving',
    type: 'depository',
    subtype: 'savings',
    is_connected: false,
    official_name: 'Plaid Silver Standard 0.1% Interest Saving',
    created_at: '2021-10-25T13:32:10.423049-07:00',
    updated_at: '2021-10-25T13:32:10.423049-07:00',
    account_id: '61268a98f3bb3878775c469f',
  },
  {
    id: 'pZoqyKkWNZHxBGjzArJ8uQd9QL1PMGCLy3AvB',
    connection_id: '95b7ffba-337c-11ec-97db-acde48001122',
    name: 'Plaid CD',
    type: 'depository',
    subtype: 'cd',
    is_connected: false,
    official_name: 'Plaid Bronze Standard 0.2% Interest CD',
    created_at: '2021-10-25T13:32:10.431053-07:00',
    updated_at: '2021-10-25T13:32:10.431053-07:00',
    account_id: '61268a98f3bb3878775c469f',
  },
  {
    id: 'gdjEGnlmKdI9DBZeAKqVUldElRDaxWcgaqv6w',
    connection_id: '95b7ffba-337c-11ec-97db-acde48001122',
    name: 'Plaid Money Market',
    type: 'depository',
    subtype: 'money market',
    is_connected: false,
    official_name: 'Plaid Platinum Standard 1.85% Interest Money Market',
    created_at: '2021-10-25T13:32:10.442955-07:00',
    updated_at: '2021-10-25T13:32:10.442955-07:00',
    account_id: '61268a98f3bb3878775c469f',
  },
  {
    id: '8ABNdMy9eAsXyvqd9AVNSRGlRwQ7LMcw4jkXV',
    connection_id: '95b7ffba-337c-11ec-97db-acde48001122',
    name: 'Plaid IRA',
    type: 'investment',
    subtype: 'ira',
    is_connected: false,
    official_name: null,
    created_at: '2021-10-25T13:32:10.449108-07:00',
    updated_at: '2021-10-25T13:32:10.449108-07:00',
    account_id: '61268a98f3bb3878775c469f',
  },
  {
    id: 'EbM8pmlkGbUPwb95A8gafK9VK563RkcXvJpBJ',
    connection_id: '95b7ffba-337c-11ec-97db-acde48001122',
    name: 'Plaid 401k',
    type: 'investment',
    subtype: '401k',
    is_connected: false,
    official_name: null,
    created_at: '2021-10-25T13:32:10.455363-07:00',
    updated_at: '2021-10-25T13:32:10.455363-07:00',
    account_id: '61268a98f3bb3878775c469f',
  },
  {
    id: 'WV6a7jqPvVSLKBN5QWzXIpgDpN6x9nClAKJb1',
    connection_id: '95b7ffba-337c-11ec-97db-acde48001122',
    name: 'Plaid Student Loan',
    type: 'loan',
    subtype: 'student',
    is_connected: false,
    official_name: null,
    created_at: '2021-10-25T13:32:10.462-07:00',
    updated_at: '2021-10-25T13:32:10.462-07:00',
    account_id: '61268a98f3bb3878775c469f',
  },
  {
    id: 'oQplGqdw4Qt3AjermK58s4pJ4ZaRe3uRx8WZE',
    connection_id: '95b7ffba-337c-11ec-97db-acde48001122',
    name: 'Plaid Credit Card',
    type: 'credit',
    subtype: 'credit card',
    is_connected: true,
    official_name: 'Plaid Diamond 12.5% APR Interest Credit Card',
    created_at: '2021-10-25T13:32:10.436706-07:00',
    updated_at: '2021-10-26T11:23:47.909617-07:00',
    account_id: '61268a98f3bb3878775c469f',
  },
  {
    id: '15XzqN79d5uDjr9qLwgziDe1DgqbJ4c5LlAzW',
    connection_id: '95b7ffba-337c-11ec-97db-acde48001122',
    name: 'Plaid Checking',
    type: 'depository',
    subtype: 'checking',
    is_connected: true,
    official_name: 'Plaid Gold Standard 0% Interest Checking',
    created_at: '2021-10-25T13:32:10.414527-07:00',
    updated_at: '2021-10-26T11:28:04.699777-07:00',
    account_id: '61268a98f3bb3878775c469f',
  },
  {
    id: 'A67LZAyB86SdQy9ZJewlS1541Kqonrf1KEnpP',
    connection_id: '95b7ffba-337c-11ec-97db-acde48001122',
    name: 'Plaid Mortgage',
    type: 'loan',
    subtype: 'mortgage',
    is_connected: false,
    official_name: null,
    created_at: '2021-10-25T13:32:10.467826-07:00',
    updated_at: '2021-10-26T11:28:06.008286-07:00',
    account_id: '61268a98f3bb3878775c469f',
  },
];
