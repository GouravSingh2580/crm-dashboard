import { ReactNode, useState } from 'react';
import { ButtonBase, Modal } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  text: {
    color: theme.palette.secondary.main,
    ...theme.typography.body3,
  },
  icon: {
    padding: '9px',
    height: '20px',
    width: '20px',
  },
  body: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

interface Props {
  helperText: string;
  modalBody: ReactNode;
}

export const HelperModal = ({ helperText, modalBody }: Props) => {
  const classes = useStyles();
  const [isModalVisible, setModalVisibility] = useState(false);
  const handleOpen = () => setModalVisibility(true);
  const handleClose = () => setModalVisibility(false);

  return (
    <>
      <ButtonBase className={classes.wrapper} onClick={handleOpen}>
        <HelpIcon className={classes.icon} color="secondary" />
        <div className={classes.text}>{helperText}</div>
      </ButtonBase>
      <Modal
        open={isModalVisible}
        onClose={handleClose}
        aria-labelledby="modal"
        aria-describedby="modal-description"
      >
        <div className={classes.body}> {modalBody} </div>
      </Modal>
    </>
  );
};
