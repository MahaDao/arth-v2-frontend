import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import { BigNumber } from '@ethersproject/bignumber';

import CustomInputContainer from '../../../components/CustomInputContainer';
import Button from '../../../components/Button';
import CustomModal from '../../../components/CustomModal';
import { StakingContract } from '../../../basis-cash';
import { getDisplayBalance } from '../../../utils/formatBalance';
import useStakingDeposit from '../../../hooks/callbacks/staking/useStakingDeposit';
import useApprove, { ApprovalState } from '../../../hooks/callbacks/useApprove';
import useCore from '../../../hooks/useCore';
import DynamicSlider from '../../../components/DynamicSlider';
import { ValidateNumber } from '../../../components/CustomInputContainer/RegexValidation';
import useTokenDecimals from '../../../hooks/useTokenDecimals';

interface IProps {
  onCancel: (amount?: string, token?: string) => void;
  onDeposit?: () => void;
  isMobile: boolean;
  toggleSuccessModal?: () => void;
  tokenBalance: BigNumber;
  closeSuccessModal: () => void;
  openSuccessModal: () => void;
  pool: StakingContract;
}

export default (props: IProps) => {
  const [isInputFieldError, setIsInputFieldError] = useState<boolean>(false);
  const [val, setValue] = useState<string>('0');
  const [sliderValue, setSliderValue] = useState<number>(0);
  
  const core = useCore();
  const contract = core.contracts[props.pool.contract];
  const tokenDecimals = useTokenDecimals(props.pool.depositToken);
  const [approveStatus, approve] = useApprove(
    core.tokens[props.pool.depositToken],
    contract.address,
  );

  const symbol = props.pool.depositTokenSymbols.join('-');

  const stake = useStakingDeposit(
    props.pool.contract, 
    Number(val), 
    props.pool.depositToken,
    symbol
  );

  const popupCancel = () => {
    props.onCancel(
      Number(String(val)).toLocaleString(),
      symbol
    )
  }

  const handleStaking = () => {
    stake(() => {
      props.onCancel();
      props.openSuccessModal();
      setTimeout(() => {
        props.closeSuccessModal();
      }, 5 * 1000)
    });
  }

  const isApproved = approveStatus === ApprovalState.APPROVED;
  const isApproving = approveStatus === ApprovalState.PENDING;

  return (
    <CustomModal
      closeButton
      handleClose={popupCancel}
      open={true}
      modalTitleStyle={{}}
      modalContainerStyle={{}}
      modalBodyStyle={{}}
      title={`Stake Your Tokens`}
    >
      <div>
        <CustomInputContainer
          ILabelValue={`How much ${symbol} would you like to supply?`}
          IBalanceValue={getDisplayBalance(props.tokenBalance, tokenDecimals, 3)}
          showBalance={false}
          ILabelInfoValue={''}
          DefaultValue={String(val)}
          LogoSymbol={'ARTH'}
          hasDropDown={false}
          SymbolText={symbol}
          setText={(t) => {
            setValue(ValidateNumber(t) ? t : '0');
          }}
          inputMode={'decimal'}
          tagText={'MAX'}
          dontShowBackgroundContainer={true}
          multiIcons={true}
          symbols={props.pool.depositTokenSymbols}
          errorCallback={(flag: boolean) => { setIsInputFieldError(flag) }}
        />
        <OneLine>
          <div style={{ flex: 1 }}></div>
          <OneLine>
            <BeforeChip>Balance: {Number(getDisplayBalance(props.tokenBalance, tokenDecimals, 3)).toLocaleString()}</BeforeChip>
            <TagChips>{symbol}</TagChips>
          </OneLine>
        </OneLine>

        {/*<DynamicSlider onSliderChange={setSliderValue} />*/}

        <Grid
          container
          spacing={2}
          direction={props.isMobile ? 'column-reverse' : 'row'}
          style={{ marginTop: '32px' }}
        >
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Button
              variant={'transparent'}
              text="Cancel"
              size={'lg'}
              onClick={popupCancel}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            {!isApproved ? (
              <Button
                loading={isApproving}
                text={isApproving ? 'Approving' : 'Approve'}
                size={'lg'}
                onClick={approve}
                disabled={
                  isInputFieldError ||
                  isApproved ||
                  !Number(val)
                }
              />
            ) : (
              <Button 
                disabled={
                  isInputFieldError ||
                  !isApproved ||
                  !Number(val)
                }
                text={'Deposit'} 
                size={'lg'} 
                onClick={handleStaking} 
              />
            )}
          </Grid>
        </Grid>
      </div>
    </CustomModal>
  );
};

const OneLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
  margin: 5px 0;
`;

const BeforeChip = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: 0.08em;
  text-transform: uppercase;
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
