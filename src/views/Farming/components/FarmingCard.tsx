import { useMediaQuery } from 'react-responsive';
import React, { useState, useEffect, useCallback } from 'react';
import { withSnackbar, WithSnackbarProps } from 'notistack';

import { ModeProps } from '../index';
import ClaimModal from './ClaimModal';
import ExitModal from './ExitModal';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import MobileRowCard from './MobileRowCard';
import DesktopRowCard from './DesktopRowCard';

import useCore from '../../../hooks/useCore';
import useModal from '../../../hooks/useModal';
import { StakingContract } from '../../../basis-cash';
import usePoolTokenRates from '../../../hooks/state/staking/usePoolTokenRates';
import useTokenBalance from '../../../hooks/state/useTokenBalance';
import CustomSuccessModal from '../../../components/CustomSuccesModal';
import useStakingBalance from '../../../hooks/state/staking/useStakingBalance';
import useStakingRewards from '../../../hooks/state/staking/useStakingRewards';

interface IProps {
  mode?: ModeProps;
  cardData: StakingContract;
}

interface APYState {
  isLoading: boolean;
  apy: string
}

const FarmingCard = (props: WithSnackbarProps & IProps) => {
  const [successModal, setSuccessModal] = useState(false);
  const [apyState, setAPYState] = useState<APYState>({ isLoading: true, apy: '0' });

  const core = useCore();
  const pool = props.cardData;
  const isMobile = useMediaQuery({ maxWidth: '600px' });
  const depositTokenContract = core.tokens[pool.depositToken];

  const fetchAPY = useCallback(async () => {
    const url = `https://api.arthcoin.com/api/apy/request?key=${pool.apyId}`;
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers':
        'access-control-allow-headers,access-control-allow-methods,access-control-allow-origin,content-type',
    };

    if (pool.apyId !== '') {
      fetch(url, { headers })
        .then(res => res.json())
        .then(res => setAPYState({ isLoading: false, apy: Number(res?.APY || 0).toLocaleString() + '%' }))
        .catch((err) => setAPYState({ isLoading: false, apy: '-' }));
    }
  }, [pool.apyId])

  useEffect(() => {
    fetchAPY()
    const interval = setInterval(fetchAPY, 60 * 1000);

    return () => clearInterval(interval);
  }, [core.config.refreshInterval, fetchAPY]);

  const { value: rates } = usePoolTokenRates();
  const { value: stakedBalance } = useStakingBalance(pool.contract);
  const { value: tokenBalance } = useTokenBalance(depositTokenContract);
  const { value: claimableBalance } = useStakingRewards(pool.contract);

  const [onPresentExitModal, onDismissExitModal] = useModal(
    <ExitModal
      pool={pool}
      stakedBalance={stakedBalance}
      claimableBalance={claimableBalance}
      isMobile={isMobile}
      onCancel={() => onDismissExitModal()}
      rates={rates}
      closeSuccessModal={() => setSuccessModal(false)}
      openSuccessModal={() => setSuccessModal(true)}
      toggleSuccessModal={() => { setSuccessModal(!successModal) }}
    />,
  );

  const [onPresentClaimModal, onDismissClaimModal] = useModal(
    <ClaimModal
      pool={pool}
      claimableBalance={claimableBalance}
      isMobile={isMobile}
      onCancel={() => onDismissClaimModal()}
      rates={rates}
      closeSuccessModal={() => setSuccessModal(false)}
      openSuccessModal={() => setSuccessModal(true)}
      toggleSuccessModal={() => { setSuccessModal(!successModal) }}
    />,
  );

  const [onPresentWithdrawModal, onDismissWithdrawModal] = useModal(
    <WithdrawModal
      pool={pool}
      stakedBalance={stakedBalance}
      isMobile={isMobile}
      claimableBalance={claimableBalance}
      onCancel={() => onDismissWithdrawModal()}
      closeSuccessModal={() => setSuccessModal(false)}
      openSuccessModal={() => setSuccessModal(true)}
      toggleSuccessModal={() => { setSuccessModal(!successModal) }}
    />,
  );

  const [onPresentDepositModal, onDismissDepositModal] = useModal(
    <DepositModal
      pool={pool}
      tokenBalance={tokenBalance}
      isMobile={isMobile}
      onCancel={() => onDismissDepositModal()}
      closeSuccessModal={() => setSuccessModal(false)}
      openSuccessModal={() => setSuccessModal(true)}
      toggleSuccessModal={() => { setSuccessModal(!successModal) }}
    />,
  );

  return (
    <div>
      <CustomSuccessModal
        modalOpen={successModal}
        setModalOpen={() => setSuccessModal(false)}
        title={'Transaction Success!'}
        subsubTitle={
          'Your transaction is now being mined on the blockchain.'
        }
      />
      {!isMobile ? (
        <DesktopRowCard
          pool={pool}
          apyState={apyState}
          claimableBalance={claimableBalance}
          stakedBalance={stakedBalance}
          rates={rates}
          onExitClick={onPresentExitModal}
          onDepositClick={onPresentDepositModal}
          onClaimClick={onPresentClaimModal}
          onWithdrawClick={onPresentWithdrawModal}
        />
      ) : (
        <MobileRowCard
          pool={pool}
          apyState={apyState}
          claimableBalance={claimableBalance}
          stakedBalance={stakedBalance}
          rates={rates}
          onExitClick={onPresentExitModal}
          onDepositClick={onPresentDepositModal}
          onClaimClick={onPresentClaimModal}
          onWithdrawClick={onPresentWithdrawModal}
        />
      )}
    </div>
  );
};

export default withSnackbar(FarmingCard);
