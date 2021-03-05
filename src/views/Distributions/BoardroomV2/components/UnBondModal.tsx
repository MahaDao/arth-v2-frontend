import React, { useCallback, useMemo, useState } from 'react';
import Button from '../../../../components/Button';
import Modal from '../../../../components/NewModal/index';
import ModalActions from '../../../../components/ModalActions';
import TokenInput from '../../../../components/TokenInput';

import { getFullDisplayBalance } from '../../../../utils/formatBalance';
import { BigNumber } from 'ethers';

interface WithdrawModalProps {
  max: BigNumber;
  onConfirm: (amount: string) => void;
  tokenName?: string;
  onCancel?: () => void;
}

const UnbondModal: React.FC<WithdrawModalProps> = ({
  onConfirm,
  max,
  onCancel,
  tokenName = '',
}) => {
  const [val, setVal] = useState('');
  const fullBalance = useMemo(() => getFullDisplayBalance(max), [max]);

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
    <Modal title={`Request to Withdraw ${tokenName}`} open={true} handleClose={onCancel}>
      <TokenInput
        label="You are making a request to withdraw your tokens. They can be claimed after the withdrawal period is over."
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
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
  )
};

export default UnbondModal;
