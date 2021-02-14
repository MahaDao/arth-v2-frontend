import React, { useCallback, useMemo, useState } from 'react';
import ButtonTransperant from '../../../../components/Button/TransperantButton';
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
  onCancel?: Function;
}

const UnbondModal: React.FC<WithdrawModalProps> = ({
  onConfirm,
  max,
  onCancel,
  tokenName = '',
}) => {
  const [val, setVal] = useState('');
  const [openModal, toggleModal] = useState(true);
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max);
  }, [max]);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value);
    },
    [setVal],
  );
  const handleClose = () => {
    toggleModal(false);
    onCancel();
  };
  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);

  let modalJsx = <div />;
  if (openModal) {
    modalJsx = (
      <Modal title={`Unbond ${tokenName}`} open={openModal} handleClose={handleClose}>
        <TokenInput
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          value={val}
          max={fullBalance}
          symbol={tokenName}
        />
        <ModalActions>
          <ButtonTransperant
            text="Cancel"
            variant="secondary"
            onClick={() => toggleModal(false)}
          />
          <Button text="Confirm" onClick={() => onConfirm(val)} />
        </ModalActions>
      </Modal>
    );
  }
  return modalJsx;
};

export default UnbondModal;
