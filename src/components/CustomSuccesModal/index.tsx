import React from 'react';
import CustomModal from '../CustomModal';
import styled, { keyframes } from 'styled-components';
import Tick from '../../assets/svg/Tick.svg';
import Close from '../../assets/svg/Close.svg';
import Button from '../Button';

export interface InputProps {
  modalOpen: boolean;
  setModalOpen: () => void;
  title: string;
  subTitle?: string;
  subTitleLink?: string;
  subsubTitle?: string;
  buttonText: string;
  buttonType?: 'default' | 'transparent' | 'outlined' | 'rounded';
  redirectTo?: string;
}

const CustomSuccessModal: React.FC<InputProps> = (props) => {
  const { modalOpen, setModalOpen, title, subTitle, subTitleLink, buttonText, subsubTitle, buttonType = 'transparent', redirectTo } = props;
  return (
    <CustomModal
      closeButton
      handleClose={() => setModalOpen()}
      open={modalOpen}
      modalTitleStyle={{}}
      modalContainerStyle={{}}
      modalBodyStyle={{}}>
      <MainContainer>
        <CloseButton src={Close} height={20} onClick={() => setModalOpen()} />
        <TickContainer>
          <TickBackgroundWave />
          <TickImg src={Tick} height={100} />
        </TickContainer>
        <ContentConatiner>
          <ContentTitle>
            {title}
          </ContentTitle>
          <ContentSubSubtitle>
            {subsubTitle}
          </ContentSubSubtitle>
          <ContentSubtitle>
            {subTitle}
          </ContentSubtitle>
        </ContentConatiner>
        <Button text={buttonText} size={'lg'} variant={buttonType} onClick={() => setModalOpen()} to={redirectTo} />
      </MainContainer>

    </CustomModal>
  );
}

export default CustomSuccessModal;

const TickAnimation = keyframes`
  0%   {transform: scale(0)}
  60%  {transform: scale(1.4)}
  100% {transform: scale(1)}
`;

const TickBackground = keyframes`
  from {
    transform: scale(0);
    background: #20C97450;
  }
  to {
    transform: scale(1);
    background: #20C97400;
  }
`;

const CloseButton = styled.img`
  position: absolute;
  right: 32px;
  top: 32px;
  cursor: pointer;
`

const MainContainer = styled.div`
`

const TickContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 24px;
  position: relative;
`

const TickImg = styled.img`
  animation: ${TickAnimation} 0.5s linear;
  z-index: 1;
`

const TickBackgroundWave = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: transparent;
  position: absolute;
  z-index: 0;
  animation: ${TickBackground} 1s linear;
`

const ContentConatiner = styled.div`
  text-align: center;
  margin-bottom: 32px;
`
const ContentTitle = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: rgba(255, 255, 255);
  margin: 0;
  margin-bottom: 10px;
`

const ContentSubtitle = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: #F7653B;
  margin: 0;
`

const ContentSubSubtitle = styled.p`
  /* Text-BodySmall */

  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: rgba(255, 255, 255, 0.88);
  margin-bottom: 4px;

`



