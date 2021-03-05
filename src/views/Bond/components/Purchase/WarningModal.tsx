import React, { useState } from 'react';
import Button from '../../../../components/Button';
import Modal from '../../../../components/NewModal/index';

import styled from 'styled-components';

interface ExchangeModalProps {
  onConfirm: () => void;
  onCancel?: Function;
}

const WarningModal: React.FC<ExchangeModalProps> = ({ onConfirm, onCancel }) => {
  const [openModal, toggleModalState] = useState(true);

  const handleClose = () => {
    onCancel();
    toggleModalState(false);
  };

  return (
    <Modal
      open={openModal}
      title="Are you sure you want to proceed? "
      handleClose={handleClose}
    >
      <StyledLabel>
        It seems that the ARTH spot price has already gone beyond the target price and{' '}
        <span style={{ color: '#ff7272', fontWeight: 'bold' }}>
          <u>this transaction will probably set you at a net loss</u>
        </span>{' '}
        when ARTHB is redeemed at 1$
      </StyledLabel>

      <StyledLabel>
        Please check the current price of market price of ARTH to see if is already trading
        above it's target price before proceeding with this transaction.
      </StyledLabel>
      <StyledLabel>
        <span style={{ color: '#ff7272', fontWeight: 'bold' }}>
          <u>If ARTH is trading above 1$ then do NOT proceed with this transaction.</u>
        </span>
      </StyledLabel>

      <ActionButton>
        <ResponsiveButtonWidth>
          <Button text="No" theme="secondary" variant="transparent" onClick={handleClose} />
        </ResponsiveButtonWidth>
        <ResponsiveButtonWidth>
          <Button text={'Proceed'} onClick={onConfirm} />
        </ResponsiveButtonWidth>
      </ActionButton>
    </Modal>
  );
};

const StyledLabel = styled.div`
  color: rgba(255, 255, 255, 0.64);
  font-size: 16px;
  padding: 15px 15px 0;
  text-align: center;
`;

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
export default WarningModal;
