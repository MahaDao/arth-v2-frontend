import React from 'react';
import styled from 'styled-components';
import Button from '../../../components/Button';
import CustomModal from '../../../components/CustomModal';
import CloseIcon from '../../../assets/img/CloseIcon.svg';
import sadMask from '../../../assets/svg/sadMask.svg';
import crosses from '../../../assets/svg/crosses.svg';
import { useMediaQuery } from 'react-responsive';

interface IProps {
    open: boolean;
    toggleOpen: () => void
}

export const LoseModal = (props: IProps) => {
    let isMobile = useMediaQuery({ 'maxWidth': '600px' })
    return (
        <>
            <CustomModal
                // title={'MAHA Prize winning Criteria'}
                closeButton
                handleClose={props.toggleOpen}
                open={props.open}
                modalContainerStyle={{}}
                modalBodyStyle={{}}
                modalTitleStyle={{}}
            >
                <>
                    <MainDiv>
                        <img style={{ position: 'absolute', display: 'flex', top: 20, right: 25, zIndex: 2 }} src={CloseIcon} height={24} onClick={props.toggleOpen}  alt={''}/>

                        <MaskDiv>
                            <div  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 30, width: '45%', position: 'absolute', top: 10 }} >
                                <img alt={''} src={crosses} height={24} />
                                <img alt={''} src={crosses} height={24} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 30, width: isMobile ? '30%' : '27%', position: 'absolute', top: 35 }}>
                                <img alt={''} src={crosses} height={24} />
                                <img alt={''} src={crosses} height={24} />
                            </div>
                            <img alt={''} src={sadMask} height={140} style={{ paddingTop: 40, zIndex: 2 }} />
                        </MaskDiv>

                        <WinnerText>
                            Better Luck Next Time!
                        </WinnerText>

                        <ButtonContainer>

                            <div style={{ width: '100%', display: 'flex', }}>
                                <Button
                                    variant={'transparent'}
                                    text={'Close'}
                                    onClick={() => props.toggleOpen()}
                                />
                            </div>
                        </ButtonContainer>
                    </MainDiv>
                </>
            </CustomModal>
        </>
    )
}

const MainDiv = styled.div`
display: flex;
flex-direction: column;
// position: relative;
background: linear-gradient(180deg, #48423E 0%, #373030 100%);`
    ;

const MaskDiv = styled.div`
display: flex;
width: 100%;
// max-height: 120px;
align-items: center;
justify-content: center;
position: relative;
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
`;

const ButtonContainer = styled.div`
display: flex;
width: 100%;
margin: 32px 0 0 0;
flex-direction: column;
`;


