import React from 'react';
import styled from 'styled-components';
import Button from '../../../components/Button';
import CustomModal from '../../../components/CustomModal';
import CloseIcon from '../../../assets/img/CloseIcon.svg';
import happyMask from '../../../assets/svg/happyMask.svg';
import backgroundMask from '../../../assets/svg/backgroundMask.svg';
interface IProps {
    open: boolean;
    toggleOpen: () => void
}

export const WinModal = (props: IProps) => {
    return (
        <>
            <CustomModal
                // title={'MAHA Prize winning Criteria'}
                closeButton
                handleClose={props.toggleOpen}
                open={props.open}
                modalBodyStyle={{
                    padding: 0,
                }}
                modalContainerStyle={{ padding: 0 }}
            >
                <MainDiv style={{
                    backgroundImage: "url(" + backgroundMask + ")",
                    backgroundSize: '80%',
                    backgroundPosition: '65%',
                }}>
                    <GradientDiv />
                    <div style={{padding: '32px 24px', zIndex: 6}}>
                        <img style={{ position: 'absolute', display: 'flex', top: 10, right: 20, zIndex: 2, border: '0.5px solid grey', backgroundColor: 'black' }} src={CloseIcon} height={24} onClick={props.toggleOpen}  alt={''}/>

                        <MaskDiv style={{

                        }}>
                            <img src={happyMask} height={100}  alt={''}/>
                        </MaskDiv>

                        <WinnerText>
                            Congratulations, You are the Winner!
                        </WinnerText>

                        <ButtonContainer>
                            <div style={{ width: '100%', display: 'flex' }}>
                                <Button
                                    variant={'default'}
                                    text={'Claim Prize'}
                                />
                            </div>

                            <div style={{ width: '100%', display: 'flex', marginTop: 16 }}>
                                <Button
                                    variant={'transparent'}
                                    text={'Close'}
                                    onClick={() => props.toggleOpen()}
                                />
                            </div>
                        </ButtonContainer>
                    </div>
                </MainDiv>
            </CustomModal>
        </>
    )
}

const GradientDiv = styled.div`
  background: linear-gradient(180deg, rgba(72, 66, 62, 0) -19.91%, #373030 61.27%);
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 1;
`;
const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const MaskDiv = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100%;
`;

const WinnerText = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  color: #FFFFFF;
  margin: 40px 0 0 0;
  z-index: 2;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  margin: 32px 0 0 0;
  flex-direction: column;
  z-index: 2;
`;
