import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { LinearProgressWithAmount } from 'components/common/LinearProgressWithAmount';
import { getPrettyDateTime } from 'helpers/dateTimeFormat';
import { useCurrentAccount } from 'hooks/api';

export const CustomerTaxLiability = () => {
  const {
    currentAccount = {
      taxes: {
        updatedAt: null,
        annualEstimated: 0,
        ytdTotalPaid: 0,
      },
    },
  } = useCurrentAccount();

  const { taxes } = currentAccount;

  const getPercent = (partialValue: number | undefined, totalValue: number) => {
    if (!partialValue) {
      return 0;
    }
    if (partialValue > totalValue) {
      return 100;
    }
    return Number((100 * partialValue) / totalValue).toFixed(2);
  };

  return (
    <section>
      <Typography
        variant="body1"
        sx={{
          mt: 2,
          mb: 3,
        }}
      >
        Personal Tax Liability
      </Typography>
      {taxes && (
        <>
          <Box sx={{ mb: 3 }}>
            <LinearProgressWithAmount
              helpText={`Estimated Annual Tax Liability — last update: ${
                taxes?.updatedAt &&
                getPrettyDateTime(taxes?.updatedAt, 'MMM D, YYYY')
              }`}
              value={100}
              amount={taxes?.annualEstimated}
              className="mint"
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <LinearProgressWithAmount
              helpText="Total Taxes Paid YTD"
              value={getPercent(taxes.ytdTotalPaid, taxes.annualEstimated)}
              amount={taxes.ytdTotalPaid || 0}
              className="newLightBlue"
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <LinearProgressWithAmount
              helpText="Outstanding Tax Balance YTD"
              value={getPercent(
                taxes.annualEstimated - (taxes.ytdTotalPaid || 0),
                taxes.annualEstimated,
              )}
              amount={taxes.annualEstimated - (taxes.ytdTotalPaid || 0)}
              className="newOrange"
            />
          </Box>
        </>
      )}
    </section>
  );
};
