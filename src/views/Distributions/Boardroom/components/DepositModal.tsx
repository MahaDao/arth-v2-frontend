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
  onCancel?: Function;
}

const DepositModal: React.FC<DepositModalProps> = ({
  max,
  onConfirm,
  onCancel,
  tokenName = '',
}) => {
  const [val, setVal] = useState('');
  const [openModal, toggleModal] = useState(true);
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, tokenName === 'USDC' ? 6 : 18);
  }, [max, tokenName]);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value);
    },
    [setVal],
  );

  const handleClose = () => {
    toggleModal(false);
    if (onCancel) onCancel();
  };

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);

  let modalJsx = <div />;
  if (openModal) {
    modalJsx = (
      <Modal title={`Deposit ${tokenName}`} open={openModal} handleClose={handleClose}>
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
            onClick={() => toggleModal(false)}
          />
          <Button text="Confirm" onClick={() => onConfirm(val)} />
        </ModalActions>
      </Modal>
    );
  }
  return modalJsx;
};

export default DepositModal;
