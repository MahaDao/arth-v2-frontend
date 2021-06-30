import { BigNumber } from 'ethers';
import { useWallet } from 'use-wallet';
import styled from 'styled-components';
import { parseUnits } from 'ethers/lib/utils';
import React, { useMemo, useState } from 'react';
import { Divider, Grid } from '@material-ui/core';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';

import plus from '../../../../assets/svg/plus.svg';
import arrowDown from '../../../../assets/svg/arrowDown.svg';

import Button from '../../../../components/Button';
import CustomModal from '../../../../components/CustomModal';
import CustomInputContainer from '../../../../components/CustomInputContainer';

import useCore from '../../../../hooks/useCore';
import useDFYNPrice from '../../../../hooks/useDFYNPrice';
import useTotalSupply from '../../../../hooks/useTotalSupply';
import useTokenBalance from '../../../../hooks/state/useTokenBalance';
import { getDisplayBalanceToken } from '../../../../utils/formatBalance';
import useTokenBalanceOf from '../../../../hooks/state/useTokenBalanceOf';
import useApprove, { ApprovalState } from '../../../../hooks/callbacks/useApprove';
import useRemoveLiquidity from '../../../../hooks/callbacks/pairs/useRemoveLiquidity';
import { ValidateNumber } from '../../../../components/CustomInputContainer/RegexValidation';
import SlippageContainer from '../../../../components/SlippageContainer';
import TransparentInfoDiv from '../../../../components/CustomTransparentInfoDiv/InfoDiv';

interface SelectedPair {
  id: number;
  symbol1: string;
  symbol2: string;
  pairName: string;
  pairToken: string;
}

type props = {
  selectedPair: SelectedPair;
  onBack: () => void;
};

