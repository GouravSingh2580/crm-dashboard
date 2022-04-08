import { YesNoModal } from 'components/common/modals';
import { Autocomplete, TextField } from '@mui/material';
import { useMemo, useState } from 'react';
import { GustoCompany, useGustoCompanies } from 'hooks/api/gusto';

interface FieldValue {
  uuid: string;
  name: string;
}

interface Option {
  uuid: string;
  label: string;
}

const transform = (fieldValue: FieldValue  | undefined): Option | null => {
  if (fieldValue == null) return null;
  return {
    uuid: fieldValue.uuid,
    label: fieldValue.name,
  };
};
const transformGustoCompany = (company: GustoCompany) => ({
  uuid: company.uuid,
  label: company.name,
});

interface Props {
  value: FieldValue | undefined;
  onSave: (value: FieldValue | undefined) => void;
  onCancel: () => void;
}

export const GustoCompanyField = ({
  value: companyValue,
  onSave,
  onCancel,
}: Props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(true);
  const [value, setValue] = useState<Option | null>(transform(companyValue));
  const [inputValue, setInputValue] = useState('');
  const { gustoCompanies } = useGustoCompanies();
  const companiesOptions = useMemo(() => {
    if (gustoCompanies != null) {
      return gustoCompanies.map(transformGustoCompany);
    }
    return [];
  }, [gustoCompanies]);

  const handleSave = () => {
    if (value != null) {
      onSave({
        uuid: value.uuid,
        name: value.label,
      });
    } else {
      onSave(undefined)
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    onCancel();
  };

  return (
    <>
      {companyValue?.name || 'N/A'}
      <YesNoModal
        open={modalOpen}
        heading="Gusto company"
        size="sm"
        onClose={handleCancel}
        onSave={handleSave}
      >
        <Autocomplete
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Company"
              helperText="Leave the field blank will disconnect company"
            />
          )}
          options={companiesOptions}
        />
      </YesNoModal>
    </>
  );
};
