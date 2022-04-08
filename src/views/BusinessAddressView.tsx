import { Typography } from '@mui/material';
import { ReadOnlyForm } from 'components/common/ReadOnlyForm';
import { FormationsDivider } from 'components/common';

interface IBusinessAddress {
  contactDetails: {
    mailingAddress: {
      street1: string;
      street2: string;
      city: string;
      state: string;
      zip: string;
    };
    physicalAddress: {
      street1: string;
      street2: string;
      city: string;
      state: string;
      zip: string;
    };
    workPhone?: string;
  };
}

export const BusinessAddressView = ({ contactDetails }: IBusinessAddress) => {
  const { workPhone, mailingAddress, physicalAddress } = contactDetails;
  const {
    street1: mailingAddress1,
    street2: mailingAddress2,
    city: mailingCity,
    state: mailingState,
    zip: mailingZip,
  } = mailingAddress;

  const {
    street1: physicalAddress1,
    street2: physicalAddress2,
    city: physicalCity,
    state: physicalState,
    zip: physicalZip,
  } = physicalAddress;

  return (
    <div>
      <Typography variant="h8B" component="h6" data-test-id="address-details" sx={{ marginTop: '16px' }}>
        Mailing Address
      </Typography>
      <ReadOnlyForm
        items={[{
          title: 'Street',
          value: mailingAddress1 ? `${mailingAddress1} ${mailingAddress2}` : 'N/A',
        }, {
          title: 'City',
          value: mailingCity || 'N/A',
        }, {
          title: 'State',
          value: mailingState || 'N/A',
        }, {
          title: 'Zip Code',
          value: mailingZip || 'N/A',
        }, {
          title: 'Phone Number',
          value: workPhone || 'N/A',
        }]}
      />
      <FormationsDivider />
      <Typography variant="h8B" component="h6" data-test-id="address-details">
        Physical Address
      </Typography>
      <ReadOnlyForm
        items={[{
          title: 'Street',
          value: physicalAddress1 ? `${physicalAddress1} ${physicalAddress2}` : 'N/A',
        }, {
          title: 'City',
          value: physicalCity || 'N/A',
        }, {
          title: 'State',
          value: physicalState || 'N/A',
        }, {
          title: 'Zip Code',
          value: physicalZip || 'N/A',
        }]}
      />
    </div>
  );
};
