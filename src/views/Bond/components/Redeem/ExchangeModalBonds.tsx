import React, { useCallback, useMemo, useState } from 'react';
import Button from '../../../../components/Button';
import Modal from '../../../../components/NewModal/index';
import TokenInput from '../../../../components/TokenInput';
import { getFullDisplayBalance } from '../../../../utils/formatBalance';
import { BigNumber } from 'ethers';
import styled from 'styled-components';

interface ExchangeModalProps {
  max: BigNumber;
  onConfirm: (amount: string, redeemForDai: boolean) => void;
  title: string;
  onCancel?: Function;
  description: string;
}


const ExchangeModal: React.FC<ExchangeModalProps> = ({ max, title, onConfirm, onCancel }) => {
  const [val, setVal] = useState('');
  const fullBalance = useMemo(() => getFullDisplayBalance(max), [max]);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => setVal(e.currentTarget.value),
    [setVal],
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);

  const action = 'Redeem';
  const tokenName = 'ARTHB';

  const description = `You are going to redeem ${val} ARTH by paying ${val} ARTHB`;
  const handleClose = () => {
    onCancel();
  };
  return (
    <Modal open title="Redeem your ARTH Bonds" handleClose={handleClose}>
      <p
        className="font16 bold-600 row-centered"
        style={{ color: 'rgba(255, 255, 255, 0.88)' }}
      >
        {description}
      </p>
      <TokenInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
      />
      <ActionButton>
        <ResponsiveButtonWidth>
          <Button text="Cancel" theme="secondary" variant="transparent" onClick={() => handleClose()} />
        </ResponsiveButtonWidth>
        <ResponsiveButtonWidth>
          <Button
            text={action}
            disabled={Number(val) <= 0}
            onClick={() => onConfirm(val, false)}
          />
        </ResponsiveButtonWidth>
      </ActionButton>
    </Modal>
  );
};

const ActionButton = styled.div`
  align-items: center;
  background-color: ${(props) => props.theme.color.grey[100]}00;
  display: flex;
  height: 96px;
  justify-content: space-between;
  margin: ${(props) => props.theme.spacing[4]}px ${(props) => -props.theme.spacing[4]}px
    ${(props) => -props.theme.spacing[4]}px;
  padding: 0 ${(props) => props.theme.spacing[4]}px;
  @media (max-width: 768px) {
    flex-direction: column;
  } ;
`;
const ResponsiveButtonWidth = styled.div`
  width: 250px;
  @media (max-width: 768px) {
    width: 100%;
  } ;
`;
export default ExchangeModal;
