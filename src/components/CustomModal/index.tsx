import React from 'react';
import { createStyles, makeStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import CloseIcon from '../../assets/img/CloseIcon.svg';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      borderRadius: '12px',
      padding: theme.spacing(2),
      color: 'white',
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },

  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  titleLogo?: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
  modalTitleStyle?: any;
  closeButton?: boolean;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, titleLogo, modalTitleStyle, closeButton, ...other } = props;
  return (
    <MuiDialogTitle style={modalTitleStyle} disableTypography className={classes.root} {...other}>
      <div className="dialog-class width-100">
        {titleLogo && titleLogo}
        <Typography variant="h6">{children}</Typography>
      </div>
      {onClose && closeButton ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <img src={CloseIcon} width="24px" alt="" />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(() => ({
  root: {
    minWidth: 500,
  },
  dividers: {
    borderTop: `1px solid rgba(255, 255, 255, 0.08)`,
  },
  '@media (max-width: 600px)': {
    root: {
      width: '100%',
      minWidth: '350px',
      maxHeight: '60%',
    },
  },
}))(MuiDialogContent);

interface props {
  children: React.ReactNode;
  title?: string;
  handleClose?: Function;
  open?: boolean;
  titleLogo?: React.ReactNode;
  modalContainerStyle?: any;
  modalTitleStyle?: any;
  modalBodyStyle?: any;
  closeButton?: boolean;
  mobile?: boolean;
}

const useStyles = makeStyles({
  halfScreen: {

  },
  customPaper: {

  },
  '@media (max-width: 600px)': {
    halfScreen: {
      height: 'auto',
      maxHeight: '70%',
      width: '100%',
      borderRadius: '12px 12px 0px 0px !important'
    },
    customPaper: {
      alignItems: 'flex-end',
    },
  },
});

const CustomModal: React.FC<props> = ({
  children,
  title,
  handleClose,
  open,
  titleLogo,
  modalContainerStyle,
  modalTitleStyle,
  modalBodyStyle,
  closeButton,
  mobile = false,
}) => {
  const theme = useTheme();
  const modalStyles = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openModal, setOpen] = React.useState(open);

  const handleCloseModal = () => {
    if (handleClose) {
      handleClose();
    }
  };
  if (open !== openModal) {
    setOpen(open);
  }
  let modalJsx = <div />;
  if (openModal) {
    modalJsx = (
      <Dialog
        style={modalContainerStyle}
        fullScreen={fullScreen}
        fullWidth={mobile}
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={openModal}
        onBackdropClick={handleCloseModal}
        classes={{
          paper: 'custom-dialog-class',
          paperFullScreen: modalStyles.halfScreen,
          scrollPaper: modalStyles.customPaper,
        }}
      >
        {title && <DialogTitle
          closeButton={closeButton}
          modalTitleStyle={{
            color: 'rgba(255, 255, 255, 0.88)',
            alignItems: 'center',
            justifyContent: 'center',
            ...modalTitleStyle
          }}
          id='customized-dialog-title'
          onClose={handleCloseModal}
          titleLogo={titleLogo}
        >
          {title}
        </DialogTitle>}
        <DialogContent style={{
          background: 'linear-gradient(180deg, #48423E 0%, #373030 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '24px 32px',
          ...modalBodyStyle
        }} dividers>
          <div style={{}}>{children}</div>
        </DialogContent>
        {/* </div> */}
      </Dialog>
    );
  }
  return modalJsx;
};
export default CustomModal;
