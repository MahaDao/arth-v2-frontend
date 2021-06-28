import React, { useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import { BigNumber } from '@ethersproject/bignumber';

import Button from '../../../components/Button';
import CustomModal from '../../../components/CustomModal';
import TransparentInfoDiv from '../../Genesis/components/InfoDiv';

import { StakingContract } from '../../../basis-cash';
import { getDisplayBalance, getDisplayBalanceToken } from '../../../utils/formatBalance';
import useStakingClaim from '../../../hooks/callbacks/staking/useStakingClaim';
import useCore from '../../../hooks/useCore';

interface IProps {
  toggleSuccessModal?: () => void;
  pool: StakingContract;
  onCancel: () => void;
  onClaim?: () => void;
  isMobile: boolean;
  claimableBalance: BigNumber,
  rates: {
    maha: BigNumber;
    arthx: BigNumber;
  };
  closeSuccessModal: () => void;
  openSuccessModal: () => void;
}

export default (props: IProps) => {
  const claim = useStakingClaim(
    props.pool.contract,
    props.pool.rewardTokenKind === 'multiple' ? 'multiple' : 'single'
  );

  const handleClaim = () => {
    claim(() => {
      props.onCancel();
      props.openSuccessModal();
    });
  }

  const core = useCore()
  const pow = BigNumber.from(10).pow(18);
  const initEarnedARTHX = useMemo(() => {
    return Number(getDisplayBalance(
      props?.claimableBalance?.mul(props?.rates?.arthx).div(pow),
      18,
      6
    ))
  }, [props, pow]);

  const initEarnedMAHA = useMemo(() => {
    if (props.pool.rewardTokenKind === 'multiple') {
      return Number(getDisplayBalanceToken(
        props?.claimableBalance?.mul(props?.rates?.maha).div(pow),
        core.tokens.MAHA,
        6
      ))
    }

    if (props.pool.rewardTokenKind === 'single') {
      return Number(getDisplayBalanceToken(props?.claimableBalance, core.tokens.MAHA, 6))
    }
  }, [props, pow, core.tokens.MAHA]);

  return (
    <CustomModal
      closeButton
      handleClose={props.onCancel}
      open={true}
      modalTitleStyle={{}}
      modalContainerStyle={{}}
      modalBodyStyle={{}}
      title={`Claim Your Rewards`}
    >
      <>
        <TransparentInfoDiv
          labelData={`You will receive`}
          rightLabelUnit={'MAHA'}
          rightLabelValue={

            Number(initEarnedMAHA)
              .toLocaleString('en-US', { maximumFractionDigits: 6 })
          }
        />
        <Grid
          container
          spacing={2}
          style={{
            marginTop: '32px',
            display: 'flex',
            flexDirection: props.isMobile ? 'column-reverse' : 'row',
          }}
        >
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Button
              variant={'transparent'}
              text="Cancel"
              size={'lg'}
              onClick={props.onCancel}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Button
              // disabled={
              //   // !Number(initEarnedARTHX) ||
              //   // !Number(initEarnedMAHA)
              // }
              text={'Claim'}
              size={'lg'}
              onClick={handleClaim}
            />
          </Grid>
        </Grid>
      </>
    </CustomModal>
  );
};
