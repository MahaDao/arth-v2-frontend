import React from 'react';
import styled from 'styled-components';
import Countdown, { CountdownRenderProps } from 'react-countdown';

interface ProgressCountdownProps {
  base: Date;
  deadline: Date;
  description: string;
}

const ProgressCountdown: React.FC<ProgressCountdownProps> = ({
  base,
  deadline,
  description,
}) => {
  const percentage =
    Date.now() >= deadline.getTime()
      ? 100
      : ((Date.now() - base.getTime()) / (deadline.getTime() - base.getTime())) * 100;

  const countdownRenderer = (countdownProps: CountdownRenderProps) => {
    const { days, hours, minutes, seconds } = countdownProps;
    const h = String(days * 24 + hours);
    const m = String(minutes);
    const s = String(seconds);
    return (
      <StyledCountdown>
        {h.padStart(2, '0')}:{m.padStart(2, '0')}:{s.padStart(2, '0')}
      </StyledCountdown>
    );
  };
  return (
    <Card>
      <ParentContainer>
        <StyledCardContentInner>
          <StyledDesc>{description}</StyledDesc>
          <Countdown date={deadline} renderer={countdownRenderer} />
          <StyledProgressOuter>
            <StyledProgress progress={percentage} />
          </StyledProgressOuter>
        </StyledCardContentInner>
      </ParentContainer>
    </Card>
  );
};

const StyledCountdown = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.theme.color.grey[100]};
  margin: 0 0 6px 0;
`;

const StyledProgressOuter = styled.div`
  width: 100%;
  height: 16px;
  border-radius: 20px;
  background: ${(props) => props.theme.color.grey[700]};
`;

const StyledProgress = styled.div<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  border-radius: 20px;
  background: #f7653b;
`;

const StyledDesc = styled.span`
  color: ${(props) => props.theme.color.grey[500]};
  font-size: 12px;
  text-align: center;
  font-weight: 300;
  line-height: 130%;
  opacity: 0.64;
`;
const ParentContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding: 0 20px;
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
    width: auto;
  };
`;
const StyledCardContentInner = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: start;
  justify-content: start;
  flex-direction: column;
  padding: 20px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(21px);
  border-radius: 12px;
  display: flex;
  flex: 1;
  flex-direction: column;
`;
export default ProgressCountdown;
