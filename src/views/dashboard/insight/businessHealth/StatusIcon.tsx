import { Box } from '@mui/material';
import { IconStatusType } from 'models/insight';
import { SECONDARY_COLOR } from 'theme/constant';

export const StatusIcon = (props: {
  status: IconStatusType;
  size?: number;
}) => {
  const { status, size = 8 } = props;
  const colorMap = {
    red: {
      backgroundColor: '#FF3C2E',
    },
    yellow: {
      backgroundColor: '#FF9800',
    },
    green: {
      backgroundColor: SECONDARY_COLOR,
    },
  };
  return (
    <Box
      sx={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        ...colorMap[status],
      }}
    />
  );
};
