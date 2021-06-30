import { Divider, } from '@material-ui/core';
import { parseUnits } from 'ethers/lib/utils';
import { BigNumber } from '@ethersproject/bignumber';
import React, { useEffect, useMemo, useState } from 'react';

import TransparentInfoDiv from './InfoDiv';
import useCore from '../../../hooks/useCore';
import Button from '../../../components/Button';
import CustomModal from '../../../components/CustomModal';
import useTokenDecimals from '../../../hooks/useTokenDecimals';
import { getDisplayBalance } from '../../../utils/formatBalance';
import useMintARTH from '../../../hooks/callbacks/pools/useMintARTH';
import CustomSuccessModal from '../../../components/CustomSuccesModal';
import useApprove, { ApprovalState } from '../../../hooks/callbacks/useApprove';

interface IProps {
  isInputFieldError: boolean;
  collateralValue: string;
  openModal: boolean;
  onClose: () => void;
  selectedCollateralCoin: string;
  arthValue: string;
  mintCR: BigNumber;
  tradingFee: BigNumber;
  arthxValue: string;
  onSuccess: () => void;
}

const MintModal = (props: IProps) => {
  const {
    isInputFieldError,
    openModal,
    onClose,
    collateralValue,
    arthValue,
    selectedCollateralCoin,
    mintCR,
    tradingFee,
    arthxValue,
    onSuccess,
  } = props;

  const [successModal, setSuccessModal] = useState<boolean>(false);

  const core = useCore();
  const tokenDecimals = useTokenDecimals(selectedCollateralCoin);
  const collateralPool = core.getCollatearalPool(selectedCollateralCoin);
  const [collatApproveStatus, ] = useApprove(
    core.tokens[selectedCollateralCoin],
    collateralPool.address,
  );

  const isCollatApproved = collatApproveStatus === ApprovalState.APPROVED;

  useEffect(() => window.scrollTo(0, 0), []);

  const handleMint = () => {
    mintARTH(() => {
      onSuccess();
      setSuccessModal(true);
    });
  };

  const arthOutMinAfterFee = useMemo(() => {
    return BigNumber
      .from(parseUnits(`${arthValue}`, 18))
      .sub(tradingFee);
  }, [arthValue, tradingFee]);

  const mintARTH = useMintARTH(
    selectedCollateralCoin,
    BigNumber.from(parseUnits(`${collateralValue}`, tokenDecimals)),
    arthOutMinAfterFee,
    BigNumber.from(parseUnits(`${arthxValue}`, 18)),
  );

  return (
    <>
      <CustomModal
        closeButton
        handleClose={onClose}
        open={openModal}
        modalTitleStyle={{}}
        modalContainerStyle={{}}
        modalBodyStyle={{}}
        title={`Confirm Mint`}
      >
        <>
          <TransparentInfoDiv
            labelData={`Your collateral supply`}
            rightLabelUnit={selectedCollateralCoin}
            rightLabelValue={Number(collateralValue).toLocaleString()}
          />
          <TransparentInfoDiv
            labelData={`Trading Fee`}
            rightLabelUnit={'ARTH'}
            rightLabelValue={
              Number(getDisplayBalance(tradingFee, 18, 6))
                .toLocaleString('en-US', { maximumFractionDigits: 6 })
            }
          />
          <Divider
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              margin: '15px 0px',
            }}
          />
          <TransparentInfoDiv
            labelData={`You will mint`}
            rightLabelUnit={'ARTH'}
            rightLabelValue={Number(arthValue).toLocaleString()}
          />
          <TransparentInfoDiv
            labelData={`You will mint`}
            rightLabelUnit={'ARTHX'}
            rightLabelValue={Number(arthxValue).toLocaleString()}
          />
          <div
            style={{
              flexDirection: 'column-reverse',
              display: 'flex',
              width: '100%',
              marginTop: '10%',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <div style={{ flex: 1, width: '100%', marginTop: 10 }}>
              <Button
                variant={'transparent'}
                text="Cancel"
                size={'lg'}
                onClick={() => {
                  onClose();
                }}
              />
            </div>
            <div style={{ width: '100%' }}>
              <Button
                disabled={
                  mintCR.lt(1e6) ||
                  isInputFieldError ||
                  !Number(arthValue) ||
                  !isCollatApproved ||
                  !(Number(collateralValue))
                }
                text={'Confirm Mint'}
                size={'lg'}
                onClick={handleMint}
              />
            </div>
          </div>
        </>
      </CustomModal>

      <CustomSuccessModal
        modalOpen={successModal}
        setModalOpen={() => setSuccessModal(false)}
        title={'Minting ARTH successful!'}
        // subTitle={'View Transaction'}
        subsubTitle={
          'Your transaction is now being minted on the blockchain. You should consider staking your tokens to earn extra rewards!'
        }
        buttonText={'Stake your ARTH'}
        buttonType={'default'}
        buttonTo={'/farming'}
      />
    </>
  );
};















export default MintModal;
