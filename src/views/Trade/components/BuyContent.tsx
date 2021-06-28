import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Button from '../../../components/Button';
import arrowDown from '../../../assets/svg/arrowDown.svg';
import { Divider } from '@material-ui/core';
import TransparentInfoDiv from './InfoDiv';
import CustomInputContainer from '../../../components/CustomInputContainer';
import CustomModal from '../../../components/CustomModal';
import { CustomSnack } from '../../../components/SnackBar';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import useCore from '../../../hooks/useCore';
import { useWallet } from 'use-wallet';
import useTokenBalance from '../../../hooks/state/useTokenBalance';
import { getDisplayBalanceToken } from '../../../utils/formatBalance';

const BuyContent = (props: WithSnackbarProps) => {
  useEffect(() => window.scrollTo(0, 0), []);

  const core = useCore();
  const { account, connect } = useWallet();
  const collateralTypes = useMemo(() => core.getCollateralTypes(), [core]);
  const [isInputFieldError, setIsInputFieldError] = useState<boolean>(false);

  const [buyAmount, setBuyAmount] = useState<string>('0');
  const [receiveAmount, setReceiveAmount] = useState<string>('0');

  const [openModal, setOpenModal] = useState<boolean>(false);

  const [selectedAmountCoin, setSelectedAmountCoin] = useState(core.getDefaultCollateral());

  const selectedAmountToken = core.tokens[selectedAmountCoin];
  const receivetoken = core.tokens['ARTH'];

  //Balance
  const { isLoading: isBuyAmountBalanceLoading, value: buyAmountBalance } = useTokenBalance(
    core.tokens[selectedAmountCoin],
  );

  const { isLoading: isReceiveAmountBalanceLoading, value: receiveAmountBalance } = useTokenBalance(
    core.tokens['ARTH'],
  );

  const ratio = 100;

  const onBuyAmountChange = (val: string) => {
    if (val === ''){
      setReceiveAmount('0');
    }
    setBuyAmount(val);
    const valInNumber = Number(val);
    if (valInNumber){
      const temp = String(valInNumber * ratio);
      setReceiveAmount(temp);
    }
  }

  const onReceiveAmountChange = (val: string) => {
    if (val === ''){
      setBuyAmount('0');
    }
    setReceiveAmount(val);
    const valInNumber = Number(val);
    if (valInNumber){
      const temp = String(valInNumber * (1 / ratio));
      setBuyAmount(temp);
    }
  }

  const BuyConfirmModal = () => {
    return (
      <CustomModal
        closeButton
        handleClose={() => setOpenModal(false)}
        open={openModal}
        modalTitleStyle={{}}
        modalContainerStyle={{}}
        modalBodyStyle={{}}
        title={`Confirm Buy`}>
        <div>
          <TransparentInfoDiv
            labelData={`Your amount`}
            rightLabelUnit={selectedAmountCoin}
            rightLabelValue={buyAmount.toString()}
          />

          <Divider
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              margin: '15px 0px',
            }}
          />

          <TransparentInfoDiv
            labelData={`You will receive`}
            // labelToolTipData={'testing'}
            rightLabelUnit={'ARTH'}
            rightLabelValue={receiveAmount.toString()}
          />

          <Grid container spacing={2} style={{ marginTop: '32px' }}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Button
                variant={'transparent'}
                text="Cancel"
                size={'lg'}
                onClick={() => {
                  setOpenModal(false);
                  let options = {
                    content: () =>
                      CustomSnack({
                        onClose: props.closeSnackbar,
                        type: 'red',
                        data1: `Buy order for ${123} ARTH cancelled`,
                      }),
                  };
                  props.enqueueSnackbar('timepass', options);
                }}
                // onClick={handleClose}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Button
                text={'Confirm Buy'}
                // textStyles={{ color: '#F5F5F5' }}
                size={'lg'}
                onClick={() => {
                  setOpenModal(false);
                  let options = {
                    content: () =>
                      CustomSnack({
                        onClose: props.closeSnackbar,
                        type: 'green',
                        data1: `Buying ${buyAmount} ${selectedAmountCoin}`,
                      }),
                  };
                  props.enqueueSnackbar('timepass', options);
                }}
              />
            </Grid>
          </Grid>
        </div>
      </CustomModal>
    )
  }

  return (
    <div>
      <LeftTopCardContainer className={'custom-mahadao-container-content'}>
        <CustomInputContainer
          ILabelValue={'Enter Amount'}
          IBalanceValue={getDisplayBalanceToken(buyAmountBalance, selectedAmountToken)}
          isBalanceLoading={isBuyAmountBalanceLoading}
          DefaultValue={buyAmount.toString()}
          LogoSymbol={selectedAmountCoin}
          hasDropDown={true}
          dropDownValues={collateralTypes}
          ondropDownValueChange={(data) => {
            setSelectedAmountCoin(data);
          }}
          SymbolText={selectedAmountCoin}
          inputMode={'numeric'}
          setText={(val: string) => {
            onBuyAmountChange(val);
          }}
          tagText={'MAX'}
          disabled={isBuyAmountBalanceLoading}
          errorCallback={(flag: boolean) => {
            setIsInputFieldError(flag);
          }}
        />
        <PlusMinusArrow>
          <img src={arrowDown} />
        </PlusMinusArrow>
        <CustomInputContainer
          ILabelValue={'You receive'}
          IBalanceValue={getDisplayBalanceToken(receiveAmountBalance, receivetoken)}
          isBalanceLoading={isReceiveAmountBalanceLoading}
          ILabelInfoValue={''}
          DefaultValue={receiveAmount.toString()}
          LogoSymbol={'ARTH'}
          hasDropDown={false}
          SymbolText={'ARTH'}
          inputMode={'decimal'}
          setText={(val: string) => {
            onReceiveAmountChange(val);
          }}
          disabled={isReceiveAmountBalanceLoading}
          errorCallback={(flag: boolean) => {
            setIsInputFieldError(flag);
          }}
        />
        <div>
          <TcContainer>
            <OneLineInputwomargin>
              <div style={{ flex: 1 }}>
                <TextWithIcon>Liquidity on Uniswap</TextWithIcon>
              </div>
              <OneLineInputwomargin>
                <BeforeChip>$ 9,760,068</BeforeChip>
              </OneLineInputwomargin>
            </OneLineInputwomargin>
            <OneLineInputwomargin style={{ marginTop: '10px' }}>
              <div style={{ flex: 1 }}>
                <TextWithIcon>Price</TextWithIcon>
              </div>
              <OneLineInputwomargin>
                <BeforeChip>0.05</BeforeChip>
                <TagChips style={{ marginRight: '4px' }}>ARTH</TagChips>
                <BeforeChip>per</BeforeChip>
                <TagChips>ETH</TagChips>
              </OneLineInputwomargin>
            </OneLineInputwomargin>
          </TcContainer>
          <Button
            text={'Buy'}
            size={'lg'}
            variant={'default'}
            disabled={false}
            onClick={() => setOpenModal(true)}
          />
        </div>
      </LeftTopCardContainer>
      {BuyConfirmModal()}
    </div>
  );
};


const TcContainer = styled.div`
  margin-top: 18px;
  margin-bottom: 18px;
`;

const OneLineInputwomargin = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
`;

const LeftTopCardContainer = styled.div``;
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

export default withSnackbar(BuyContent);
