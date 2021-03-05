import React from 'react';
import styled from 'styled-components';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { useWallet } from 'use-wallet';
import Button from '../../../../components/Button';
import CardContent from '../../../../components/CardContent';
import useBasisCash from '../../../../hooks/useBasisCash';
import Label from '../../../../components/Label';
import TokenSymbol from '../../../../components/TokenSymbol';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import ExchangeModal from './ExchangeModalBonds';
import ERC20 from '../../../../basis-cash/ERC20';
import useTokenBalance from '../../../../hooks/useTokenBalance';
import useApprove, { ApprovalState } from '../../../../hooks/useApprove';
import useCatchError from '../../../../hooks/useCatchError';
import HtmlTooltip from '../../../../components/HtmlTooltip';

interface ExchangeCardProps {
  action: string;
  fromToken: ERC20;
  fromTokenName: string;
  toToken: ERC20;
  toTokenName: string;

  addOnTokeName?: string;
  addOnToken?: ERC20;
  priceDesc: string;
  onExchange: (amount: string, redeemForDai: boolean) => void;
  disabled?: boolean;
  disabledDescription?: string;
}

const ExchangeCardBonds: React.FC<ExchangeCardProps> = ({
  action,
  fromToken,
  fromTokenName,
  addOnTokeName,
  addOnToken,
  priceDesc,
  onExchange,
  disabled = false,
  disabledDescription,
}) => {
  const { account, connect } = useWallet();
  const catchError = useCatchError();
  const {
    contracts: { Treasury },
  } = useBasisCash();
  const [approveStatus, approve] = useApprove(fromToken, Treasury.address);
  const [showModal, toggleModal] = React.useState(false);
  const balance = useTokenBalance(fromToken);

  return (
    <Card>
      {showModal && (
        <ExchangeModal
          title={action}
          description={priceDesc}
          max={balance}
          onConfirm={(value, redeemForDai) => {
            onExchange(value, redeemForDai);
          }}
          onCancel={() => toggleModal(false)}
        />
      )}
      <div className="dialog-class">
        <StyledCardTitle>Redeem ARTHB</StyledCardTitle>
        <HtmlTooltip
          enterTouchDelay={0}
          title={
            <span>
              When ARTH is above it’s target price; you can sell ARTH bonds and either get back
              DAI or ARTH in return. When you redeem your ARTHB, you also pay a stability fee in
              MAHA.
            </span>
          }
        >
          <InfoOutlinedIcon className="margin-left-10 white" />
        </HtmlTooltip>
      </div>
      {/* <div className="border-bottom width-100 margin-bottom-20" /> */}
      <CardContent>
        <StyledCardContentInner>
          <StyledExchanger>
            <StyledToken>
              <StyledCardIcon>
                <TokenSymbol symbol={fromToken.symbol} size={54} />
              </StyledCardIcon>
              <Label text={fromTokenName} variant="normal" />
            </StyledToken>
            <StyledExchangeArrow>
              <ArrowRightAltIcon className="font26" />
            </StyledExchangeArrow>
            <StyledToken>
              <StyledCardIcon>
                <TokenSymbol symbol={addOnToken.symbol} size={54} />
              </StyledCardIcon>
              <Label text={addOnTokeName} variant="normal" />
            </StyledToken>
          </StyledExchanger>
          <StyledDesc>{priceDesc}</StyledDesc>
          {
            <StyledCardActions>
              {!account ? (
                <Button onClick={() => connect('injected')} text="Unlock Wallet" />
              ) : !disabled ? (
                balance.eq(0) && false ? (
                  <Button text={'No ARTHB Balance'} disabled={true} />
                ) : approveStatus !== ApprovalState.APPROVED && !disabled ? (
                  <Button
                    disabled={
                      disabled ||
                      approveStatus === ApprovalState.PENDING ||
                      approveStatus === ApprovalState.UNKNOWN
                    }
                    onClick={() => catchError(approve(), `Unable to approve ${fromTokenName}`)}
                    text={
                      approveStatus === ApprovalState.PENDING ? 'Approving' : 'Approve ARTHB'
                    }
                  />
                ) : (
                      <Button
                        text={disabledDescription || action}
                        onClick={() => toggleModal(true)}
                        disabled={disabled}
                      />
                    )
              ) : (
                    <Button
                      text={disabledDescription || action}
                      // onClick={onPresent}
                      disabled={disabled}
                    />
                  )}
            </StyledCardActions>
          }
        </StyledCardContentInner>
      </CardContent>
    </Card>
  );
};

const StyledCardTitle = styled.div`
  align-items: center;
  color: ${(props) => props.theme.color.grey[300]};
  display: flex;
  font-size: 18px;
  padding-top: 20px;
  font-weight: 600;
  height: 64px;
  justify-content: center;
  margin-top: ${(props) => -props.theme.spacing[3]}px;
`;

const StyledCardIcon = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const StyledExchanger = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[5]}px;
`;

const StyledExchangeArrow = styled.div`
  font-size: 20px;
  color: ${(props) => props.theme.color.grey[300]};
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  padding-bottom: ${(props) => props.theme.spacing[4]}px;
`;

const StyledToken = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  font-weight: 600;
`;

const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[3]}px;
  width: 100%;
`;

const StyledDesc = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #fff9;
  text-align: center;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;
const Card = styled.div`
  background: linear-gradient(180deg, #1f1a1a 0%, #251c1d 100%);
  border-radius: 12px;
  box-shadow: 0px 12px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  height: 100%;
  flex: 1;
  flex-direction: column;
`;
export default ExchangeCardBonds;
