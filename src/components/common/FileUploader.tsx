import { useState, useRef, ReactChild, ChangeEvent } from 'react';
import { Button, ButtonProps } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  hide: {
    display: 'none',
  },
}));

interface Props extends ButtonProps{
  children?: ReactChild;
  text: string;
  onUpload: (files: File[]) => void;
}

export const FileUploader = ({ text, onUpload, ...rest }: Props) => {
  const classes = useStyles();

  const [files, setFiles] = useState([]);

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    hiddenFileInput?.current?.click();
  };

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    onUpload(Array.from(target.files || []));
    setFiles([]);
  };

  return (
    <>
      <Button
        size="large"
        variant="contained"
        color="secondary"
        onClick={handleClick}
        {...rest}
      >
        {text}
      </Button>

      <input
        className={classes.hide}
        type="file"
        multiple
        ref={hiddenFileInput}
        value={files}
        onChange={handleChange}
      />
    </>
  );
};