const RemovePool = (props: props) => {
  const { selectedPair, onBack } = props;

  const [pairValue, setPairValue] = useState<string>('0');
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [isInputFieldError, setIsInputFieldError] = useState<boolean>(false);

  const core = useCore();
  const { account } = useWallet();

  const lpToken = core.tokens[selectedPair.pairToken];
  const firstToken = core.tokens[selectedPair.symbol1];
  const secondToken = core.tokens[selectedPair.symbol2];

  const uniswapPrice = useDFYNPrice(
    core.tokens[selectedPair.symbol1],
    core.tokens[selectedPair.symbol2]
  );

  const [lpTokenApproveStatus, approveLpToken] = useApprove(
    core.tokens[selectedPair.pairToken],
    core.contracts.Router.address
  );

  const { isLoading: isLPBalanceLoading, value: lpBalance } = useTokenBalance(lpToken);
  const { isLoading: isFirstCoinLoading, value: firstCoinBalance } = useTokenBalance(firstToken);
  const { isLoading: isSecondCoinLoading, value: secondCoinBalance } = useTokenBalance(secondToken);
  const { isLoading: isTotalSupplyLoading, value: totalSupply } = useTotalSupply(selectedPair.pairToken);

  const { isLoading: isPairFirstCoinBalanceLoading, value: firstCoinPairBalance } = useTokenBalanceOf(
    firstToken,
    lpToken.address
  );
  const { isLoading: isPairSecondCoinBalanceLoading, value: secondCoinPairBalance } = useTokenBalanceOf(
    secondToken,
    lpToken.address
  );

  const [isFirstCoinValueLoading, firstCoinValue] = useMemo(() => {
    if (isTotalSupplyLoading || isPairFirstCoinBalanceLoading)
      return [true, BigNumber.from(0)];

    if (pairValue === '' || !Number(pairValue)) return [false, BigNumber.from(0)];

    const bnPairValue = BigNumber.from(parseUnits(`${pairValue}`, 18));
    return [
      false,
      bnPairValue.mul(firstCoinPairBalance).div(totalSupply)
    ];
  }, [
    isTotalSupplyLoading,
    pairValue,
    firstCoinPairBalance,
    isPairFirstCoinBalanceLoading,
    totalSupply
  ]);

  const [isSecondCoinValueLoading, secondCoinValue] = useMemo(() => {
    if (isTotalSupplyLoading || isPairSecondCoinBalanceLoading)
      return [true, BigNumber.from(0)];

    if (pairValue === '' || !Number(pairValue)) return [false, BigNumber.from(0)];

    const bnPairValue = BigNumber.from(parseUnits(`${pairValue}`, 18));
    return [
      false,
      bnPairValue.mul(secondCoinPairBalance).div(totalSupply)
    ];
  }, [
    isTotalSupplyLoading,
    pairValue,
    secondCoinPairBalance,
    isPairSecondCoinBalanceLoading,
    totalSupply
  ]);

  const removeLiquidity = useRemoveLiquidity(
    core.tokens[selectedPair.symbol1].address,
    core.tokens[selectedPair.symbol2].address,
    BigNumber.from(parseUnits(`${pairValue}`, 18)),
    firstCoinValue,
    secondCoinValue,
    account
  );

  const handleRemoveLiquidity = () => {
    removeLiquidity(() => {
      setConfirmModal(false);
    });
  }

  const isLpTokenApproving = lpTokenApproveStatus === ApprovalState.PENDING;
  const isLpTokenApproved = lpTokenApproveStatus === ApprovalState.APPROVED;

  const detailed = () => {
    return (
      <div>
        <div>
          <OneLineInput>
            <div>
              <InputLabel>How much liquidity you want to remove?</InputLabel>
            </div>
          </OneLineInput>
        </div>
        <CustomInputContainer
          ILabelValue={'Enter Token Amount'}
          IBalanceValue={getDisplayBalanceToken(lpBalance, lpToken)}
          isBalanceLoading={isLPBalanceLoading}
          DefaultValue={pairValue.toString()}
          LogoSymbol={''}
          hasDropDown={false}
          multiIcons
          symbols={[selectedPair.symbol1, selectedPair.symbol2]}
          SymbolText={`${selectedPair.symbol1}-${selectedPair.symbol2}`}
          inputMode={'numeric'}
          setText={(val: string) => {
            setPairValue(ValidateNumber(val) ? val : '0');
          }}
          disabled={isLPBalanceLoading}
          errorCallback={(flag: boolean) => {
            setIsInputFieldError(flag);
          }}
          tokenDecimals={18}
        />
        <PlusMinusArrow>
          <img src={arrowDown} alt="arrow-down" />
        </PlusMinusArrow>
        <CustomInputContainer
          ILabelValue={'You Receive'}
          IBalanceValue={getDisplayBalanceToken(firstCoinBalance, firstToken)}
          isBalanceLoading={isFirstCoinLoading}
          DefaultValue={getDisplayBalanceToken(firstCoinValue, firstToken)}
          LogoSymbol={selectedPair.symbol1}
          hasDropDown={false}
          SymbolText={selectedPair.symbol1.toUpperCase()}
          inputMode={'numeric'}
          disabled={true}
          tokenDecimals={18}
        />
        <PlusMinusArrow>
          <img src={plus} alt="plus" />
        </PlusMinusArrow>
        <CustomInputContainer
          ILabelValue={'Enter Amount'}
          IBalanceValue={getDisplayBalanceToken(secondCoinBalance, secondToken)}
          isBalanceLoading={isSecondCoinLoading}
          DefaultValue={getDisplayBalanceToken(secondCoinValue, secondToken)}
          LogoSymbol={selectedPair.symbol2}
          hasDropDown={false}
          SymbolText={selectedPair.symbol2.toUpperCase()}
          inputMode={'numeric'}
          disabled={true}
          tokenDecimals={18}
        />
        <OneLine style={{ marginTop: '15px' }}>
          <div style={{ flex: 1 }}>
            <TextWithIcon>Price</TextWithIcon>
          </div>
          <OneLine>
            <BeforeChip>{uniswapPrice}</BeforeChip>
            <TagChips style={{ marginRight: '5px' }}>{selectedPair.symbol1}</TagChips>
            <BeforeChip>per</BeforeChip>
            <TagChips>{selectedPair.symbol2}</TagChips>
          </OneLine>
        </OneLine>
      </div>
    );
  };

  return (
    <div>
      <CustomModal
        closeButton
        handleClose={() => setConfirmModal(false)}
        open={confirmModal}
        modalTitleStyle={{}}
        modalContainerStyle={{}}
        modalBodyStyle={{}}
        title={`Confirm Remove Liquidity`}
      >
        <>
          <TransparentInfoDiv
            labelData={`You will receive ${selectedPair.symbol1.toUpperCase()}`}
            rightLabelUnit={selectedPair.symbol1.toUpperCase()}
            rightLabelValue={getDisplayBalanceToken(firstCoinValue, firstToken)}
          />
          <TransparentInfoDiv
            labelData={`You will receive  ${selectedPair.symbol2.toUpperCase()}`}
            rightLabelUnit={selectedPair.symbol2.toUpperCase()}
            rightLabelValue={getDisplayBalanceToken(secondCoinValue, secondToken)}
          />

          <Divider style={{ background: 'rgba(255, 255, 255, 0.08)', margin: '15px 0px' }} />

          <TransparentInfoDiv
            labelData={`${selectedPair.symbol1.toUpperCase()}/${selectedPair.symbol2.toUpperCase()} LP Token Burned`}
            rightLabelUnit={`${selectedPair.symbol1.toUpperCase()}/${selectedPair.symbol2.toUpperCase()}`}
            rightLabelValue={Number(pairValue).toLocaleString()}
          />
          <Grid container spacing={2} style={{ marginTop: '32px' }}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Button
                variant={'transparent'}
                text="Cancel"
                size={'lg'}
                onClick={() => {
                  setConfirmModal(false);
                }}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Button
                text={'Remove Liquidity'}
                size={'lg'}
                onClick={handleRemoveLiquidity}
              />
            </Grid>
          </Grid>
        </>
      </CustomModal>
      <CustomCard className={'custom-mahadao-container'}>
        <CustomCardHeader className={'custom-mahadao-container-header'}>
          <EachElementBack> <ArrowBackIos onClick={() => onBack()} fontSize="default" color={'inherit'} htmlColor={'#ffffff'} /> </EachElementBack>
          <EachElementTitle> <CardTitle>Remove Liquidity</CardTitle> </EachElementTitle>
          <EachElementBack> <SlippageContainer /> </EachElementBack>
        </CustomCardHeader>
        <CustomCardContainer className={'custom-mahadao-container-content'}>
          {detailed()}
          <Grid container spacing={2} style={{ marginTop: '32px' }}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Button
                text={
                  isLpTokenApproved
                    ? `Approved`
                    : !isLpTokenApproving
                      ? `Approve`
                      : 'Approving...'
                }
                size={'lg'}
                disabled={
                  isInputFieldError ||
                  isLpTokenApproved ||
                  !Number(pairValue)
                }
                onClick={approveLpToken}
                loading={isLpTokenApproving}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Button
                onClick={() => setConfirmModal(true)}
                text={'Remove Liquidity'}
                size={'lg'}
                disabled={
                  isInputFieldError ||
                  !isLpTokenApproved ||
                  !Number(pairValue)
                }
              />
            </Grid>
          </Grid>
        </CustomCardContainer>
      </CustomCard>
      {/* <CustomInfoCard className={'custom-mahadao-box'}>
        <CustomInfoCardHeader>Your Position</CustomInfoCardHeader>
        <CustomInfoCardDetails>
          <OneLine>
            <div style={{ flex: 1 }}>
              <TextWithIcon> Your total pool tokens </TextWithIcon>
            </div>
            <OneLine>
              <BeforeChip>{''}</BeforeChip>
              <TagChips>ARTH / ETH </TagChips>
            </OneLine>
          </OneLine>
          <OneLine>
            <div style={{ flex: 1 }}>
              <TextWithIcon> Pooled ARTH </TextWithIcon>
            </div>
            <OneLine>
              <BeforeChip>{''}</BeforeChip>
              <TagChips>ARTH</TagChips>
            </OneLine>
          </OneLine>
          <OneLine>
            <div style={{ flex: 1 }}>
              <TextWithIcon>Pooled ETH</TextWithIcon>
            </div>
            <OneLine>
              <BeforeChip>{''}</BeforeChip>
              <TagChips>ETH</TagChips>
            </OneLine>
          </OneLine>
          <OneLine>
            <div style={{ flex: 1 }}>
              <TextWithIcon>Your pool share</TextWithIcon>
            </div>
            <OneLine>
              <BeforeChip>{''}%</BeforeChip>
              <TagChips>0.06%</TagChips>
            </OneLine>
          </OneLine>
        </CustomInfoCardDetails>
      </CustomInfoCard> */}
    </div>
  );
};

