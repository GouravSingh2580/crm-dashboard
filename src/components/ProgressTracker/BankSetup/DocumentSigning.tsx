import { Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { sendProgressTrackerEvent } from 'helpers/heap/progressTrackerEvent';
import { ProgressTrackerStages } from 'models/account';

const useStyles = makeStyles((theme) => ({
  textSecondary: {
    color: theme.palette.text.secondary,
  },
}));

interface TParams {
  accountId: string | undefined;
  accountEntity: string;
  completedSteps: number;
  rightSignatureURL?: string;
  hasBankAccount: boolean;
}

export const DocumentSigning = ({
  accountId,
  accountEntity,
  completedSteps,
  rightSignatureURL,
  hasBankAccount,
}: TParams) => {
  const classes = useStyles();

  const getVerbiage = (): string => {
    if (completedSteps === 2) {
      return 'The documents you signed have been approved.';
    }
    if (!hasBankAccount) {
      return 'Please complete Bank Selection.';
    }
    if (rightSignatureURL) {
      return 'Your document packet is ready to sign, you are required to sign these documents and submit, for us to verify and proceed further.';
    }
    return 'Information you provided is being reviewed. We will notify you once the signature packet is available for signing.';
  };

  return (
    <div>
      <Typography component="h5" variant="h5B" data-testid="document-signing-heading">
        {completedSteps === 2
          ? 'Your document is successfully completed'
          : 'Document Signing'}
      </Typography>
      <Typography variant="body1" className={classes.textSecondary}>
        {getVerbiage()}
      </Typography>
      {completedSteps !== 2 && (
        <Button
          variant="contained"
          size="large"
          href={rightSignatureURL}
          sx={{ marginTop: '24px' }}
          disabled={!rightSignatureURL}
          data-testid="document-signing-sign-btn"
          onClick={() =>
            sendProgressTrackerEvent({
              stage: ProgressTrackerStages.DocumentSigning,
              accountId,
              entityType: accountEntity,
            })
          }
        >
          View and sign documents
        </Button>
      )}
    </div>
  );
};

DocumentSigning.defaultProps = {
  rightSignatureURL: '',
};
