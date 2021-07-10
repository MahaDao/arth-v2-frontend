import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';

import useCore from '../../../hooks/useCore';
import CustomModal from '../../../components/CustomModal';
import CustomInputContainer from '../../../components/CustomInputContainer';
import { ValidateNumber } from '../../../components/CustomInputContainer/RegexValidation';
import Button from '../../../components/Button';
import useTokenBalance from '../../../hooks/state/useTokenBalance';
import { getDisplayBalanceToken } from '../../../utils/formatBalance';
import Loader from 'react-spinners/BeatLoader';
import useDeposit from '../../../hooks/callbacks/debtBoardroom/useDeposit';
import { BigNumber } from 'ethers';

interface IProps {
  onCancel: () => void;
  onDeposit?: () => void;
  symbol: 'ARTH' | 'ARTHX' | '';
}

export default (props: IProps) => {
  const { symbol } = props;
  const [val, setValue] = useState<string>('0');
  const [isInputFieldError, setIsInputFieldError] = useState<boolean>(false);

  const core = useCore();

  const token = core.tokens[symbol];

  const { isLoading: isBalanceLoading, value: balance } = useTokenBalance(
    core.tokens[symbol],
  );

  const decimals = BigNumber.from(10).pow(18)
  const deposit = useDeposit(props.symbol, BigNumber.from(Math.floor(Number(val))).mul(decimals))

  return (
    <CustomModal
      closeButton
      handleClose={props.onCancel}
      open={true}
      modalTitleStyle={{}}
      modalContainerStyle={{}}
      modalBodyStyle={{}}
      title={`Deposit your ${symbol}`}
    >
      <div>
        <CustomInputContainer
          ILabelValue={`How much ${symbol} would you like to supply?`}
          IBalanceValue={getDisplayBalanceToken(balance, token)}
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
          disabled={isBalanceLoading}
          errorCallback={(flag: boolean) => {
            setIsInputFieldError(flag);
          }}
        />
        <OneLine>
          <div style={{ flex: 1 }}/>
          <OneLine>
            <BeforeChip>
              {'Balance: '}
              {isBalanceLoading
                ? <Loader color={'#ffffff'} loading={true} size={8} margin={2} />
                : `${Number(getDisplayBalanceToken(balance, token)).toLocaleString()}`
              }
            </BeforeChip>
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
              disabled={isInputFieldError}
              text={'Convert to Debt'}
              size={'lg'}
              onClick={deposit}
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