export default RemovePool;

const CustomCard = styled.div`
  background: linear-gradient(180deg, #48423e 0%, #373030 100%);
  border-radius: 12px;
  margin-top: 12px;
`;

const CustomCardHeader = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 28px;
  padding-bottom: 28px;
  align-items: center;
  align-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  @media (max-width: 600px) {
    padding-top: 24px;
    padding-bottom: 24px;
  }
`;

const EachElementBack = styled.div`
  cursor: pointer;
`;

const EachElementTitle = styled.div`
  flex: 1;
`;

const OneLineInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
  margin: 0 0 10px 0;
`;
const InputLabel = styled.p`
  font-family: Inter, serif;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.64);
  margin: 0;
`;

const CustomCardContainer = styled.div`
  padding: 32px 32px;
  @media (max-width: 600px) {
    padding: 16px 16px;
  }
`;

const ButtonContainer = styled.div`
  margin: 15px 0 0 0;
  display: flex;
  flex-direction: row;
  @media (max-width: 600px) {
    flex-direction: column;
  }
  justify-content: space-between;
`;

const CardTitle = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: rgba(255, 255, 255);
  margin: 0;
`;

const PlusMinusArrow = styled.div`
  width: 100%;
  height: 30px;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  font-size: 20px;
`;

const CustomInfoCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(21px);
  border-radius: 12px;
  padding: 32px;
  margin-top: 20px;
  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const CustomInfoCardHeader = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.88);
  margin: 0;
`;

const CustomInfoCardDetails = styled.div`
  margin: 10px 0;
`;

const OneLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.64);
  margin: 5px 0;
`;

const TextWithIcon = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.64);
`;

const BeforeChip = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: right;
  color: rgba(255, 255, 255, 0.88);
  margin-right: 5px;
`;

const TagChips = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 2px 8px;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.64);
`;
