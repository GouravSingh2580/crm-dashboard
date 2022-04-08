import * as React from 'react';
import { Typography, Grid, MenuItem } from '@mui/material';
import parse from 'autosuggest-highlight/parse';
import { Place } from 'services/googlePlacesAutocomplete';

type GoogleAddressOptionProps = Place;

export const GoogleAddressOption = (
  props: React.HTMLAttributes<HTMLLIElement>,
  option: GoogleAddressOptionProps,
) => {
  const {
    place_id: placeId,
    structured_formatting: {
      main_text_matched_substrings: mainTextMatchedSubstrings,
      main_text: mainText,
      secondary_text: secondaryText,
    },
  } = option;
  const matches = mainTextMatchedSubstrings;
  const parts = parse(
    mainText,
    matches.map((match) => [match.offset, match.offset + match.length]),
  );
  return (
    <MenuItem {...props} key={placeId}>
      <Grid container alignItems="center">
        <Grid item xs>
          {parts.map((part) => (
            <span
              key={part.text}
              style={{ fontWeight: part.highlight ? 700 : 400 }}
            >
              {part.text}
            </span>
          ))}
          <Typography variant="body2">{secondaryText}</Typography>
        </Grid>
      </Grid>
    </MenuItem>
  );
};
