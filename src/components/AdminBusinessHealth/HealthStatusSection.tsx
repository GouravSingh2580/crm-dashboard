import { useState, PropsWithChildren } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { IconStatusType } from 'models/insight';
import { StatusIcon } from 'views/dashboard/insight/businessHealth/StatusIcon';

const useStyles = makeStyles((theme) => ({
  container: {
    '& .MuiAccordion-root': {
      margin: 0,
      padding: '10px 20px',
    },
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
}));

interface Props {
  status: IconStatusType;
  title: string;
}

export const HealthStatusSection = (props: PropsWithChildren<Props>) => {
  const classes = useStyles();
  const { status, title, children } = props;
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const toggleExpandStatus = () => setIsExpanded(!isExpanded);

  return (
    <div className={classes.container}>
      <Accordion expanded={isExpanded} onChange={toggleExpandStatus}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="account-verification-content"
        >
          <div className={classes.titleContainer}>
            <StatusIcon status={status} size={24} />
            <Typography variant="body1B">{title}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
};
