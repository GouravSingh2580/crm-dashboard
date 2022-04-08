export const generateXeroUrl = (clientId: string, accountId: string): string => {
  const redirectUri = `${window.location.origin}/dashboard/welcome`;
  return `https://login.xero.com/identity/connect/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid profile email offline_access accounting.transactions accounting.reports.read&state=${accountId}`;
};
