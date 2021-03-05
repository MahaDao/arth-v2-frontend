import React, { useCallback, useMemo, useState } from 'react';

import Button from '../../../../components/Button';
import Modal from '../../../../components/NewModal/index';
import ModalActions from '../../../../components/ModalActions';
import TokenInput from '../../../../components/TokenInput';

import { getFullDisplayBalance } from '../../../../utils/formatBalance';
import { BigNumber } from 'ethers';

interface DepositModalProps {
  max: BigNumber;
  onConfirm: (amount: string) => void;
  tokenName?: string;
  onCancel?: () => void;
}

const BondModal: React.FC<DepositModalProps> = ({ max, onConfirm, onCancel, tokenName = '' }) => {
  const [val, setVal] = useState('');
  const fullBalance = useMemo(() => getFullDisplayBalance(max, tokenName === 'USDC' ? 6 : 18), [max, tokenName]);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value);
    },
    [setVal],
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);

  return (
    <Modal title={`Deposit ${tokenName}`} open={true} handleClose={onCancel}>
      <TokenInput
        value={val}
        // label="How much would you like to deposit?"
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
      />
      <ModalActions>
        <Button
          text="Cancel"
          theme="secondary"
          variant="transparent"
          onClick={onCancel}
        />
        <Button text="Confirm" onClick={() => onConfirm(val)} />
      </ModalActions>
    </Modal>
  );
};

export default BondModal;
