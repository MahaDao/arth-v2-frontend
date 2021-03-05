import React, { useEffect } from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { useParams } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Container from '../../components/Container';
 import PageHeader from '../../components/PageHeader';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import useBank from '../../hooks/useBank';
import useRedeem from '../../hooks/useRedeem';
import { Bank as BankEntity } from '../../basis-cash';
import StakingIcon from '../Banks/staking.png';

const Bank: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0));

  const { bankId } = useParams<{ bankId: string }>();
  const bank = useBank(bankId);

  const { onRedeem } = useRedeem(bank);

  return bank ? (
    <>
      <PageHeader
        icon={<img alt="staking" src={StakingIcon} />}
        subtitle={`Deposit ${bank?.depositTokenName} and earn ${bank?.earnTokenName}`}
        title={bank?.name}
      />
      <Container size="lg">
        <div className="border-bottom width-100 margin-bottom-20" />
        <Grid container spacing={5} justify="center" alignItems="stretch">
          <Grid container item xs={12} md={6} lg={6} xl={6}>
            <StyledCardsWrapper>
              <StyledCardWrapper>
                <Harvest bank={bank} />
              </StyledCardWrapper>
              <Divider />
              <StyledCardWrapper>
                <Stake bank={bank} />
              </StyledCardWrapper>
            </StyledCardsWrapper>
          </Grid>
          <Grid container item xs={12} md={6} lg={6} xl={6} justify="flex-end">
            <ParentContainer>
              {bank.depositTokenName.includes('LP') && <LPTokenHelpText bank={bank} />}
              <BankButtonContainer>
                <Button onClick={onRedeem} text="Settle & Withdraw" />
              </BankButtonContainer>
            </ParentContainer>
          </Grid>
        </Grid>
      </Container>
    </>
  ) : (
    <BankNotFound />
  );
};

const LPTokenHelpText: React.FC<{ bank: BankEntity }> = ({ bank }) => {
  let uniswapUrl: string;
  if (bank.depositTokenName.includes('ARTH')) {
    uniswapUrl =
      'https://app.uniswap.org/#/add/0x6B175474E89094C44Da98b954EedeAC495271d0F/0x0e3cc2c4fb9252d17d07c67135e48536071735d9';
  } else {
    uniswapUrl = 'https://app.uniswap.org/#/add/ETH/0xB4d930279552397bbA2ee473229f89Ec245bc365';
  }
  return (
    <StyledLink href={uniswapUrl} target="_blank">
    </StyledLink>
  );
};

const BankNotFound = () => {
  return (
    <Center>
      <PageHeader title="Not Found" subtitle="You've hit a bank just robbed by unicorns." />
    </Center>
  );
};

const Divider = styled.div`
  background: #000;
  opacity: 0.2;
  height: 1px;
`;
const ParentContainer = styled.div`
  display: flex;
  justify-content: right;
  flex-direction: column;
`;
const StyledLink = styled.a`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.88);
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  width: 100%;

  background: ${(props) => props.theme.color.gradients.dark_linear};
  box-shadow: 0px 12px 20px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;
const BankButtonContainer = styled.div`
  max-width: 250px;
  margin-top: 20px;
  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    padding-left: 0px;
    padding-right: 0px;
  } ;
`;

export default Bank;
