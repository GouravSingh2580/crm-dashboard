import { LinearProgress, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";


const useStyles = makeStyles((theme) => ({
  linearProgressBar: {
    height: '8px',
    borderRadius: '4px',
    margin: '8px 0',
    backgroundColor: theme.palette.grey['200'],
  },
  mint: {
    '& span': {
      backgroundColor: theme.palette.others.mint,
    },
  },
  newLightBlue: {
    '& span': {
      backgroundColor: theme.palette.others.newLightBlue,
    },
  },
  newOrange: {
    '& span': {
      backgroundColor: theme.palette.others.newOrange,
    },
  },
}));

type TProps = {
  amount: number;
  helpText?: string;
  value: string;
  className: 'mint' | 'newLightBlue' | 'newOrange';
};
export const LinearProgressWithAmount = ({
  amount,
  value,
  helpText,
  className,
}: TProps) => {
  const classes = useStyles();
  const amt = parseFloat(Number(amount).toFixed(2));
  return (
    <div>
      <Typography variant="body2B">{`$${amt < 0 ? 0 : amt}`}</Typography>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress
          className={`${classes.linearProgressBar} ${classes[className]}`}
          variant="determinate"
          value={parseFloat(value)}
        />
      </Box>
      {helpText && (
        <Typography variant="helperText" color="text.secondary">
          {helpText}
        </Typography>
      )}
    </div>
  );
}