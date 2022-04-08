import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ENTITY_MAPPING } from 'constants/common';
import { Routes } from 'fnRoutes';
import { Link } from 'react-router-dom';
import { ReactComponent as FilingNotReadyIcon } from 'icons/filing-not-ready.svg';
import { ReactComponent as FilingReadyIcon } from 'icons/filing-ready.svg';
import { ReadOnlyForm } from 'components/common/ReadOnlyForm';
import { Company } from 'models/company';
import { FormationsDivider } from 'components/common';
import { useDocumentsQuery } from 'hooks/api';

const useStyles = makeStyles((theme) => ({
  textSecondary: {
    color: theme.palette.text.secondary,
  },
  icon: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  documents: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
}));

interface TParams {
  accountId: string;
  companyData: Company;
  completedSteps: number;
  stageCompleted: boolean;
}

export const FilingDocuments = ({
  accountId,
  companyData,
  completedSteps,
  stageCompleted,
}: TParams) => {
  const classes = useStyles();

  const { documents } = useDocumentsQuery({
    accountId,
    page: 1,
    category: 'Organizational Docs',
    subcategory: 'Miscellaneous',
  });

  if (completedSteps < 3) {
    return (
      <div>
        <Typography component="h5" variant="h5B">
          We need more info...
        </Typography>
        <Typography
          variant="body1"
          sx={{ marginTop: '16px' }}
          className={classes.textSecondary}
        >
          Please complete the previous steps, We need more info...
        </Typography>
        <Box className={classes.icon}>
          <FilingNotReadyIcon />
        </Box>
      </div>
    );
  }
  if (companyData?.entityType === ENTITY_MAPPING.llc && !companyData?.ein) {
    return (
      <div>
        <Typography component="h5" variant="h5B" data-test-id="need-your-EIN">
          We need your detail information to file documents
        </Typography>
        <Typography
          variant="body1"
          sx={{ marginTop: '16px' }}
          className={classes.textSecondary}
        >
          Please complete the Company Detail steps, We need your EIN to file documents.
        </Typography>
        <Box className={classes.icon}>
          <FilingNotReadyIcon />
        </Box>
      </div>
    );
  }
  if (!stageCompleted) {
    return (
      <div>
        <Typography
          component="h5"
          variant="h5B"
          data-test-id="got-your-information"
        >
          We got your incorporation information
        </Typography>
        <Typography
          variant="body1"
          sx={{ marginTop: '16px' }}
          className={classes.textSecondary}
        >
          We’ll let you know when we receive your official paper from the IRS
          with your EIN in the next 2-7 days. In the meanwhile help us in
          verifying your account by providing details in the next stage.
        </Typography>
        <Box className={classes.icon}>
          <FilingReadyIcon />
        </Box>
      </div>
    );
  }
  return (
    <div>
      <Typography component="h5" variant="h5B">
        We have received your Business Incorporation details!
      </Typography>
      <Typography
        variant="body1"
        sx={{ marginTop: '16px' }}
        className={classes.textSecondary}
      >
        Time to celebrate! All information is updated here. You can view your
        documents of incorporation in the{' '}
        <Link to={Routes.DOCUMENTS}>
          <Typography variant="body1B">Documents</Typography>
        </Link>{' '}
        section.
      </Typography>
      <ReadOnlyForm
        items={[
          {
            title: 'Company Name (Legal)',
            value: companyData?.name,
          },
          {
            title: 'Date Of Incorporation',
            value: companyData?.incorporationDate,
          },
          {
            title: 'Employer Identification Number (EIN)',
            value: companyData?.ein,
          },
        ]}
      />
      {documents && documents?.length > 0 && (
        <Box className={classes.documents}>
          <FormationsDivider />
          <Typography component="h6" variant="h8B" sx={{ mb: 2 }}>
            Documents of Incorporation
          </Typography>
          {documents?.map((item) => (
            <Typography variant="body1S" component="p" sx={{ mb: 1 }}>
              <AttachFileIcon sx={{ verticalAlign: 'text-bottom' }} />
              {item.title}
            </Typography>
          ))}
        </Box>
      )}
    </div>
  );
};
