import styled from 'styled-components';
import React, { useState } from 'react';
import { Grid } from '@material-ui/core';

import Container from '../../components/Container';
import FarmingCards from './components/FarmingCards';
import PageHeader from '../../components/PageHeader';

import { stakingContracts } from '../../config';

export interface ModeProps {
  id: string;
  name: string;
  count: number;
}

const Banks = () => {
  let initMode = { id: 'all', name: 'All', count: 3 };

  const [mode, setMode] = useState<ModeProps>(initMode);

  let headerList: ModeProps[] = [
    {
      id: 'all',
      name: 'All',
      count: stakingContracts.length,
    },
    {
      id: 'arth',
      name: 'ARTH Staking',
      count: stakingContracts.filter((d) => d.categories.includes('arth')).length,
    },
    {
      id: 'arthx',
      name: 'ARTHX Staking',
      count: stakingContracts.filter((d) => d.categories.includes('arthx')).length,
    },
    {
      id: 'maha',
      name: 'MAHA Staking',
      count: stakingContracts.filter((d) => d.categories.includes('maha')).length,
    },
  ];

  return (
    <>
      <GradientDiv />
      <PageHeader
        title="Farming"
        subtitle="Earn rewards by staking your tokens and helping the protocol grow."
      />
      <Container size="lg">
        <div style={{ position: 'relative', display: 'flex' }}>
          <ScrollDiv style={{ overflowX: 'scroll' }}>
            <ButtonGroupDiv>
              {headerList.map((obj) => (
                <TextDiv
                  style={
                    mode.name === obj.name
                      ? {
                        background: mode.name === obj.name ? '#423B38' : 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }
                      : {}
                  }
                  key={obj?.id}
                  onClick={() => setMode(obj)}
                >
                  <Text1>{obj?.name}</Text1>
                  <Text2>{obj?.count}</Text2>
                </TextDiv>
              ))}
            </ButtonGroupDiv>
          </ScrollDiv>
        </div>
        <div className="width-100 margin-bottom-30 margin-top-10" />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <FarmingCards mode={mode} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

const GradientDiv = styled.div`
  background: linear-gradient(180deg, #2a2827 0%, rgba(42, 40, 39, 0) 100%);
  height: 270px;
  position: absolute;
  width: 100%;
  z-index: -5;
`;

const ButtonGroupDiv = styled.div`
  background: #2a2827;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px 0;
  flex-wrap: wrap;
  width: max-content;
`;

const TextDiv = styled.div`
  height: 40px;
  display: inline-flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  border-radius: 4px;
  margin: 0px 6px;
  padding: 0px 12px;
  cursor: pointer;
  &:hover {
    background: #423b3860;
  }
`;

const ScrollDiv = styled.div`
  ::-webkit-scrollbar {
    height: 0px;
    background: transparent; /* make scrollbar transparent */
  }
`;

const Text1 = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  margin: 0;
`;

const Text2 = styled.p`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 2px 5px;
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 130%;
  color: #ffffff;
  margin: 0px 5px;
`;

export default Banks;
