import React, { useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Card from '../../../components/InfoCard';
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
  const percentage = useMemo(() => {
    return Date.now() >= deadline.getTime()
      ? 100
      : ((Date.now() - base.getTime()) / (deadline.getTime() - base.getTime())) * 100;
  }, [deadline, base]);

  const countdownRenderer = useCallback((countdownProps: CountdownRenderProps) => {
    const { days, hours, minutes, seconds } = countdownProps;
    const h = String(days * 24 + hours);
    const m = String(minutes);
    const s = String(seconds);
    return (
      <StyledCountdown>
        {h.padStart(2, '0')}:{m.padStart(2, '0')}:{s.padStart(2, '0')}
      </StyledCountdown>
    );
  }, []);

  return (
    <Card>
      <StyledCardContentInner>
        <StyledDesc>{description}</StyledDesc>
        <Countdown date={deadline} renderer={countdownRenderer} />
        <StyledProgressOuter>
          <StyledProgress progress={percentage} />
        </StyledProgressOuter>
      </StyledCardContentInner>
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
  height: 5px;
  border-radius: 15px;
  background: ${(props) => props.theme.color.grey[700]};
`;

const StyledProgress = styled.div<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  border-radius: 15px;
  background: #f7653b;
`;

const StyledDesc = styled.span`
  color: ${(props) => props.theme.color.grey[500]};
  font-weight: 400;
  font-size: 12px;
  text-align: center;
`;

const StyledCardContentInner = styled.div`
  height: 100%;
  display: flex;
  align-items: start;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  padding: ${(props) => props.theme.spacing[2]}px ${(props) => props.theme.spacing[4]}px;
`;

export default ProgressCountdown;
