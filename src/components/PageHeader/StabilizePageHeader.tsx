import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { KeyboardArrowRight } from '@material-ui/icons';
import LinearProgress from '@material-ui/core/LinearProgress';
import { createStyles, Theme, withStyles } from '@material-ui/core';

import theme from '../../theme';

import Container from '../../components/Container';

interface PageHeaderProps {
  icon?: React.ReactNode;
  subtitle?: string;
  title?: string;
  secondParaTitle?: string;
  secondParaDescription?: string;
  learnMoreLink?: string;
  parentLink?: string;
  parentLinkTitle?: string;
  mobile?: boolean;
}

withStyles(() =>
  createStyles({
    root: {
      height: 24,
      borderRadius: 12,
      width: 200,
    },
    colorPrimary: {
      backgroundColor: '#D9D5D3',
    },
    bar: {
      borderRadius: 0,
      backgroundColor: '#F7653B',
    },
  }),
)(LinearProgress);

const StabilizePageHeader: React.FC<PageHeaderProps> = ({
  icon,
  subtitle,
  title,
  secondParaTitle,
  secondParaDescription,
  learnMoreLink,
  parentLink,
  parentLinkTitle,
  mobile,
}) => {
  const isDesktopOrLaptop = useMediaQuery({ query: '(min-device-width: 800px)' });



  return (
    <StyledPageHeader>
      <Container size="lg">
        <StyledPageContent>
          <StyledTextContainer>
            {isDesktopOrLaptop && parentLink && (
              <StyledNav>
                <StyledNavLink to={parentLink}>{parentLinkTitle}</StyledNavLink>
                <KeyboardArrowRight style={{ color: theme.color.grey[500] }} />
                <StyledNavTitle>{title}</StyledNavTitle>
              </StyledNav>
            )}
            <div
              style={{
                display: 'flex',
                flexDirection: mobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: mobile ? 'flex-start' : 'center',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <StyledTitle>{title}</StyledTitle>
                <StyledSubtitle>
                  {subtitle}
                  {learnMoreLink && (
                    <LearnMore href={learnMoreLink} target="">
                      &nbsp; Learn more.
                    </LearnMore>
                  )}
                </StyledSubtitle>
                {secondParaTitle && <SecondParaTitle>{secondParaTitle}</SecondParaTitle>}
                {secondParaDescription && (
                  <SecondParaDescription>{secondParaDescription}</SecondParaDescription>
                )}
              </div>
              {/*{!mobile ? (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                   <div style={{ maxWidth: '30%', flex: 0.3 }}>
                  <TextForInfoTitle>
                    Collateral Ratio
                    <CustomToolTip toolTipText={'loreum ipsum'} />
                  </TextForInfoTitle>
                   </div>
                  <PercentNumber style={{ margin: '0px 12px' }}>
                    {
                      Number(getDisplayBalance(globalCR, 4, 4))
                        .toLocaleString('en-US', {maximumFractionDigits: 4})
                    }%
                  </PercentNumber>
                  <BorderLinearProgress
                    variant="determinate"
                    value={Number(getDisplayBalance(globalCR, 4))}
                  />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: 40 }}>
                   <div style={{ maxWidth: '30%', flex: 0.3 }}>
                  <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '12px' }}>
                    <TextForInfoTitle>
                      Collateral Ratio
                      <CustomToolTip toolTipText={'loreum ipsum'} />
                    </TextForInfoTitle>
                     </div>
                    <PercentNumber style={{ margin: '0px 12px' }}>
                      {getDisplayBalance(globalCR, 4)}%
                    </PercentNumber>
                  </div>
                  <BorderLinearProgress
                    variant="determinate"
                    value={Number(getDisplayBalance(globalCR, 4, 2))}
                  />
                </div>
              )}*/}
            </div>
          </StyledTextContainer>
          <ALignRightOnMobile>{icon}</ALignRightOnMobile>
        </StyledPageContent>
      </Container>
    </StyledPageHeader>
  );
};



const ALignRightOnMobile = styled.div`
  align-self: center;
  @media (max-width: 768px) {
    align-self: flex-end;
  } ;
`;

const StyledPageContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  // min-height: 150px;
  padding: 40px 0;
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    padding: 40px 0;
  };
`;

const StyledNav = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: -30px;
  margin-bottom: 20px;
`;



const StyledNavLink = styled(Link)`
  color: ${(props) => props.theme.color.grey[400]};
  font-size: 14px;
  margin-right: -4px;
  &:hover {
    color: white !important;
  }
`;

const StyledNavTitle = styled.span`
  color: white;
  font-size: 14px;
`;

const StyledTextContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  // @media (max-width: 768px) {
  //   margin-top: -100px;
  // } ;
`;

const StyledPageHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  width: 100%;
  background: linear-gradient(180deg,
  #${(props) => props.theme.color.dark[200]} 0%,
  rgba(42, 40, 39, 0) 100%);
  // padding-bottom: 40px;
  // padding-top: 40px;
  // padding-left: 15px;
  // padding-right: 15px;
  @media (max-width: 768px) {
    width: auto;
    padding-left: 0;
    padding-right: 0;
  };
`;

const SecondParaTitle = styled.h3`
  color: ${(props) => props.theme.color.grey[100]};
  font-size: 18px;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 0;
`;

const StyledSubtitle = styled.h3`
  color: ${(props) => props.theme.color.grey[400]};
  font-size: 16px;
  font-weight: 300;
  max-width: 500px;
  padding: 0;
  margin: 4px 0 0;
`;

const SecondParaDescription = styled.h3`
  color: ${(props) => props.theme.color.grey[400]};
  font-size: 18px;
  font-weight: 300;
  max-width: 500px;
  margin: 0;
  padding: 0;
`;
const StyledTitle = styled.h1`
  color: ${(props) => props.theme.color.grey[100]};
  font-family: Syne;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 29px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.88;
  z-index: 1;
  margin: 0;
  padding: 0;
`;

const LearnMore = styled.a`
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 140%;
  margin-top: 10px;
  cursor: pointer;
  color: #f7653b;
  opacity: 0.88;
  &:hover {
    color: #f7653b;
    opacity: 0.88;
  }
`;

export default StabilizePageHeader;
