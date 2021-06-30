import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';
import React, { useEffect, useMemo } from 'react';
import { parseUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { withSnackbar, WithSnackbarProps } from 'notistack';

import TransparentInfoDiv from '../../../components/CustomTransparentInfoDiv/InfoDiv';
import Button from '../../../components/Button';
import CustomModal from '../../../components/CustomModal';
import { CustomSnack } from '../../../components/SnackBar';

import useCore from '../../../hooks/useCore';
import useTokenDecimals from '../../../hooks/useTokenDecimals';
import useApprove, { ApprovalState } from '../../../hooks/callbacks/useApprove';
import usePerformRecollateralize from '../../../hooks/callbacks/pools/performRecollateralize';

interface IProps {
  isInputFieldError: boolean;
  receiveBonus: number;
  receiveShare: number;
  collateralAmount: number;
  openModal: boolean;
  selectedCollateral: string;
  onClose: () => void;
  toggleSuccessModal?: () => void;
  recollateralizableValue: BigNumber;
}

const RecollatateralizeModal = (props: WithSnackbarProps & IProps) => {
  const {
    isInputFieldError,
    openModal,
    onClose,
    receiveBonus,
    selectedCollateral,
    receiveShare,
    collateralAmount,
    recollateralizableValue,
    toggleSuccessModal
  } = props;

  useEffect(() => window.scrollTo(0, 0), []);

  const core = useCore();
  const tokenDecimals = useTokenDecimals(selectedCollateral);
  const collateralPool = core.getCollatearalPool(selectedCollateral);
  const [approveStatus] = useApprove(
    core.tokens[selectedCollateral],
    collateralPool.address,
  );

  const arthxAmountAfterDiscount = useMemo(() => (
    BigNumber.from(
      parseUnits(`${receiveBonus + receiveShare}`, 18)
    )
  ), [receiveBonus, receiveShare]);

  const recollateralize = usePerformRecollateralize(
    selectedCollateral,
    BigNumber.from(parseUnits(`${collateralAmount}`, tokenDecimals)),
    arthxAmountAfterDiscount,
  );

  const isCollateralApproved = approveStatus === ApprovalState.APPROVED;

  return (
    <CustomModal
      closeButton
      handleClose={onClose}
      open={openModal}
      modalTitleStyle={{}}
      modalContainerStyle={{}}
      modalBodyStyle={{}}
      title={`Confirm Recollateralize ARTH`}
    >
      <div>
        <TransparentInfoDiv
          labelData={`You will deposit`}
          rightLabelUnit={selectedCollateral}
          rightLabelValue={Number(collateralAmount).toLocaleString()}
        />

        <Divider
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            margin: '15px 0px',
          }}
        />

        <TransparentInfoDiv
          labelData={`And receive`}
          rightLabelUnit={'ARTHX'}
          rightLabelValue={Number(receiveShare).toLocaleString()}
        />

        <TransparentInfoDiv
          labelData={`Along with a bonus of`}
          rightLabelUnit={'ARTHX'}
          rightLabelValue={Number(receiveBonus).toLocaleString()}
        />

        <Grid container spacing={2} style={{ marginTop: '32px' }}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Button
              variant={'transparent'}
              text="Cancel"
              size={'lg'}
              onClick={() => {
                onClose();
                let options = {
                  content: () =>
                    CustomSnack({
                      onClose: props.closeSnackbar,
                      type: 'red',
                      data1: `Recollateralize ${Number(collateralAmount).toLocaleString()} ${selectedCollateral} cancelled`,
                    }),
                };
                props.enqueueSnackbar('timepass', options);
              }}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Button
              text={'Recollateralize'}
              disabled={
                recollateralizableValue.eq(0) ||
                isInputFieldError ||
                !isCollateralApproved ||
                !Number(collateralAmount) ||
                !Number(receiveShare)
              }
              size={'lg'}
              onClick={() => {
                recollateralize(() => {
                  onClose();
                  toggleSuccessModal();
                });
              }}
            />
          </Grid>
        </Grid>
      </div>
    </CustomModal>
  );
};

export default withSnackbar(RecollatateralizeModal);
