import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useMediaBreakpoints } from 'hooks/useMediaBreakpoints';
import { FormationsForm, IFormField } from './FormationsForm';

interface IFormDialog {
  isOpen: boolean;
  title: string;
  subTitle?: string;
  defaultValues: any;
  onChange?: (
    data: any,
    dirtyFields: any,
    setValue: (
      name: string,
      value: any,
      config?:
        | Partial<{ shouldValidate: boolean; shouldDirty: boolean }>
        | undefined,
    ) => void,
  ) => void | undefined;
  onSubmit: (data: any) => void,
  onClose: () => void;
  fieldsMap: IFormField[];
  validationSchema: any;
  formContext?: any;
}

export const FormationsFormDialog = ({
  isOpen,
  onClose,
  title,
  subTitle,
  fieldsMap,
  defaultValues,
  onChange,
  onSubmit,
  validationSchema,
  formContext,
}: IFormDialog) => {
  const { isMobile } = useMediaBreakpoints();
  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={onClose}
        fullScreen={isMobile}
        scroll="paper"
        fullWidth
        maxWidth="xs"
        test-dataid="form-dialog"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{subTitle}</DialogContentText>
          <FormationsForm
            onChange={onChange}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            fieldsMap={fieldsMap}
            onCancel={onClose}
            validationSchema={validationSchema}
            formContext={formContext}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

FormationsFormDialog.defaultProps = {
  subTitle: '',
  formContext: {},
};
