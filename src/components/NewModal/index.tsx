import React from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
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
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, titleLogo, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <div className="dialog-class width-100">
        {titleLogo && titleLogo}
        <Typography variant="h6">{children}</Typography>
      </div>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <img src={CloseIcon} width="24px" alt="" />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    minWidth: 320,
  },
  dividers: {
    border: `1px solid rgba(255, 255, 255, 0.08)`,
  },
}))(MuiDialogContent);

interface props {
  children: React.ReactNode;
  title?: string;
  handleClose?: Function;
  open?: boolean;
  titleLogo?: React.ReactNode;
}

const CustomizedDialogs: React.FC<props> = ({
  children,
  title,
  handleClose,
  open,
  titleLogo,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openModal, setOpen] = React.useState(open);
  const [isCloseClicked, toggleCloseClicked] = React.useState(false);

  const handleCloseModal = () => {
    setOpen(false);
    toggleCloseClicked(true);
    if (handleClose) {
      handleClose();
    }
  };
  if (!isCloseClicked && open !== openModal) {
    setOpen(open);
  }
  let modalJsx = <div />;
  if (openModal) {
    modalJsx = (
      <Dialog
        fullScreen={fullScreen}
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={openModal}
        classes={{
          paper: 'custom-dialog-class',
        }}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={handleCloseModal}
          titleLogo={titleLogo}
        >
          {title}
        </DialogTitle>
        <DialogContent dividers>{children}</DialogContent>
      </Dialog>
    );
  }
  return modalJsx;
};
export default CustomizedDialogs;
