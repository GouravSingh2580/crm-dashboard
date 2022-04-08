import React, { useEffect, useMemo, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import makeStyles from '@mui/styles/makeStyles';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Button,
  Grid,
  Typography,
  Radio,
  FormControlLabel,
  RadioGroup,
  FormControl,
  IconButton,
  TextField,
  Checkbox,
} from '@mui/material';
import { FormationsDialog } from 'components/FormationsDialog';
import { Loading } from 'components/common';
import { DocumentCategory, DocumentYear } from 'services/documentTypes';
import { AuthService } from 'services';
import { EDocumentStatus } from 'hooks/dataFormatters/useDocumentsTableData';
import { CategorizeSelectors } from 'components/documents';
import { YesNoModal } from 'components/common/modals';
import { VisibilityPopup } from 'components/documents/VisibilityPopup';
import { downloadDocument } from 'services/document';
import { RenderPDF } from 'components/common/ViewPDFSDK';
import { FormationsTableDocument } from 'components/common/tables/DocumentsTable';
import { defaultDocumentCategory } from 'components/documents/DocumentForm';
import { useDocumentDataOptions } from '../documents/helper';

const useStyles = makeStyles((theme) => ({
  fullHeightContainer: {
    height: '100%',
  },
  previewContainer: {
    height: '100%',
  },
  fileContainer: {
    boxShadow: '0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    minHeight: '100%',
    height: '100%',
    position: 'relative',
  },
  page: {
    objectFit: 'fill',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  imagePreview: {
    maxWidth: '100%',
    objectFit: 'contain',
  },
  controlContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingBottom: theme.spacing(2),
  },
}));

interface IDocumentBlob {
  unsupportedType: boolean,
  fileType: string,
  fileBlob: any,
}
interface IFilePreviewDialogProps {
  open: boolean,
  onClose: () => void
  enableAction?: boolean
  file: any,
  files: FormationsTableDocument[],
  setViewingfile: (newFile: any) => void,
  categoriesData: DocumentCategory[],
  updateDocument: (param: { id: string, form: any }) => void,
  approveDocument: (param: { id: string }) => void,
  rejectDocument: (param: { id: string, form: any }) => void,
  deleteDocument: (id: string) => void,
  lockDownCategory?: {
    department: string,
    category: string,
    subcategory: string,
  },
}

const initDocumentBlobState: IDocumentBlob = {
  unsupportedType: false,
  fileType: '',
  fileBlob: undefined,
};

const maxCommentLength = 300;

