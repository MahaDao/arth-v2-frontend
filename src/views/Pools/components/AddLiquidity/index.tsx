import { useWallet } from 'use-wallet';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';
import { BigNumber } from 'ethers/lib/ethers';
import { parseUnits } from 'ethers/lib/utils';
import React, { useState, useMemo } from 'react';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'

import Button from '../../../../components/Button';
import CustomModal from '../../../../components/CustomModal';
import TransparentInfoDiv from '../../../Stablize/components/InfoDiv';
import CustomInputContainer from '../../../../components/CustomInputContainer';
import { ValidateNumber } from '../../../../components/CustomInputContainer/RegexValidation';

import useCore from '../../../../hooks/useCore';
import useDFYNPrice from '../../../../hooks/useDFYNPrice';
import useTotalSupply from '../../../../hooks/useTotalSupply';
import useTokenBalance from '../../../../hooks/state/useTokenBalance';
import { getDisplayBalanceToken } from '../../../../utils/formatBalance';
import useAddLiquidity from '../../../../hooks/callbacks/pairs/useAddLiquidity';
import useApprove, { ApprovalState } from '../../../../hooks/callbacks/useApprove';
import usePairLiquidityMinted from '../../../../hooks/state/usePairLiquidityMinted';

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

const AddLiquidity = (props: props) => {
  const { selectedPair, onBack } = props;

  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [firstCoinValue, setFirstCoinValue] = useState<string>('0');
  const [secondCoinValue, setSecondCoinValue] = useState<string>('0');
  const [isInputFieldError, setIsInputFieldError] = useState<boolean>(false);

  const core = useCore();
  const { account } = useWallet();
  const { isLoading: isLPTotalSupplyLoading, value: lpTotalSupply } = useTotalSupply(selectedPair.pairToken);
  const { isLoading: isLpBalanceLoading, value: lpBalance } = useTokenBalance(core.tokens[selectedPair.pairToken]);

  const uniswapPrice = useDFYNPrice(
    core.tokens[selectedPair.symbol1],
    core.tokens[selectedPair.symbol2]
  );
  const { isLoading: isFirstCoinLoading, value: firstCoinBalance } = useTokenBalance(
    core.tokens[selectedPair.symbol1]
  );
  const { isLoading: isSecondCoinLoading, value: secondCoinBalance } = useTokenBalance(
    core.tokens[selectedPair.symbol2]
  );

  const [firstCoinApproveStatus, approveFirstCoin] = useApprove(
    core.tokens[selectedPair.symbol1],
    core.contracts.Router.address
  );
  const [secondCoinApproveStatus, approveSecondCoin] = useApprove(
    core.tokens[selectedPair.symbol2],
    core.contracts.Router.address
  );
  const { isLoading: isLiquidityMintedLoading, value: liquidityMinted } = usePairLiquidityMinted(
    core.tokens[selectedPair.symbol1],
    core.tokens[selectedPair.symbol2],
    BigNumber.from(parseUnits(`${firstCoinValue}`, 18)),
    BigNumber.from(parseUnits(`${secondCoinValue}`, 18)),
    selectedPair.pairToken
  );

  const [isYourShareLoading, yourShare] = useMemo(() => {
    if (isLiquidityMintedLoading || isLPTotalSupplyLoading || isLpBalanceLoading) return [true, BigNumber.from(0)];

    const newLPMintBN = BigNumber.from(parseUnits(`${Number(liquidityMinted)}`, 18));
    return [
      false,
      newLPMintBN
        .add(lpBalance)
        .mul(100)
        .div(lpTotalSupply.add(newLPMintBN))
    ];
  }, [
    liquidityMinted,
    isLpBalanceLoading,
    isLPTotalSupplyLoading,
    isLiquidityMintedLoading,
    lpTotalSupply,
    lpBalance
  ]);

  const addLiquidity = useAddLiquidity(
    core.tokens[selectedPair.symbol1].address,
    core.tokens[selectedPair.symbol2].address,
    BigNumber.from(parseUnits(`${firstCoinValue}`, 18)),
    BigNumber.from(parseUnits(`${secondCoinValue}`, 18)),
    account
  );

  const handleAddLiquidity = () => {
    addLiquidity(() => {
      setConfirmModal(false);
    });
  }

  const isFirstCoinApproving = firstCoinApproveStatus === ApprovalState.PENDING;
  const isFirstCoinApproved = firstCoinApproveStatus === ApprovalState.APPROVED;

  const isSecondCoinApproving = secondCoinApproveStatus === ApprovalState.PENDING;
  const isSecondCoinApproved = secondCoinApproveStatus === ApprovalState.APPROVED;

  const onFirstCoinValueChange = async (val: string) => {
    if (val === '' || uniswapPrice === '-' || isFirstCoinLoading || isSecondCoinLoading) {
      setFirstCoinValue('0');
      setSecondCoinValue('0');
      return;
    }

    const check: boolean = ValidateNumber(val);
    setFirstCoinValue(check ? val : String(Number(val)));
    if (!check) return;
    const valueInNumber: number = Number(val);
    if (!valueInNumber) return;

    const value = Number(val) / Number(uniswapPrice);
    setSecondCoinValue(`${value}`);
  }

  const onSecondCoinValueChange = async (val: string) => {
    if (val === '' || uniswapPrice === '-' || isFirstCoinLoading || isSecondCoinLoading) {
      setFirstCoinValue('0');
      setSecondCoinValue('0');
      return;
    }

    const check: boolean = ValidateNumber(val);
    setSecondCoinValue(check ? val : String(Number(val)));
    if (!check) return;
    const valueInNumber: number = Number(val);
    if (!valueInNumber) return;

    const value = Number(val) * Number(uniswapPrice);
    setFirstCoinValue(`${value}`);
  }

  const ConfirmModal = () => {
    return (
      <CustomModal
        closeButton
        handleClose={() => setConfirmModal(false)}
        open={confirmModal}
        modalTitleStyle={{}}
        modalContainerStyle={{}}
        modalBodyStyle={{}}
        title={`Confirm Supply`}>
        <>
          <TransparentInfoDiv
            labelData={`${selectedPair.symbol1} Deposit`}
            rightLabelUnit={selectedPair.symbol1}
            rightLabelValue={firstCoinValue.toString()}
          />
          <TransparentInfoDiv
            labelData={`${selectedPair.symbol2} Deposit`}
            rightLabelUnit={selectedPair.symbol2}
            rightLabelValue={secondCoinValue.toString()}
          />
          <TransparentInfoDiv
            labelData={`Your share of pool`}
            rightLabelValue={Number(yourShare.toString()).toLocaleString() + '%'}
            isLoadingData={isYourShareLoading}
          />
          <Divider style={{ background: 'rgba(255, 255, 255, 0.08)', margin: '15px 0px' }} />
          <TransparentInfoDiv
            labelData={`You receiving pool token`}
            rightLabelUnit={`${selectedPair.symbol1}/${selectedPair.symbol2}`}
            rightLabelValue={liquidityMinted}
            isLoadingData={isLiquidityMintedLoading}
          />
          <Grid container spacing={2} style={{ marginTop: '32px' }}>
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <Button
                variant={'transparent'}
                text="Cancel"
                size={'lg'}
                onClick={() => {
                  setConfirmModal(false)
                }}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <Button
                text={'Confirm Supply'}
                size={'lg'}
                onClick={handleAddLiquidity}
              />
            </Grid>
          </Grid>
        </>
      </CustomModal>
    )
  }

  return (
    <div>
      {ConfirmModal()}
      <CustomCard className={'custom-mahadao-container'}>
        <CustomCardHeader className={'custom-mahadao-container-header'}>
          <EachElementBack> <ArrowBackIos onClick={() => onBack()} fontSize="default" color={'inherit'} htmlColor={'#ffffff'} /> </EachElementBack>
          <EachElementTitle> <CardTitle> Add Liquidity </CardTitle></EachElementTitle>
        </CustomCardHeader>
        <CustomCardContainer className={'custom-mahadao-container-content'}>
          <CustomInputContainer
            ILabelValue={'Enter Amount'}
            IBalanceValue={getDisplayBalanceToken(firstCoinBalance, core.tokens[selectedPair.symbol1])}
            isBalanceLoading={isFirstCoinLoading}
            DefaultValue={firstCoinValue.toString()}
            LogoSymbol={selectedPair.symbol1}
            hasDropDown={false}
            SymbolText={selectedPair.symbol1}
            inputMode={'numeric'}
            setText={(val: string) => {
              onFirstCoinValueChange(val)
            }}
            tagText={'MAX'}
            disabled={isFirstCoinLoading}
            errorCallback={(flag: boolean) => {
              setIsInputFieldError(flag);
            }}
          />
          <PlusMinusArrow>
            +
          </PlusMinusArrow>
          <CustomInputContainer
            ILabelValue={'Enter Amount'}
            IBalanceValue={getDisplayBalanceToken(secondCoinBalance, core.tokens[selectedPair.symbol2])}
            isBalanceLoading={isSecondCoinLoading}
            DefaultValue={secondCoinValue.toString()}
            LogoSymbol={selectedPair.symbol2}
            hasDropDown={false}
            SymbolText={selectedPair.symbol2}
            inputMode={'numeric'}
            setText={(val: string) => {
              onSecondCoinValueChange(val)
            }}
            tagText={'MAX'}
            disabled={isSecondCoinLoading}
            errorCallback={(flag: boolean) => {
              setIsInputFieldError(flag);
            }}
          />
          <TcContainer>
            <OneLine style={{ marginTop: "10px" }}>
              <div style={{ flex: 1 }}>
                <TextWithIcon>
                  Price
                </TextWithIcon>
              </div>
              <OneLine>
                <BeforeChip>{uniswapPrice}</BeforeChip>
                <TagChips style={{ marginRight: '5px' }}>{selectedPair.symbol1}</TagChips>
                <BeforeChip>per</BeforeChip>
                <TagChips>{selectedPair.symbol2}</TagChips>
              </OneLine>
            </OneLine>
            <OneLine style={{ marginTop: "10px" }}>
              <div style={{ flex: 1 }}>
                <TextWithIcon>
                  Share of Pool
                </TextWithIcon>
              </div>
              <OneLine>
                <BeforeChip>
                  {
                    isYourShareLoading
                      ? ' - %'
                      : Number(yourShare.toString()).toLocaleString() + '%'
                  }
                </BeforeChip>
              </OneLine>
            </OneLine>
          </TcContainer>
          <ApproveButtonContainer>
            <Button
              text={
                isFirstCoinApproved
                  ? `Approved ${selectedPair.symbol1}`
                  : !isFirstCoinApproving
                    ? `Approve ${selectedPair.symbol1}`
                    : 'Approving...'
              }
              size={'lg'}
              disabled={
                isInputFieldError ||
                isFirstCoinApproved ||
                !Number(firstCoinValue)
              }
              onClick={approveFirstCoin}
              loading={isFirstCoinApproving}
            />
            <div style={{ padding: 5 }} />
            <Button
              text={
                isSecondCoinApproved
                  ? `Approved ${selectedPair.symbol2}`
                  : !isSecondCoinApproving
                    ? `Approve ${selectedPair.symbol2}`
                    : 'Approving...'
              }
              size={'lg'}
              disabled={
                isInputFieldError ||
                isSecondCoinApproved ||
                !Number(secondCoinValue)
              }
              onClick={approveSecondCoin}
              loading={isSecondCoinApproving}
            />
          </ApproveButtonContainer>
          <br />
          <Button
            text={'Supply'}
            size={'lg'}
            onClick={() => {
              setConfirmModal(true)
            }}
            disabled={
              isInputFieldError ||
              !isSecondCoinApproved ||
              !isSecondCoinApproved ||
              !Number(secondCoinValue) ||
              !Number(firstCoinValue)
            }
          />
        </CustomCardContainer>
      </CustomCard>
    </div>
  )
}

export default AddLiquidity;

const CustomCard = styled.div`
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
  flex: 0.25;
  cursor: pointer;
`;

const EachElementTitle = styled.div`
  flex: 0.5;
`;

const CustomCardContainer = styled.div`
`;

const CardTitle = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: rgba(255, 255, 255);
  margin: 0px;
`;

const PlusMinusArrow = styled.div`
  width: 100%;
  height: 32px;
  border-radius: 1.33px;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  font-size: 20px;
`;

const ApproveButtonContainer = styled.div`
  display: flex;
`;

const TcContainer = styled.div`
  margin-top: 18px;
  margin-bottom: 18px;
`;

const OneLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
`;

const TextWithIcon = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.88);
`;

const BeforeChip = styled.span`
  ont-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.64);
  margin-right: 5px;
`;

const TagChips = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 2px 8px;
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.64);
`;
