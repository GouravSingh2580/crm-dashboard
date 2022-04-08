import { Grid, Typography, Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme: any) => ({
  title: {
    fontWeight: 700,
    lineHeight: '32px',
    letterSpacing: '0.15px',
  },
  secondaryButton: {
    color: theme.palette.black.lighter,
  },
}));

export const Title = ({
  text,
  isEdit,
  onSave,
  onCancel,
  onEdit,
  isSubmitting,
}: {
  text: string;
  isEdit?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  onEdit?: () => void;
  isSubmitting?: boolean;
}) => {
  const classes = useStyles();
  return (
    <Grid container justifyContent="space-between" alignItems="baseline">
      <Grid item>
        <Typography variant="body1" className={classes.title} component="span">
          {text}
        </Typography>
      </Grid>
      {isEdit !== undefined && (
        <Grid item>
          {!isEdit ? (
            <Button className={classes.secondaryButton} onClick={onEdit}>
              Edit
            </Button>
          ) : (
            <>
              <Button
                color="secondary"
                onClick={onSave}
                disabled={isSubmitting}
              >
                Submit
              </Button>
              <Button className={classes.secondaryButton} onClick={onCancel}>
                Cancel
              </Button>
            </>
          )}
        </Grid>
      )}
    </Grid>
  );
};
