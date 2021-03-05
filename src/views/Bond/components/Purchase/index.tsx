import React from 'react';
import styled from 'styled-components';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Button from '../../../../components/Button';
import CardContent from '../../../../components/CardContent';
import useBasisCash from '../../../../hooks/useBasisCash';
import Label from '../../../../components/Label';
import TokenSymbol from '../../../../components/TokenSymbol';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import AddIcon from '@material-ui/icons/Add';
import ExchangeModal from './ExchangeModal';
import ERC20 from '../../../../basis-cash/ERC20';
import useTokenBalance from '../../../../hooks/useTokenBalance';
import useApprove, { ApprovalState } from '../../../../hooks/useApprove';
import useCatchError from '../../../../hooks/useCatchError';
import Spacer from '../../../../components/Spacer';
import { useWallet } from 'use-wallet';
import HtmlTooltip from '../../../../components/HtmlTooltip';

interface ExchangeCardProps {
  action: string;
  fromToken: ERC20;
  fromTokenName: string;
  toToken: ERC20;
  toTokenName: string;
  addOnTokeName?: string;
  addOnToken?: string;
  priceDesc: string;
  onExchange: (amount: string) => void;
  disabled?: boolean;
  disabledDescription?: string;
}

const PurchaseBonds: React.FC<ExchangeCardProps> = ({
  action,
  fromToken,
  fromTokenName,
  addOnTokeName,
  addOnToken,
  toToken,
  toTokenName,
  priceDesc,
  onExchange,
  disabled = false,
  disabledDescription,
}) => {
  const catchError = useCatchError();
  const {
    contracts: { Treasury },
    ARTH,
    DAI,
  } = useBasisCash();

  const { account, connect } = useWallet();

  const [arthApproveStatus, approveArth] = useApprove(ARTH, Treasury.address);
  const [diaApproveStatus, approveDai] = useApprove(DAI, Treasury.address);

  const [showModal, toggleModal] = React.useState(false);
  const balance = useTokenBalance(fromToken);
  const isARTHApproved = arthApproveStatus === ApprovalState.APPROVED;
  const isDAIApproved = diaApproveStatus === ApprovalState.APPROVED;

  return (
    <Card>
      {showModal && (
        <ExchangeModal
          title={action}
          description={priceDesc}
          max={balance}
          onConfirm={(value) => {
            onExchange(value);
          }}
          action={action}
          onCancel={() => toggleModal(false)}
          tokenName={fromTokenName}
        />
      )}
      <div className="dialog-class">
        <StyledCardTitle>Purchase ARTHB</StyledCardTitle>
        <HtmlTooltip
          enterTouchDelay={0}
          title={
            <span>
              When ARTH is below it’s target price; you can buy ARTH bonds with DAI by
              influencing the price on Uniswap. Bond tokens are bought at a discount are
              redeemed for a profit.
            </span>
          }
        >
          <InfoOutlinedIcon className="margin-left-10 white" />
        </HtmlTooltip>
      </div>
      <CardContent>
        <StyledCardContentInner>
          <StyledExchanger>
            <StyledToken>
              <StyledCardIcon>
                <TokenSymbol symbol={'DAI'} size={54} />
              </StyledCardIcon>
              <Label text={fromTokenName} variant="normal" />
            </StyledToken>
            <StyledExchangeArrow>
              <ArrowRightAltIcon className="font26" />
            </StyledExchangeArrow>
            <StyledToken>
              <StyledCardIcon>
                <TokenSymbol symbol={toToken.symbol} size={54} />
              </StyledCardIcon>
              <Label text={toTokenName} variant="normal" />
            </StyledToken>
            <StyledExchangeArrow>
              <AddIcon className="font26" />
            </StyledExchangeArrow>
            <StyledToken>
              <StyledCardIcon>
                <TokenSymbol symbol={addOnToken} size={54} />
              </StyledCardIcon>
              <Label text={addOnTokeName} variant="normal" />
            </StyledToken>
          </StyledExchanger>
          <StyledDesc>{priceDesc}</StyledDesc>
          {
            <StyledCardActions>
              {!account ? (
                <Button onClick={() => connect('injected')} text="Unlock Wallet" />
              ) : disabled ? (
                <Button
                  disabled={disabled}
                  text={disabledDescription || action}
                  onClick={() => toggleModal(true)}
                />
              ) : !isDAIApproved || !isARTHApproved ? (
                <>
                  <Button
                    disabled={
                      isDAIApproved ||
                      diaApproveStatus === ApprovalState.PENDING ||
                      diaApproveStatus === ApprovalState.UNKNOWN
                    }
                    onClick={() => catchError(approveDai(), `Unable to approve DAI`)}
                    text={
                      diaApproveStatus === ApprovalState.PENDING
                        ? 'Approving'
                        : diaApproveStatus === ApprovalState.APPROVED
                          ? 'DAI Approved'
                          : 'Approve DAI'
                    }
                  />

                  <Spacer size="md" />

                  <Button
                    disabled={
                      isARTHApproved ||
                      arthApproveStatus === ApprovalState.PENDING ||
                      arthApproveStatus === ApprovalState.UNKNOWN
                    }
                    onClick={() => catchError(approveArth(), `Unable to approve ARTH`)}
                    text={
                      arthApproveStatus === ApprovalState.PENDING
                        ? 'Approving'
                        : arthApproveStatus === ApprovalState.APPROVED
                          ? 'ARTH Approved'
                          : 'Approve ARTH'
                    }
                  />
                </>
              ) : (
                      <Button
                        text={disabledDescription || action}
                        onClick={() => toggleModal(true)}
                        disabled={disabled}
                      />
                    )}
            </StyledCardActions>
          }
          {/* <StyledCardActions>
            <Button disabled={disabled} text="Purchase ARTHB" onClick={() => toggleModal(true)} />
          </StyledCardActions> */}
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

// const StyledCardDesc = styled.div`
//   margin-bottom: 26px;
//   text-align: center;
//   color: #fff9;
// `;

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
  height: 100%;
  background: linear-gradient(180deg, #1f1a1a 0%, #251c1d 100%);
  border-radius: 12px;
  box-shadow: 0px 12px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  flex: 1;
  flex-direction: column;
`;
export default PurchaseBonds;
