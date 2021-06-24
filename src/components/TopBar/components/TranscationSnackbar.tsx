import React from 'react';
import styled from 'styled-components';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { TransitionProps } from '@material-ui/core/transitions';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';

import CloseIcon from '../../../assets/img/CloseIcon.svg';
import { PopupContent } from '../../../state/application/actions';
import config from '../../../config';


interface TxButtonProps {
  notificationCount?: number;
  open?: boolean;
  content?: PopupContent;
  handleCancel?: Function;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const CustomizedSnackbars: React.FC<TxButtonProps> = ({
  notificationCount,
  open,
  content,
  handleCancel,
}) => {

  const classes = useStyles();
  const [openSnackbar, setOpen] = React.useState(open);

  const isScucess = content?.txn?.success;
  const isLoading = content?.txn?.loading;

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;

    setOpen(false);
    if (handleCancel) handleCancel();
  };

  function SlideTransition(props: TransitionProps) {
    return <Slide {...props} direction="left" />;
  }

  return (
    <div className={classes.root}>
      {openSnackbar && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          TransitionComponent={SlideTransition}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <SnackBarParent>
            <SnackBarInnerContainer>
              {notificationCount && <NotificationCount>{notificationCount}</NotificationCount>}
              Transaction
              <img
                src={CloseIcon}
                width="24px"
                alt=""
                className="pointer"
                onClick={handleClose}
              />
            </SnackBarInnerContainer>
            {isLoading ? (
              <SnackBarLoading>
                <NotificationsNoneIcon className="margin-left-right-20" />
                <div className="dialog-class display-flex-column-baseline">
                  <Summary
                    className={
                      config.etherscanUrl !== '' && content.txn?.hash !== ''
                        ? 'margin-bottom-10'
                        : ''
                    }
                  >
                    {content.txn?.summary}
                  </Summary>
                  {config.etherscanUrl !== '' && content.txn?.hash !== '' && (
                    <AnchorTag
                      href={`${config.etherscanUrl}/tx/${content.txn?.hash}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      View on Explorer ↗
                    </AnchorTag>
                  )}
                </div>
              </SnackBarLoading>
            ) : isScucess ? (
              <SnackBarRedeem>
                <NotificationsNoneIcon className="margin-left-right-20" />
                <div className="dialog-class display-flex-column-baseline">
                  <Summary
                    className={
                      config.etherscanUrl !== '' && content.txn?.hash !== ''
                        ? 'margin-bottom-10'
                        : ''
                    }
                  >
                    {content.txn?.summary}
                  </Summary>
                  {config.etherscanUrl !== '' && content.txn?.hash !== '' && (
                    <AnchorTag
                      href={`${config.etherscanUrl}/tx/${content.txn?.hash}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      View on Explorer ↗
                    </AnchorTag>
                  )}
                </div>
              </SnackBarRedeem>
            ) : (
              <SnackBarRedeemCancelled>
                <NotificationsNoneIcon className="margin-left-right-20" />
                <div className="dialog-class display-flex-column-baseline">
                  <Summary>{content.txn?.summary || content.error?.message}</Summary>
                </div>
              </SnackBarRedeemCancelled>
            )}
          </SnackBarParent>
        </Snackbar>
      )}
    </div>
  );
};

const AnchorTag = styled.a`
  color: #ffffff;
  &:hover {
    color: #000000;
    text-decoration: underline;
  }
`;

const SnackBarInnerContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0px;
`;

const SnackBarRedeem = styled.div`
  background: #178a50;
  color: #ffffff;
  border-radius: 0px 0px 4px 4px;
  padding: 15px 0px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  width: 100%;
  justify-content: start;
  align-items: center;
`;

const SnackBarLoading = styled.div`
  background: #8a8817;
  color: #ffffff;
  border-radius: 0px 0px 4px 4px;
  padding: 15px 0px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  width: 100%;
  justify-content: start;
  align-items: center;
`;

const Summary = styled.span`
  word-wrap: break-word;
  white-space: normal;
`;

const SnackBarRedeemCancelled = styled.div`
  background: #ba1e38;
  color: #ffffff;
  border-radius: 0px 0px 4px 4px;
  padding: 15px 0px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  width: 100%;
  justify-content: start;
  align-items: center;
`;

const NotificationCount = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  margin-right: 20px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.12);
`;

const SnackBarParent = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(70px);
  border-radius: 4px 4px 0px 0px;
  border: 1px solid;
  min-width: 300px;
  border-image-source: linear-gradient(
    180deg,
    rgba(255, 116, 38, 0.1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  color: #ffffff;
  opacity: 0.88;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  width: 100%;
`;

export default CustomizedSnackbars;
