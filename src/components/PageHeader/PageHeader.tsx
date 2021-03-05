import React from 'react';
import styled from 'styled-components';
import Container from '../../components/Container';

interface PageHeaderProps {
  icon?: React.ReactNode;
  subtitle?: string;
  title?: string;
  secondParaTitle?: string;
  secondParaDescription?: string;
  learnMoreLink?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  icon,
  subtitle,
  title,
  secondParaTitle,
  secondParaDescription,
  learnMoreLink,
}) => {

  return (
    <StyledPageHeader>
      <Container size="lg">
        <StyledPageContent>
          <StyledTextContainer>
            <StyledTitle>{title}</StyledTitle>
            <StyledSubtitle>
              {subtitle}
              {learnMoreLink && <LearnMore href={learnMoreLink} target="">
                &nbsp; Learn more.
          </LearnMore>}
            </StyledSubtitle>
            {secondParaTitle && <SecondParaTitle>{secondParaTitle}</SecondParaTitle>}
            {secondParaDescription && (
              <SecondParaDescription>{secondParaDescription}</SecondParaDescription>
            )}

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
  min-height: 150px;
  padding: 0 15px;
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    padding: 0px;
  } ;
`;

const StyledTextContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    margin-top: -100px;
  } ;
`;

const StyledPageHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  width: 100%;
  background: linear-gradient(180deg, #2a2827 0%, rgba(42, 40, 39, 0) 100%);
  padding-bottom: ${(props) => props.theme.spacing[6]}px;
  padding-top: ${(props) => props.theme.spacing[6]}px;
  padding-left: 15px;
  padding-right: 15px;
  @media (max-width: 768px) {
    width: auto;
    padding-left: 0px;
    padding-right: 0px;
  } ;
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
  padding-top: 10px;
  font-weight: 300;
  margin: 0;
  max-width: 500px;
  padding: 0;
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
  font-size: 36px;
  font-weight: 700;
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
export default PageHeader;
