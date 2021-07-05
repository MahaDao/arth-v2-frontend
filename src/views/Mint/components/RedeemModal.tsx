import { Divider, } from '@material-ui/core';
import { parseUnits } from 'ethers/lib/utils';
import { BigNumber } from '@ethersproject/bignumber';
import React, { useEffect, useState } from 'react';

import Button from '../../../components/Button';
import CustomModal from '../../../components/CustomModal';
import useTokenDecimals from '../../../hooks/useTokenDecimals';
import { getDisplayBalance } from '../../../utils/formatBalance';
import CustomSuccessModal from '../../../components/CustomSuccesModal';
import useRedeemARTH from '../../../hooks/callbacks/pools/useRedeemARTH';
import Grid from '@material-ui/core/Grid';
import TransparentInfoDiv from '../../../components/CustomTransparentInfoDiv/InfoDiv';

interface IProps {
  openModal: boolean;
  isInputFieldError: boolean;
  selectedCollateralCoin: string;
  collateralValue: string;
  arthValue: string;
  arthxValue: string;
  redeemCR: BigNumber;
  tradingFee: BigNumber;
  stabilityFee: BigNumber;
  onClose: () => void;
  onSuccess: () => void;
  isArthMahaArthxApproved: boolean;
  collateralOutMinAfterFee: BigNumber;
}

const RedeemModal = (props: IProps) => {
  const {
    isInputFieldError,
    openModal,
    onClose,
    collateralValue,
    arthValue,
    selectedCollateralCoin,
    redeemCR,
    tradingFee,
    arthxValue,
    onSuccess,
    stabilityFee,
    isArthMahaArthxApproved,
    collateralOutMinAfterFee,
  } = props;

  const [successModal, setSuccessModal] = useState<boolean>(false);

  const tokenDecimals = useTokenDecimals(selectedCollateralCoin);

  useEffect(() => window.scrollTo(0, 0), []);

  const handleRedeem = () => {
    redeemARTH(() => {
      onSuccess();
      setSuccessModal(true);
    });
  };

  const redeemARTH = useRedeemARTH(
    selectedCollateralCoin,
    BigNumber.from(parseUnits(`${arthValue}`, 18)),
    BigNumber.from(parseUnits(`${arthxValue}`, 18)),
    collateralOutMinAfterFee
  );

  return (
    <>
      <CustomModal
        closeButton
        handleClose={() => onClose}
        open={openModal}
        modalTitleStyle={{}}
        modalContainerStyle={{}}
        modalBodyStyle={{}}
        title={`Confirm Redeem ARTH`}
      >
        <div>
          <TransparentInfoDiv
            labelData={`Your ARTH redeem amount`}
            rightLabelUnit={'ARTH'}
            rightLabelValue={Number(arthValue).toLocaleString()}
          />

          <TransparentInfoDiv
            labelData={`Your ARTHX redeem amount`}
            rightLabelUnit={'ARTHX'}
            rightLabelValue={Number(arthxValue).toLocaleString()}
          />

          {/* <TransparentInfoDiv
            labelData={`Trading Fee`}
            rightLabelUnit={selectedCollateralCoin}
            rightLabelValue={
              Number(getDisplayBalance(tradingFee, tokenDecimals))
                .toLocaleString('en-US', { maximumFractionDigits: tokenDecimals })
            }
          /> */}

          <TransparentInfoDiv
            labelData={`Stability Fee`}
            rightLabelUnit={'MAHA'}
            rightLabelValue={
              Number(getDisplayBalance(stabilityFee, 18, 3))
                .toLocaleString('en-US', { maximumFractionDigits: 2 })
            }
          />

          <Divider
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              margin: '15px 0px',
            }}
          />

          <TransparentInfoDiv
            labelData={`You will receive collateral`}
            labelToolTipData={'testing'}
            rightLabelUnit={selectedCollateralCoin}
            rightLabelValue={Number(collateralValue).toLocaleString()}
          />

          <Grid container style={{ marginTop: '24px' }} spacing={2}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Button
                variant={'transparent'}
                text="Cancel"
                size={'lg'}
                onClick={() => {
                  onClose()
                }}
                tracking_id={'cancel_redeem'}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Button
                disabled={
                  redeemCR.lte(1e6) ||
                  isInputFieldError ||
                  !isArthMahaArthxApproved ||
                  !Number(collateralValue) ||
                  !Number(arthValue)
                }
                text={'Redeem ARTH'}
                size={'lg'}
                onClick={handleRedeem}
                tracking_id={'confirm_redeem'}
              />
            </Grid>
          </Grid>
        </div>
      </CustomModal>

      <CustomSuccessModal
        modalOpen={successModal}
        setModalOpen={() => setSuccessModal(false)}
        title={'Redeeming ARTH successful!'}
        subTitle={''}
        subsubTitle={'Your ARTH has now been redeemed for its underlying collateral'}
      />s
    </>
  );
};















export default RedeemModal;
