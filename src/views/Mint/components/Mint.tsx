import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import Grid from '@material-ui/core/Grid';
import { parseUnits } from 'ethers/lib/utils';
import { BigNumber } from '@ethersproject/bignumber';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import React, { useEffect, useMemo, useState } from 'react';
import Loader from 'react-spinners/BeatLoader';

import arrowDown from '../../../assets/svg/arrowDown.svg';
import plusSign from '../../../assets/svg/plus.svg';

import PoolInfo from './PoolInfo';
import MintModal from './MintModal';
import Button from '../../../components/Button';
import SlippageContainer from '../../../components/SlippageContainer';
import CustomSuccessModal from '../../../components/CustomSuccesModal';
import CustomInputContainer from '../../../components/CustomInputContainer';
import { ValidateNumber } from '../../../components/CustomInputContainer/RegexValidation';

import useCore from '../../../hooks/useCore';
import useTokenDecimals from '../../../hooks/useTokenDecimals';
import { getDisplayBalance } from '../../../utils/formatBalance';
import useTokenBalance from '../../../hooks/state/useTokenBalance';
import useARTHXPrice from '../../../hooks/state/controller/useARTHXPrice';
import usePoolMintingFees from '../../../hooks/state/pools/usePoolMintingFees';
import useApprove, { ApprovalState } from '../../../hooks/callbacks/useApprove';
import useCollateralPoolPrice from '../../../hooks/state/pools/useCollateralPoolPrice';

interface IProps {
  setType: (type: 'mint' | 'redeem') => void;
}

