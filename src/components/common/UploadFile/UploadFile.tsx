import { Box, Button } from '@mui/material';
import { useDropzone, DropzoneProps } from 'react-dropzone';
import { makeStyles } from '@mui/styles';
import SearchIcon from '@mui/icons-material/Search';
import { SECONDARY_COLOR } from 'theme/constant';

const useStyles = makeStyles((theme) => ({
  box: {
    padding: theme.spacing(4),
    border: `1px dashed ${SECONDARY_COLOR}`,
    margin: theme.spacing(2, 1),
  },
  secondaryText: {
    ...theme.typography.h9B,
    marginTop: theme.spacing(1),
    color: theme.palette.secondary.dark,
  },
}));

interface UploadProps {
  uploadProps: DropzoneProps;
}

export const UploadFile = ({ uploadProps }: UploadProps) => {
  const classes = useStyles();

  const { getRootProps, getInputProps, isDragReject, open } =
    useDropzone(uploadProps);

  return (
    <Box display="flex" flexDirection="column">
      <div {...getRootProps()}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          className={classes.box}
        >
          <Button
            startIcon={<SearchIcon />}
            variant="contained"
            color="secondary"
            size="large"
            onClick={open}
          >
            Browse Files
          </Button>
          <label className={classes.secondaryText} htmlFor="file">
            or drop it here
            <input id="file" {...getInputProps()} />
          </label>
        </Box>
        {isDragReject && 'File type not accepted, sorry!'}
      </div>
    </Box>
  );
};
