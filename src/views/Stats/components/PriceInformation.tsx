import React from 'react';
import styled from 'styled-components';
import { TokenStat } from '../../../basis-cash/types';
import PriceLine from './PriceLine';
import TWAPInformation from './TWAPInformation';

interface IProps {
  stat?: TokenStat;
}


const PriceInformation: React.FC<IProps> = (props) => {
  return (
    <CardTyep2>
      <PriceLine stat={props.stat} />
      <div className="border-bottom width-100" />
      <TWAPInformation stat={props.stat} />
    </CardTyep2>
  );
};

const CardTyep2 = styled.div`
  background: rgba(255, 255, 255, 0.02);
  // backdrop-filter: blur(70px);
  border-radius: 12px;
`;


export default PriceInformation;
