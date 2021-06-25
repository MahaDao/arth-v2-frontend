import React, { useState } from 'react';
import styled from 'styled-components';

import Modal from './Modal';

import config from '../../config';
import useCore from '../../hooks/useCore';

const Disclaimer: React.FC = () => {
  const [openModal, toggleModal] = useState(true);
  const handleClose = () => toggleModal(false);

  const core = useCore();
  const token = core.tokens.ARTH;

  return (
    <Modal
      title="Disclaimer"
      open={openModal}
      handleClose={handleClose}
    >
      <ModalText>
        <b>
          ARTH and ARTHX are risky assets and there is a probability that you could lose
          all your money. Do not invest if you are not aware of what you are doing.
        </b>
      </ModalText>
      <ModalText>
        Participants from countries under whose national legislation this token may be deemed
        to be a security or a regulated financial instrument are prohibited from participating
        in any manner in token issuance, including indirectly, such as via a proxy or a name
        loan.
      </ModalText>
      <ModalText>
        This token may be deemed to be a security or a regulated financial instrument within
        the meaning of applicable national legislation in China, India, the United States, the
        European Union and / or its individual member nations, Canada, South Korea, Singapore
        and other countries.
      </ModalText>
      <ModalText>
        It is your responsibility to determine whether you are from a country under whose
        national legislation this token may be deemed to be a security or a regulated
        financial instrument, and, if so, to respect the prohibition specified herein.
      </ModalText>
      <ModalHyperLink
        onClick={() =>
          window.open(`${config.etherscanUrl}/token/${token.address}`)
        }
      >
        View token contract on Explorer
      </ModalHyperLink>
    </Modal>
  );
};

const ModalText = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  text-align: left;
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.64);
`;
const ModalHyperLink = styled.div`
  font-weight: 300;
  cursor: pointer;
  font-size: 16px;
  line-height: 150%;
  text-decoration-line: underline;
  text-align: center;
  color: rgba(255, 255, 255, 0.64);
  margin-top: 20px;
`;

export default Disclaimer;
