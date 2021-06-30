import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useCore from '../../../hooks/useCore';
import Grid from '@material-ui/core/Grid';
import Button from '../../../components/Button';
import arrowDown from '../../../assets/svg/arrowDown.svg';
import { Divider } from '@material-ui/core';
import CustomInputContainer from '../../../components/CustomInputContainer';
import CustomModal from '../../../components/CustomModal';
import { CustomSnack } from '../../../components/SnackBar';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import CustomToolTip from '../../../components/CustomTooltip';
import TransparentInfoDiv from '../../../components/CustomTransparentInfoDiv/InfoDiv';

const SellContent = (props: WithSnackbarProps) => {
  useEffect(() => window.scrollTo(0, 0), []);
  const core = useCore();

  const [sellAmount, setSellAmount] = useState<string>('0.00');
  const [sellReceive, setSellReceive] = useState<string>('0.00');

  const [openModal, setOpenModal] = useState<boolean>(false);

  const [selectedAmountCoin, setSelectedAmountCoin] = useState<string>('ETH');
  const [dropDownValues] = useState<string[]>(core.getCollateralTypes());

  // const isLaunched = Date.now() >= config.boardroomLaunchesAt.getTime();
  if (!core) return <div />;

  const ratio = 100;

  const onSellAmountChange = (val: string) => {
    if (val === '') {
      setSellReceive('0');
    }
    setSellAmount(val);
    const valInNumber = Number(val);
    if (valInNumber) {
      const temp = String(valInNumber * ratio);
      setSellReceive(temp);
    }
  }

  const onReceiveAmountChange = (val: string) => {
    if (val === '') {
      setSellAmount('0');
    }
    setSellReceive(val);
    const valInNumber = Number(val);
    if (valInNumber) {
      const temp = String(valInNumber * (1 / ratio));
      setSellAmount(temp);
    }
  }

  const sellConfirmModal = () => {
    return (
      <CustomModal
        closeButton
        handleClose={() => setOpenModal(false)}
        open={openModal}
        modalTitleStyle={{}}
        modalContainerStyle={{}}
        modalBodyStyle={{}}
        title={`Confirm Sell`}>
        <div>
          <TransparentInfoDiv
            labelData={`Your amount`}
            rightLabelUnit={'ARTH'}
            rightLabelValue={sellAmount.toString()}
          />
          <TransparentInfoDiv
            labelData={`Trading Fee`}
            rightLabelUnit={'5.87'}
            rightLabelValue={'ARTH'}
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
            rightLabelUnit={selectedAmountCoin}
            rightLabelValue={sellReceive.toString()}
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
                        data1: `Sell order for ${123} ARTH cancelled`,
                      }),
                  };
                  props.enqueueSnackbar('timepass', options);
                }}
              // onClick={handleClose}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Button
                text={'Confirm Sell'}
                // textStyles={{ color: '#F5F5F5' }}
                size={'lg'}
                onClick={() => {
                  setOpenModal(false);
                  let options = {
                    content: () =>
                      CustomSnack({
                        onClose: props.closeSnackbar,
                        type: 'green',
                        data1: `Selling ${sellAmount} ARTH`,
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
          IBalanceValue={'Balance 500.00'}
          ILabelInfoValue={''}
          DefaultValue={sellAmount.toString()}
          LogoSymbol={'ARTH'}
          hasDropDown={false}
          SymbolText={'ARTH'}
          inputMode={'decimal'}
          tagText={'MAX'}
          setText={(val: string) => {
            onSellAmountChange(val)
          }}
        />
        <PlusMinusArrow>
          <img src={arrowDown} />
        </PlusMinusArrow>
        <CustomInputContainer
          ILabelValue={'You receive'}
          IBalanceValue={'Balance 500.00'}
          // ILabelInfoValue={'How can i get it?'}
          DefaultValue={sellReceive.toString()}
          LogoSymbol={selectedAmountCoin}
          dropDownValues={dropDownValues}
          ondropDownValueChange={(data) => {
            setSelectedAmountCoin(data);
          }}
          hasDropDown={true}
          SymbolText={selectedAmountCoin}
          inputMode={'decimal'}
          setText={(val: string) => {
            onReceiveAmountChange(val)
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
            <OneLineInputwomargin style={{ marginTop: '12px' }}>
              <div style={{ flex: 1 }}>
                <TextWithIcon>Price</TextWithIcon>
              </div>
              <OneLineInputwomargin>
                <BeforeChip>0.05</BeforeChip>
                <TagChips>ARTH</TagChips>
                <BeforeChip>per</BeforeChip>
                <TagChips>ETH</TagChips>
              </OneLineInputwomargin>
            </OneLineInputwomargin>
            <OneLineInputwomargin style={{ marginTop: '10px' }}>
              <div style={{ flex: 1 }}>
                <TextWithIcon>
                  Trading fee
                  <CustomToolTip toolTipText={'loreum ipsum'} />
                </TextWithIcon>
              </div>
              <OneLineInputwomargin>
                <BeforeChip>0.05</BeforeChip>
                <TagChips>ARTH</TagChips>
              </OneLineInputwomargin>
            </OneLineInputwomargin>
          </TcContainer>
          <div style={{marginTop: '32px'}}>
            <Button text={'Sell'} size={'lg'} onClick={() => setOpenModal(true)} />
          </div>
        </div>
      </LeftTopCardContainer>
      {sellConfirmModal()}
    </div>
  );
};

const TcContainer = styled.div`
  margin-top: 24px;
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

export default withSnackbar(SellContent);
