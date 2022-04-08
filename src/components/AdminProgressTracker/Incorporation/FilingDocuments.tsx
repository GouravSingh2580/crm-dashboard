import React, { useContext, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { ReadOnlyForm } from 'components/common/ReadOnlyForm';
import EditIcon from '@mui/icons-material/Edit';
import { FormationsFormDialog } from 'components/common/FormationsFormDialog';
import queryClient from 'states/reactQueryClient';
import {
  FormationsForm,
  FormationsFormFields,
  ButtonsAlign,
} from 'components/common/FormationsForm';
import { Company } from 'models/company';
import { useUpdateCompany } from 'hooks/api/useCompanies';
import { UserInfo } from 'services/users';
import { filingDocumentsSchema } from 'schemas/filingDocumentsSchema';
import { UIDateFormat } from 'helpers/dateTimeFormat';
import { FormationsDivider } from 'components/common';
import { ProgressTrackerStages } from 'services/account';
import { get } from 'lodash';
import { isStepCompleted } from './state';
import { IncorporationContext } from './Incorporation';
import { UploadDocuments } from '../AccountVerification/UploadDocuments';

interface IFilingDocumentsViewProps {
  userData: UserInfo;
  companyData: Company;
  handleComplete: () => void;
  isProgressUpdating: boolean;
}

const fieldsMap = [
  {
    type: FormationsFormFields.Text,
    name: 'name',
    placeholder: 'Company Name',
    autoCapitalize: true,
    label: 'Company Name',
    autoFocus: true,
    maxLength: 80
  },
  {
    type: FormationsFormFields.Text,
    name: 'ein',
    placeholder: '123456789',
    maxLength: 9,
    label: 'Employer Identification Number (EIN)',
  },
  {
    type: FormationsFormFields.Date,
    name: 'incorporationDate',
    placeholder: 'MM/DD/YYYY',
    label: 'Date Of Incorporation',
  },
];

export const FilingDocumentsView: React.FC<IFilingDocumentsViewProps> = ({
  userData,
  companyData,
  handleComplete,
  isProgressUpdating = false,
}) => {
  const { name, ein, incorporationDate } = companyData;
  const { state } = useContext(IncorporationContext);

  const [showEditModal, setShowEditModal] = useState(false);
  const showForm = name === '' && ein === '' && incorporationDate == null;
  const readOnlyFields = fieldsMap.map((field) => ({
    title: field.label,
    value: get(companyData, field.name),
  }));

  const { mutateAsync: updateCompany } = useUpdateCompany({
    onSuccess: async () => {
      await queryClient.invalidateQueries(['company/user', 'userid', userData.id]);
      setShowEditModal(false);
    },
  });

  const onFormSubmit = async (formData: Company) => {
    const companyDetails = {
      ein: formData?.ein,
      name: formData?.name,
      incorporationDate: formData?.incorporationDate
        ? UIDateFormat(formData?.incorporationDate)
        : undefined,
    };

    await updateCompany({ id: companyData.id!, data: companyDetails });
  };

  const renderFormControls = () => (
    <Button type="submit" variant="contained" data-testid="saveFilingDocumentForm">
      Save
    </Button>
  );

  return (
    <div>
      <Grid container direction="column">
        <Grid container direction="row" alignItems="baseline" rowGap={2}>
          <Typography variant="h5B" component="span">
            Filing Documents
          </Typography>
          {!showForm && (
            <Button
              data-testid="filingDocumentEditBtn"
              aria-label="Edit"
              sx={{ marginLeft: '24px' }}
              startIcon={<EditIcon />}
              onClick={() => setShowEditModal(true)}
            >
              Edit
            </Button>
          )}
        </Grid>
        <Typography variant="subtitle2" component="p" sx={{ marginTop: '8px' }}>
          Please update information and upload related documents once this
          account is incorporated so the client can complete this Incorporation
          stage and move forward.
        </Typography>
        {showForm ? (
          <FormationsForm
            onSubmit={onFormSubmit}
            defaultValues={{
              name,
              ein,
              incorporationDate: companyData.incorporationDate || null,
              mode: 'onChange',
              reValidateMode: 'onChange',
            }}
            fieldsMap={fieldsMap}
            validationSchema={filingDocumentsSchema}
            renderFormControls={renderFormControls}
            buttonsAlign={ButtonsAlign.Left}
          />
        ) : (
          <ReadOnlyForm items={readOnlyFields} />
        )}

        <FormationsDivider />
        {userData.accountId && companyData.id && (
          <UploadDocuments
            subtitle="Click to view Filing documents of the Company"
            categoryData={{
              name: 'Organizational Docs',
              subcategory: 'Miscellaneous',
              department: 'Permanent',
              visibleToCustomer: true
            }}
            accountId={userData.accountId}
            companyId={companyData.id}
            onComplete={handleComplete}
            loading={isProgressUpdating}
            hasCompleteCTA={!!(name && ein && incorporationDate)}
            isCompleted={isStepCompleted(state, ProgressTrackerStages.FilingDocuments)}
          />
        )}
      </Grid>
      {showEditModal && (
        <FormationsFormDialog
          title="Edit Filing Details"
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={onFormSubmit}
          fieldsMap={fieldsMap}
          defaultValues={{
            name,
            ein,
            incorporationDate: companyData.incorporationDate || null,
            mode: 'onChange',
            reValidateMode: 'onChange',
          }}
          validationSchema={filingDocumentsSchema}
        />
      )}
    </div>
  );
};
