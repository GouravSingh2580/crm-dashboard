import service, {
  usePlacesAutocompleteServiceConfig,
  usePlacesAutocompleteServiceResponse,
} from 'react-google-autocomplete/lib/usePlacesAutocompleteService';

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}

export interface StructuredFormatting {
  // eslint-disable-next-line camelcase
  main_text: string;
  // eslint-disable-next-line camelcase
  secondary_text: string;
  // eslint-disable-next-line camelcase
  main_text_matched_substrings: readonly MainTextMatchedSubstrings[];
}

export interface Place {
  // eslint-disable-next-line camelcase
  place_id: string;
  reference: string;
  description: string;
  // eslint-disable-next-line camelcase
  structured_formatting: StructuredFormatting;
}

export interface AddressComponent {
  // eslint-disable-next-line camelcase
  long_name: string;
  // eslint-disable-next-line camelcase
  short_name: string;
  types: string[];
}

export interface PlaceDetails {
  // eslint-disable-next-line camelcase
  address_components: AddressComponent[];
}

export interface USAddressData {
  streetNumber?: string;
  street?: string;
  address1?: string;
  city?: string;
  state?: string;
  stateCode?: string;
  zip?: string;
}

export interface PlacesService {
  getPlaceDetails: (place: Place, fields: string[]) => Promise<PlaceDetails>;
  placePredictions: usePlacesAutocompleteServiceResponse['placePredictions'];
  getPlacePredictions: usePlacesAutocompleteServiceResponse['getPlacePredictions'];
}

function getPlaceDetails(autocomplete: usePlacesAutocompleteServiceResponse) {
  return (place: Place, fields: string[]): Promise<PlaceDetails> => new Promise(
    (resolve, reject) => {
      const req = {
        placeId: place.place_id,
        fields,
      };
      try {
        autocomplete.placesService.getDetails(req, resolve);
      } catch (err) {
        reject(err);
      }
    },
  );
}

export const usePlacesService = (
  config: usePlacesAutocompleteServiceConfig,
): PlacesService | null => {
  if (!config.apiKey) {
    console.error('Disabled autocomplete due to missing Google API Key');
    return null;
  }

  const autocompleteService = service({
    debounce: 200,
    sessionToken: true,
    options: {
      componentRestrictions: { country: 'us' },
    },
    ...config,
  });
  return {
    getPlaceDetails: getPlaceDetails(autocompleteService),
    placePredictions: autocompleteService.placePredictions,
    getPlacePredictions: autocompleteService.getPlacePredictions,
  };
};

const pickAddressByType = (components: AddressComponent[], type: string) => components
  .filter((component) => component.types.includes(type))
  .pop();

export const extractUSAddressData = (
  addressComponents: AddressComponent[],
): USAddressData => {
  const streetNumber = pickAddressByType(addressComponents, 'street_number');
  const street = pickAddressByType(addressComponents, 'route');
  const city = pickAddressByType(addressComponents, 'locality');
  const state = pickAddressByType(
    addressComponents,
    'administrative_area_level_1',
  );
  const zip = pickAddressByType(addressComponents, 'postal_code');

  const result: USAddressData = {
    streetNumber: streetNumber?.long_name,
    street: street?.long_name,
    city: city?.long_name,
    state: state?.long_name,
    stateCode: state?.short_name,
    zip: zip?.long_name,
  };

  if (result.streetNumber && result.street) {
    result.address1 = `${result.streetNumber} ${result.street}`;
  }

  return result;
};
