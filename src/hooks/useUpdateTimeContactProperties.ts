import { useMutation } from 'react-query';

import {
  updateTimeContactProperties,
  TimestampAccountType,
} from '../services/hubspot';

function useUpdateTimeContactProperties() {
  return useMutation(
    async ({
      contactId,
      property,
    }: {
      contactId: string;
      property: TimestampAccountType;
    }) => {
      const response = await updateTimeContactProperties(property, contactId);
      return response.statusText;
    },
  );
}

export default useUpdateTimeContactProperties;