const MintTabContent = (props: WithSnackbarProps & IProps) => {
  const [collateralValue, setCollateralValue] = useState<string>('0');
  const [arthValue, setArthValue] = useState<string>('0');
  const [arthxValue, setArthxValue] = useState<string>('0');

  const [openModal, setOpenModal] = useState<0 | 1 | 2>(0);
  const [successModal, setSuccessModal] = useState<boolean>(false);

  const [isInputFieldError, setIsInputFieldError] = useState<boolean>(false);

  const { account, connect } = useWallet();
  const mintCR = BigNumber.from(11e5);

  const core = useCore();
  const { isLoading: isarthBalanceLoading, value: arthBalance } = useTokenBalance(core.ARTH);
  const { isLoading: isarthxBalanceLoading, value: arthxBalance } = useTokenBalance(core.ARTHX);

  const collateralTypes = useMemo(() => core.getCollateralTypes(), [core]);

  const [selectedCollateralCoin, setSelectedCollateralCoin] = useState(core.getDefaultCollateral(),);
  const { isLoading: iscollateralBalanceLoading, value: collateralBalance } = useTokenBalance(core.tokens[selectedCollateralCoin]);
  const { isLoading: ismintingFeeLoading, value: mintingFee } = usePoolMintingFees(selectedCollateralCoin);
  const { isLoading: iscollateralToGMUPriceLoading, value: collateralToGMUPrice } = useCollateralPoolPrice(selectedCollateralCoin);
  const { isLoading: isarthxPriceLoading, value: arthxPrice } = useARTHXPrice();
  const tokenDecimals  = useTokenDecimals(selectedCollateralCoin);

  const collateralPool = core.getCollatearalPool(selectedCollateralCoin);

  const [collatApproveStatus, approveCollat] = useApprove(
    core.tokens[selectedCollateralCoin],
    collateralPool.address,
  );

  const arthxRatio = useMemo(() => {
    return mintCR.sub(BigNumber.from(1e6));
  }, [mintCR]);

  const arthRatio = useMemo(() => {
    return BigNumber.from(1e6).sub(arthxRatio)
  }, [arthxRatio]);

  useEffect(() => window.scrollTo(0, 0), []);

  const isWalletConnected = !!account;
  const isCollatApproved = collatApproveStatus === ApprovalState.APPROVED;
  const isCollatApproving = collatApproveStatus === ApprovalState.PENDING;

  const [isTradingFeeLoading, tradingFee] = useMemo(() => {
    if (ismintingFeeLoading) return [true, BigNumber.from(0)]
    if (mintingFee.lte(0)) return [false, BigNumber.from(0)];

    return [
      false,
      BigNumber
      .from(parseUnits(`${arthValue}`, 18))
      .mul(mintingFee)
      .div(1e6)
    ];
  }, [arthValue, mintingFee, ismintingFeeLoading]);

  const onCollateralValueChange = async (val: string) => {
    if (val === '' || arthxPrice.lte(0) || isarthxPriceLoading || iscollateralToGMUPriceLoading) {
      setCollateralValue('0');
      setArthValue('0');
      setArthxValue('0');
      return;
    }

    const check: boolean = ValidateNumber(val);
    setCollateralValue(check ? val : String(Number(val)));
    if (!check) return;
    const valueInNumber: number = Number(val);
    if (!valueInNumber) return;

    const bnCollateralAmount = BigNumber.from(
      parseUnits(`${valueInNumber}`, tokenDecimals)
    );
    const bnMissingDecimals = BigNumber.from(10).pow(18 - tokenDecimals);

    const totalCollateralValue = collateralToGMUPrice
      .mul(bnCollateralAmount)
      .mul(bnMissingDecimals)
      .div(1e6);

    const finalArthValue = totalCollateralValue
      .mul(arthRatio)
      .div(1e6)

    const finalArthxValue = totalCollateralValue
      .mul(arthxRatio)
      .mul(1e6)
      .div(1e6)
      .div(arthxPrice); 

    setArthValue(getDisplayBalance(finalArthValue, 18, tokenDecimals));
    setArthxValue(getDisplayBalance(finalArthxValue, 18, tokenDecimals));
  };

  const onARTHValueChange = async (val: string) => {
    if (val === '' || collateralToGMUPrice.lte(0) || arthxPrice.lte(0) || arthRatio.lte(0) || isarthxPriceLoading || iscollateralToGMUPriceLoading) {
      setCollateralValue('0');
      setArthValue('0');
      setArthxValue('0');
      return;
    }

    let check: boolean = ValidateNumber(val);
    setArthValue(check ? val : String(Number(val)));
    if (!check) return;
    const valueInNumber: number = Number(val);
    if (!valueInNumber) return;

    const bnArthValue = BigNumber.from(parseUnits(`${valueInNumber}`, 18));
    const bnMissingDecimals = BigNumber.from(10).pow(18 - tokenDecimals);
    
    const finalCollateralValueD18 = bnArthValue
      .mul(1e6)
      .div(arthRatio);

    const finalArthxValue = finalCollateralValueD18
      .sub(bnArthValue)
      .mul(1e6)
      .div(arthxPrice);

    const finalCollateralValue = finalCollateralValueD18
      .mul(1e6)
      .div(collateralToGMUPrice)
      .div(bnMissingDecimals);

    setArthxValue(getDisplayBalance(finalArthxValue, 18, tokenDecimals));
    setCollateralValue(getDisplayBalance(finalCollateralValue, tokenDecimals, tokenDecimals));
  };

  const onARTHXValueChange = async (val: string) => {
    if (val === '' || collateralToGMUPrice.lte(0) || arthxRatio.lte(0) || isarthxPriceLoading || iscollateralToGMUPriceLoading) {
      setCollateralValue('0');
      setArthValue('0');
      setArthxValue('0');
      return;
    }

    let check: boolean = ValidateNumber(val);
    setArthxValue(check ? val : String(Number(val)));
    if (!check) return;
    const valueInNumber: number = Number(val);
    if (!valueInNumber) return;

    const bnArthxValue = BigNumber.from(parseUnits(`${valueInNumber}`, 18));
    const bnMissingDecimals = BigNumber.from(10).pow(18 - tokenDecimals);
    const bnARTHXGMUValue = bnArthxValue.mul(arthxPrice).div(1e6);
    
    const finalCollateralValueD18 = bnARTHXGMUValue
      .mul(1e6)
      .div(arthxRatio);

    const finalArthValue = finalCollateralValueD18.sub(bnARTHXGMUValue)

    const finalCollateralValue = finalCollateralValueD18
      .mul(1e6)
      .div(collateralToGMUPrice)
      .div(bnMissingDecimals);

    setArthValue(getDisplayBalance(finalArthValue, 18, tokenDecimals));
    setCollateralValue(getDisplayBalance(finalCollateralValue, tokenDecimals, tokenDecimals));
  };

  return (
    <>
      <MintModal
        mintCR={mintCR}
        isInputFieldError={isInputFieldError}
        collateralValue={collateralValue}
        selectedCollateralCoin={selectedCollateralCoin}
        arthValue={arthValue}
        arthxValue={arthxValue}
        openModal={openModal}
        tradingFee={tradingFee}
        onClose={() => setOpenModal(0)}
        onSuccess={() => {
          onCollateralValueChange('')
          setOpenModal(0)
        }}
      />
      <Grid container style={{ marginTop: '24px' }} spacing={2}>
        <Grid item lg={1} />
        <Grid item lg={5} md={12} sm={12} xs={12}>
          <LeftTopCard className={'custom-mahadao-container'}>
            <LeftTopCardHeader className={'custom-mahadao-container-header'}>
              <div style={{ display: 'flex' }}>
                <TabContainer onClick={() => props.setType('mint')}>
                  <ActiveTab />
                  <TabTextActive>Mint</TabTextActive>
                </TabContainer>
                <TabContainer onClick={() => props.setType('redeem')}>
                  <TabText>Redeem</TabText>
                </TabContainer>
              </div>
              <SlippageContainer />
            </LeftTopCardHeader>
            <LeftTopCardContainer className={'custom-mahadao-container-content'}>
              <CustomInputContainer
                ILabelValue={'Enter Collateral'}
                IBalanceValue={`${getDisplayBalance(collateralBalance, tokenDecimals)}`}
                isBalanceLoading={iscollateralBalanceLoading}
                ILabelInfoValue={''}
                disabled={mintCR.lte(1e6) || iscollateralBalanceLoading || iscollateralToGMUPriceLoading}
                DefaultValue={collateralValue.toString()}
                LogoSymbol={selectedCollateralCoin}
                hasDropDown={true}
                dropDownValues={collateralTypes}
                ondropDownValueChange={(data: string) => {
                  setSelectedCollateralCoin(data);
                  // setTimeout(() => {
                  //   onCollateralValueChange(collateralValue.toString());
                  // }, 1000);
                }}
                DisableMsg={
                  mintCR.lte(1e6)
                    ? 'Currently Mint Collateral ratio is not 100%'
                    : ''
                }
                SymbolText={selectedCollateralCoin}
                inputMode={'numeric'}
                setText={(val: string) => {
                  onCollateralValueChange(val);
                }}
                tagText={'MAX'}
                errorCallback={(flag: boolean) => { setIsInputFieldError(flag) }}
                tokenDecimals={tokenDecimals}
              />
              <PlusMinusArrow>
                <img src={arrowDown} alt="arrow" />
              </PlusMinusArrow>
              <CustomInputContainer
                ILabelValue={'You will receive'}
                IBalanceValue={`${getDisplayBalance(arthBalance)}`}
                isBalanceLoading={isarthBalanceLoading}
                DefaultValue={arthValue.toString()}
                ILabelInfoValue={''}
                LogoSymbol={'ARTH'}
                disabled={mintCR.lte(1e6) || isarthBalanceLoading}
                hasDropDown={false}
                SymbolText={'ARTH'}
                setText={(val: string) => {
                  onARTHValueChange(val);
                }}
                DisableMsg={
                  mintCR.lte(1e6)
                    ? 'Currently Mint Collateral ratio is not 100%'
                    : ''
                }
                tokenDecimals={18}
              />
              <PlusMinusArrow>
                <img src={plusSign} alt="plus" />
              </PlusMinusArrow>
              <CustomInputContainer
                ILabelValue={'You receive'}
                IBalanceValue={`${getDisplayBalance(arthxBalance)}`}
                isBalanceLoading={isarthxBalanceLoading}
                DefaultValue={arthxValue.toString()}
                LogoSymbol={'ARTHX'}
                ILabelInfoValue={"How can I get it ?"}
                disabled={mintCR.lte(1e6) || isarthxBalanceLoading || isarthxPriceLoading}
                hasDropDown={false}
                SymbolText={'ARTHX'}
                setText={(val: string) => {
                  onARTHXValueChange(val);
                }}
                DisableMsg={
                  mintCR.lte(1e6)
                    ? 'Currently Mint Collateral ratio is not 100%'
                    : ''
                }
                tokenDecimals={18}
              />
              <div>
                <TcContainer>
                  <OneLineInputwomargin>
                    <div style={{ flex: 1 }}>
                      <TextWithIcon>
                        Trading Fee
                      </TextWithIcon>
                    </div>
                    <OneLineInputwomargin>
                      <BeforeChip>
                        {
                          isTradingFeeLoading
                            ? <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
                            : Number(getDisplayBalance(tradingFee, 18, 6))
                              .toLocaleString('en-US', {maximumFractionDigits: 6})
                        }
                      </BeforeChip>
                      <TagChips>ARTH</TagChips>
                    </OneLineInputwomargin>
                  </OneLineInputwomargin>
                </TcContainer>
                <div style={{ marginTop: '32px' }}>
                  {
                    !isWalletConnected ? (
                      <Button
                        text={'Connect Wallet'}
                        size={'lg'}
                        onClick={() => connect('injected').then(() => {
                          localStorage.removeItem('disconnectWallet')
                        })}
                      />
                    ) : (
                      !isCollatApproved ? (
                        <>
                          <ApproveButtonContainer>
                            <Button
                              text={
                                isCollatApproved
                                  ? `Approved ${selectedCollateralCoin}`
                                  : !isCollatApproving
                                  ? `Approve ${selectedCollateralCoin}`
                                  : 'Approving...'
                              }
                              size={'lg'}
                              disabled={
                                mintCR.lte(1e6) ||
                                isInputFieldError ||
                                isCollatApproved ||
                                !Number(collateralValue)
                              }
                              onClick={approveCollat}
                              loading={isCollatApproving}
                            />
                          </ApproveButtonContainer>
                          <br />
                        </>
                      ) : (
                        <Button
                          text={'Mint'}
                          size={'lg'}
                          variant={'default'}
                          disabled={
                            mintCR.lte(1e6) ||
                            isInputFieldError ||
                            !isCollatApproved ||
                            !Number(arthValue) ||
                            !(Number(collateralValue))
                          }
                          onClick={() => setOpenModal(1)}
                        />
                      )
                    )
                  }
                </div>
              </div>
            </LeftTopCardContainer>
          </LeftTopCard>
        </Grid>
        <Grid item lg={5} md={12} sm={12} xs={12}>
          <PoolInfo selectedCollateralCoin={selectedCollateralCoin} />
        </Grid>
        <Grid item lg={1} />
      </Grid>

      <CustomSuccessModal
        modalOpen={successModal}
        setModalOpen={() => setSuccessModal(false)}
        title={'Minting ARTH successful!'}
        subTitle={''}
        subsubTitle={
          'Your transaction is now being mined on the blockchain. You should consider staking your tokens to earn extra rewards!'
        }
        buttonText={'Stake your ARTH'}
        buttonType={'default'}
        buttonTo={'/#/farming'}
      />
    </>
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

const LeftTopCard = styled.div``;

const LeftTopCardHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const LeftTopCardContainer = styled.div``;
const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 32px 12px;
  width: 100px;
  height: 80px;
  z-index: 1;
  cursor: pointer;
`;

const TabText = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.64);
`;

const ApproveButtonContainer = styled.div`
  display: flex;
`;

const TabTextActive = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.88);
`;

const StakingDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 0 0 0;
`;

const ActiveTab = styled.div`
  position: absolute;
  width: 100px;
  padding: 32px 12px;
  background: linear-gradient(180deg, rgba(244, 127, 87, 0) 0%, #fd565620);
  height: 80px;
  z-index: 0;
  border-bottom: 2px solid #fd5656;
`;

const PlusMinusArrow = styled.div`
  width: 100%;
  border-radius: 1.33px;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  font-size: 20px;
  margin: 12px 0;
`;

const OneLineInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
  margin: 5px 0 10px 0;
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

const InputLabel = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.64);
  margin: 0px;
`;

const InternalSpan = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ffffff;
`;

const InputNoDisplay = styled.span`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 2px 10px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px 0px 0px 8px;
`;

const TimeSpan = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.88);
`;

const CheckboxDiv = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 5px 0px 0px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.88);
  margin: 15px 0px 0px 0px;
`;

export default withSnackbar(MintTabContent);
