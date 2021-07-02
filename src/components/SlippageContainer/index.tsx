import styled from 'styled-components';
import React, {useState } from 'react';

import CustomToolTip from '../CustomTooltip';
import settings from '../../assets/svg/settingSlidder.svg';
import { useSlippage, useUpdateSlippage } from '../../state/slippage/hooks';
import {
  ValidateNumber,
  correctString,
  checkForAfterDecimalDigitsSlippage,
} from '../CustomInputContainer/RegexValidation';

interface Irates {
  id: number;
  text: string;
  rate: number;
}

const rates: Irates[] = [
  {
    id: 1,
    text: '0.1 %',
    rate: 0.1,
  },
  {
    id: 2,
    text: '0.5 %',
    rate: 0.5,
  },
  {
    id: 3,
    text: '1.0 %',
    rate: 1.0,
  },
  {
    id: 4,
    text: 'Custom',
    rate: 0.0,
  },
];

const SlippageContainer: React.FC = () => {
  const [modalOpen, setOpenModal] = useState<boolean>(false);

  const { id , value: slippage } = useSlippage();
  const updateSlippage = useUpdateSlippage();

  const onInputChange = async (value: string) => {
    if (value === '') {
      updateSlippage(4, 0);
      return;
    }

    if (Number(value) && (Number(value) < 0 || Number(value) > 100)) return;

    if (ValidateNumber(value) && checkForAfterDecimalDigitsSlippage(value)){
      updateSlippage(4, Number(await correctString(value)));
    }
  }

  const CustomRateField = () => {
    return (
      <IField>
        <InputDiv>
          <input
            inputMode={'decimal'}
            value={Number(correctString(`${slippage}`))}
            style={{
              fontFamily: 'Inter !important',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '20px',
              color: 'rgba(255, 255, 255, 0.64)',
              width: '100%',
              background: 'transparent',
              border: 'none',
            }}
            type={'number'}
            onChange={(event) => {
              onInputChange(event.target.value);
            }}
            min={0.0001}
            max={100}
          />
        </InputDiv>
        <PerDiv>%</PerDiv>
      </IField>
    );
  };

  return (
    <MainContainer>
      {modalOpen && (
        <BackgroundAbsolute
          onClick={() => {
            setOpenModal(!modalOpen);
          }}
        />
      )}
      <CustomDiv>
        <img
          src={settings}
          height={20}
          alt="Slippage icon"
          onClick={() => setOpenModal(!modalOpen)}
        />
        {modalOpen && (
          <CustomSlippageBox>
            <CTitle>
              Slippage Tolerance
              <CustomToolTip toolTipText={'The limit of price slippage you are willing to accept.'} />
            </CTitle>
            <ButtonsBox>
              {
                rates.map((data: Irates) => {
                  if (data.id !== 4) return (
                      <ButtonItem
                        key={data.id}
                        style={data.id === id ? { border: '1px solid white' } : {}}
                        onClick={() => updateSlippage(data.id, data.rate)}
                      >
                        <ButtonText>{data.text}</ButtonText>
                      </ButtonItem>
                  );

                  return (
                    <ButtonItem
                      key={data.id}
                      style={
                        data.id === id
                          ? { border: '1px solid white', marginRight: 0 }
                          : { marginRight: 0 }
                      }
                      onClick={() => data.id !== id && updateSlippage(data.id, 0.00)}
                    >
                      {
                        data.id === id
                          ? CustomRateField()
                          : <ButtonText>{data.text}</ButtonText>
                      }
                    </ButtonItem>
                  )}
                )
              }
            </ButtonsBox>
          </CustomSlippageBox>
        )}
      </CustomDiv>
    </MainContainer>
  );
};

export default SlippageContainer;

const MainContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const BackgroundAbsolute = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background: transparent;
  width: 100vw;
  height: 100vh;
  z-index: 11;
`;

const CustomDiv = styled.div`
  position: relative;
  cursor: pointer;
  z-index: 15;
`;

const CustomSlippageBox = styled.div`
  background: linear-gradient(180deg, #48423e 0%, #373030 100%);
  border-radius: 12px;
  padding: 24px;
  width: 106px;
  position: absolute;
  top: 24px;
  right: 0;
  min-width: max-content;
  z-index: 12;
  box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.12), 0px 16px 20px rgba(0, 0, 0, 0.25);
`;

const CTitle = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: rgba(255, 255, 255, 0.88);
  margin-bottom: 12px;
`;

const ButtonsBox = styled.div`
  display: flex;
  flex-direction: row;
`;

const ButtonItem = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-sizing: border-box;
  border-radius: 4px;
  height: 26px;
  width: 68px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  cursor: pointer;
`;

const ButtonText = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.64);
`;

const IField = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
`;

const InputDiv = styled.div`
  flex: 1;
`;

const PerDiv = styled.span`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.64);
`;
