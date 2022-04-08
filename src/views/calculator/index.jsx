import { CalDataProvider } from '../../states';
import { Calculator } from './calculator';

/**
 *
 * TODO
 * !const contactId = GetQueryParamter('hs_cid');
 *
 * User can land on this page using 2 routes.
 * 1. From marketing page with contactId passed in queryString.
 * 2. From other link with no contactId
 *
 * If there is anything else passed other than contactId then we will be reloading the url with
 * no query params.
 * If there is contactId, will be sending to result page so that the calculator's result should
 * be added to hubspot
 */

const Index = () => (
  <CalDataProvider>
    <Calculator />
  </CalDataProvider>
);
export default Index;
