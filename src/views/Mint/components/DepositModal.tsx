import { BigNumber } from '@ethersproject/bignumber';
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import { useMediaQuery } from 'react-responsive';

import CustomModal from '../../../components/CustomModal';
import CustomInputContainer from '../../../components/CustomInputContainer';
import { getDisplayBalance } from '../../../utils/formatBalance';
import { ValidateNumber } from '../../../components/CustomInputContainer/RegexValidation';
import Button from '../../../components/Button';
import useDepositWETH from '../../../hooks/callbacks/useDepositWETH';
import config from '../../../config';

interface IProps {
  onCancel: () => void;
  onDeposit?: () => void;
}

export default (props: IProps) => {
  const [val, setValue] = useState<string>('0');
  const [isInputFieldError, setIsInputFieldError] = useState<boolean>(false);
  const isMobile = useMediaQuery({ maxWidth: '600px' });
  const { balance } = useWallet()

  const symbol = config.blockchainToken // change this for the collateral

  const decimals = BigNumber.from(10).pow(18)
  const desposit = useDepositWETH(symbol, BigNumber.from(Number(val) * 1000).mul(decimals).div(1000))

  return (
    <CustomModal
      closeButton
      handleClose={props.onCancel}
      open={true}
      modalTitleStyle={{}}
      modalContainerStyle={{}}
      modalBodyStyle={{}}
      title={`Wrap your tokens`}
    >
      <div>
        <CustomInputContainer
          ILabelValue={`${symbol} to convert`}
          IBalanceValue={getDisplayBalance(BigNumber.from(balance), 18)} //pass the balance here for MAX to work
          showBalance={false}
          ILabelInfoValue={''}
          DefaultValue={String(val)}
          LogoSymbol={symbol}
          hasDropDown={false}
          SymbolText={symbol}
          setText={(t) => {
            setValue(ValidateNumber(t) ? t : '0');
          }}
          inputMode={'decimal'}
          tagText={'MAX'}
          dontShowBackgroundContainer={true}
          multiIcons={false}
          errorCallback={(flag: boolean) => { setIsInputFieldError(flag) }}
        />
        <OneLine>
          <div style={{ flex: 1 }}></div>
          <OneLine>
            <BeforeChip>Balance: {getDisplayBalance(BigNumber.from(balance), 18)}</BeforeChip>
            <TagChips>{symbol}</TagChips>
          </OneLine>
        </OneLine>

        <Grid container spacing={2} style={{ marginTop: '32px' }}>
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
              loading={false}
              text={'Deposit'}
              size={'lg'}
              onClick={() => desposit()}
              disabled={isInputFieldError}
            />
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
