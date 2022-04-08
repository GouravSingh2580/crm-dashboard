import { IconStatusType } from 'models/insight';
import healthAlert from 'icons/businessHealth/alert.svg';
import healthWarning from 'icons/businessHealth/warning.svg';
import healthGood from 'icons/businessHealth/green.svg';

export const HealthTypeIcon = (props: {
  status: IconStatusType;
  size?: number;
}) => {
  const { status, size = 20 } = props;
  const healthIconImage = {
    red: healthAlert,
    yellow: healthWarning,
    green: healthGood,
  };
  return (
    <img
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      src={healthIconImage[status]}
      alt="healthTypeIcon"
    />
  );
};
