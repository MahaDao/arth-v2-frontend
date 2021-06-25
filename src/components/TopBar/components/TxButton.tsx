import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import React, { useState } from 'react';

import TxModal from './TxModal';
import HtmlTooltip from '../../../components/HtmlTooltip';
import transcationIcon from '../../../assets/img/transcation.png';

interface TxButtonProps { }

const TxButton: React.FC<TxButtonProps> = () => {
  const [modal, setModal] = useState<boolean>(false);
  const { account } = useWallet();

  return (
    <div style={{ display: 'flex' }}>
      {
        !!account && (
          <StyledTxButton>
            <HtmlTooltip enterTouchDelay={5000} title="Transaction">
              <img
                src={transcationIcon}
                width="24px"
                className="pointer"
                onClick={() => setModal(true)}
                alt="transactionIcon"
              />
            </HtmlTooltip>
          </StyledTxButton>
        )
      }
      {
        modal && <TxModal onDismiss={() => setModal(false)} />
      }
    </div>
  );
};

const StyledTxButton = styled.div`
  margin-right: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  object-fit: contain;
  width: 100%;
  @media (max-width: 768px) {
    margin-right: 0px;
  } ;
`;

export default TxButton;