export const FilePreviewDialog: React.FC<IFilePreviewDialogProps> = ({
  open,
  onClose,
  enableAction = false,
  file,
  files,
  setViewingfile,
  categoriesData,
  updateDocument,
  approveDocument,
  rejectDocument,
  deleteDocument,
  lockDownCategory
}) => {
  const isAdmin = AuthService.isAdmin();
  const classes = useStyles();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [fileState, setFileState] = useState<any>(EDocumentStatus.Submitted);
  const [documentBlob, setDocumentBlob] = useState<IDocumentBlob>(initDocumentBlobState);
  const [comment, setComment] = useState('');
  const [value, setValue] = useState(defaultDocumentCategory);
  const [isDeleteModelOpen, setDeleteModelOpen] = useState(false);
  const [isVisibilityModalOpen, setVisibilityModalOpen] = useState(false);
  const { unsupportedType, fileType, fileBlob } = documentBlob;
  const {
    yearOptions,
    departmentOptions,
    categoryOptions,
    subCategoryOptions,
  } = useDocumentDataOptions(value, categoriesData);

  useEffect(() => {
    if (file) {
      setFileState(file.status);
      setValue({
        year: file.forYear || '',
        department: file.department || lockDownCategory?.department || '',
        category: file.category || lockDownCategory?.category || '',
        subcategory: file.subcategory || lockDownCategory?.subcategory || '',
        visibleToCustomer: file.visibleToCustomer || false,
        isVisibilityEditable: file.isVisibilityEditable,
        emailTemplateId: '',
      });
      setComment(file.statusReason || '');
    }
  }, [file, lockDownCategory]);

  const isStatusUpdated: boolean = useMemo(
    () => file?.status !== EDocumentStatus.Submitted, [file],
  );

  const currentFileIndex: number = useMemo(() => {
    if (file && files) {
      return files.findIndex((f) => f.id === file.id);
    }
    return 0;
  }, [file, files]);

  const totalFiles: number = useMemo(() => files.length, [files]);

  const handleChange = (name: string, v: string | DocumentYear) => {
    let newValue = {};

    if (name === 'department') {
      newValue = {
        department: v,
        category: '',
        subcategory: '',
      };
    } else if (name === 'category') {
      newValue = {
        category: v,
        subcategory: '',
      };
    } else {
      newValue = {
        [name]: v,
      };
    }
    setValue({ ...value, ...newValue });
  };

  const disableVisibleEdit = useMemo(() => {
    if (file?.isVisibilityEditable || file?.uploader?.role === 'Admin') {
      return false
    }
    return true
  }, [file])

  const disableSave = useMemo(() => {
    switch (fileState) {
      case EDocumentStatus.Submitted:
      case EDocumentStatus.Approved:
        return !value.year || !value.department || !value.category || (!value.subcategory && subCategoryOptions.length > 0);
      case EDocumentStatus.Rejected:
        return comment.length <= 0;
      default:
        return false;
    }
  }, [value, fileState, comment, subCategoryOptions]);

  const {
    saveButtonText,
    showRejectComment,
    showCategory,
    showSaveButton,
  } = useMemo(() => {
    const res = {
      saveButtonText: 'Recategorize',
      showRejectComment: false,
      showCategory: false,
      showSaveButton: false,
    };
    if (!isStatusUpdated && enableAction) {
      res.saveButtonText = 'Save';
    }

    switch (fileState) {
      case EDocumentStatus.Rejected:
        if (!isStatusUpdated) {
          res.showSaveButton = true;
        }
        res.showRejectComment = true;
        break;
      case EDocumentStatus.Approved:
      case EDocumentStatus.Submitted:
      default:
        res.showCategory = true;
        res.showSaveButton = true;
        break;
    }
    return res;
  }, [fileState, isStatusUpdated, enableAction]);

  const fileStatusText = useMemo(() => {
    if (file?.isVisibilityEditable) {
      // file uploaded by admin
      return 'Admin uploaded';
    }
    switch (file?.status) {
      case EDocumentStatus.Approved:
        return 'Admin approved';
      case EDocumentStatus.Rejected:
        return 'Admin rejected';
      case EDocumentStatus.Submitted:
      default:
        return 'User uploaded';
    }
  }, [file]);

  const resetStates = () => {
    setDocumentBlob(initDocumentBlobState);
    setComment('');
  };

  const prevFile = () => {
    resetStates();
    if (currentFileIndex > 0) {
      setViewingfile(files[currentFileIndex - 1]);
    }
  };

  const nextFile = () => {
    resetStates();
    if (currentFileIndex < files.length - 1) {
      setViewingfile(files[currentFileIndex + 1]);
    }
  };

  useEffect(() => {
    async function downloadDocBlob() {
      setLoading(true);
      const blob = await downloadDocument(file.id);
      const docType = blob?.type;
      const newFile = {
        ...initDocumentBlobState,
        fileBlob: blob,
      };
      switch (docType) {
        case 'application/pdf':
          newFile.fileType = 'pdf';
          newFile.unsupportedType = false;
          break;
        case 'image/png':
        case 'image/jpeg':
        case 'image/jpg':
          newFile.fileType = 'image';
          newFile.unsupportedType = false;
          break;
        default:
          newFile.unsupportedType = true;
          break;
      }
      setDocumentBlob(newFile);
      setLoading(false);
    }
    if (file) {
      // todo: fix it to allow image display when the design is out
      downloadDocBlob();
    }
  }, [file]);

  const onCloseDialog = () => {
    onClose();
    resetStates();
  };

  const handleDocumentUpdate = async () => {
    const { department, category, subcategory } = value;
    const documentCategoryId = categoriesData.find(
      (item) => item.department === department
        && item.category === category
        && item.subcategory === subcategory,
    )?.id;
    switch (fileState) {
      case EDocumentStatus.Approved:
        if (file.status !== EDocumentStatus.Approved) {
          await approveDocument({
            id: file.id,
          });
        }
        await updateDocument({
          id: file.id,
          form: {
            status: EDocumentStatus.Approved,
            year: value.year || '',
            companyId: file.companyId || '',
            documentCategoryId: documentCategoryId || '',
          },
        });
        break;
      case EDocumentStatus.Rejected:
        await rejectDocument({
          id: file.id,
          form: {
            reason: comment,
          },
        });
        break;
      case EDocumentStatus.Submitted:
        await updateDocument({
          id: file.id,
          form: {
            status: EDocumentStatus.Approved,
            year: value.year || '',
            companyId: file.companyId || '',
            documentCategoryId: documentCategoryId || '',
          },
        });
        break;
      default:
        break;
    }
    onCloseDialog();
  };

  const handleEditVisibility = async () => {
    setVisibilityModalOpen(false);
    await updateDocument({
      id: file.id,
      form: {
        visibleToCustomer: !file?.visibleToCustomer,
      },
    });
  };

  const handleDocumentDownload = () => {
    if (fileBlob) {
      const url = window.URL.createObjectURL(new Blob([fileBlob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.title);
      document.body.appendChild(link);
      link.click();
      setLoading(false);
      window.URL.revokeObjectURL(url);
      link?.parentNode?.removeChild(link);
    }
  };

  const handleDocumentDelete = async () => {
    setDeleteModelOpen(false);
    await deleteDocument(file.id);
    onCloseDialog();
  };

  const nullScreen = (
    <Typography variant="body2">
      Preview of this document format is not supported
    </Typography>
  );

  const filePreview = (
    <Grid
      container
      sx={{
        height: '100%',
      }}
    >
      {fileType === 'pdf'
        ? <RenderPDF
          blob={fileBlob}
          filename={file?.title || 'File'}
        />
        : (
          <img
            className={classes.imagePreview}
            alt="Document preview"
            src={fileBlob && window.URL.createObjectURL(fileBlob)}
          />
        )}
    </Grid>
  );

  const previewContent = (
    <Grid
      container
      direction="row"
      alignItems="flex-start"
      className={classes.previewContainer}
    >
      <Grid
        item
        container
        justifyContent="center"
        alignItems="center"
        xs={1}
        className={classes.fullHeightContainer}
      >
        <IconButton
          aria-label="prevFile"
          color="primary"
          onClick={prevFile}
          disabled={currentFileIndex <= 0}
        >
          <ArrowBackIcon />
        </IconButton>
      </Grid>
      <Grid
        item
        container
        justifyContent="center"
        alignItems="flex-start"
        xs={10}
        className={classes.fullHeightContainer}
      >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          className={classes.fullHeightContainer}
        >
          <Grid
            item
            container
            xs={isAdmin ? 8 : 12}
            className={classes.fileContainer}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            {unsupportedType ? nullScreen : filePreview}
          </Grid>
          {isAdmin
            && (
              <Grid
                item
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                xs={4}
                sx={{ p: 2 }}
              >
                {enableAction
                  ? (
                    <FormControl
                      component="fieldset"
                      disabled={isStatusUpdated}
                      sx={{ mb: 2 }}
                    >
                      <RadioGroup
                        aria-label="option"
                        name="options"
                        value={fileState}
                        onChange={(e) => setFileState(e.target.value)}
                        defaultValue={EDocumentStatus.Submitted}
                      >
                        <FormControlLabel value={EDocumentStatus.Submitted} control={<Radio />} label="Waiting" />
                        <FormControlLabel
                          value={EDocumentStatus.Approved}
                          control={<Radio />}
                          label="Approve"
                        />
                        <FormControlLabel
                          value={EDocumentStatus.Rejected}
                          control={<Radio />}
                          label="Reject"
                        />
                      </RadioGroup>
                    </FormControl>
                  )
                  : (
                    <Typography
                      variant="h6"
                      sx={{ mb: 2 }}
                    >
                      {fileStatusText}
                    </Typography>
                  )}
                {showRejectComment
                  && (
                    <TextField
                      multiline
                      fullWidth
                      required
                      autoFocus
                      minRows={6}
                      maxRows={6}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      label="Comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      sx={{ mb: 2 }}
                      disabled={isStatusUpdated}
                      inputProps={{ maxLength: maxCommentLength }}
                      data-testid="field-reject-comment"
                    />
                  )}
                {showCategory
                  && (
                    <CategorizeSelectors
                      options={{
                        yearOptions,
                        departmentOptions,
                        categoryOptions,
                        subCategoryOptions,
                      }}
                      handleChange={handleChange}
                      value={value}
                    />
                  )}
                {showSaveButton
                  && (
                    <Button
                      size="large"
                      variant="contained"
                      color="primary"
                      onClick={handleDocumentUpdate}
                      disabled={disableSave}
                      data-testid="save-btn"
                    >
                      {saveButtonText}
                    </Button>
                  )}
              </Grid>
            )}
        </Grid>
      </Grid>
      <Grid
        item
        container
        justifyContent="center"
        alignItems="center"
        xs={1}
        className={classes.fullHeightContainer}
      >
        <IconButton
          aria-label="nextFile"
          color="primary"
          onClick={nextFile}
          disabled={currentFileIndex >= totalFiles - 1}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Grid>
    </Grid>
  );

  const Heading = (
    <Grid item>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
      >
        <Typography variant="h6">
          {file?.title}
        </Typography>
        {isAdmin
          && (
            <FormControlLabel
              control={(
                <Checkbox
                  checkedIcon={<Visibility />}
                  icon={<VisibilityOff />}
                  name="checked"
                  checked={file?.visibleToCustomer || false}
                  disabled={disableVisibleEdit}
                  onClick={() => setVisibilityModalOpen(true)}
                />
              )}
              label={
                file?.visibleToCustomer
                  ? 'Customer-visible'
                  : 'Not customer-visible'
              }
            />
          )}
      </Grid>
    </Grid>
  );

  const HeadingRight = (
    <Grid item>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
      >
        <Button
          size="large"
          variant="outlined"
          color="primary"
          onClick={handleDocumentDownload}
          startIcon={<DownloadIcon />}
          sx={{
            mr: 2,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          Download
        </Button>
        <Button
          size="large"
          variant="outlined"
          color="primary"
          onClick={() => setDeleteModelOpen(true)}
          startIcon={<DeleteOutlineIcon />}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          Delete
        </Button>
      </Grid>
    </Grid>
  );

  return (
    <FormationsDialog
      open={open}
      onClose={onCloseDialog}
      heading={Heading}
      headingRight={HeadingRight}
      backButton
      fullScreen
      excludeFooter
    >
      {isLoading ? <Loading /> : previewContent}
      <YesNoModal
        open={isDeleteModelOpen}
        heading="Are you sure you want to delete this document?"
        okText="Delete"
        okButtonColor="error"
        onSave={handleDocumentDelete}
        onClose={() => setDeleteModelOpen(false)}
      />

      <VisibilityPopup
        open={isVisibilityModalOpen}
        status={!file?.visibleToCustomer}
        onSave={handleEditVisibility}
        onClose={() => setVisibilityModalOpen(false)}
      />
    </FormationsDialog>
  );
};
