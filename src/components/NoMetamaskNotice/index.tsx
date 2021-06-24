import React from 'react';
import styled from 'styled-components';
import {
  Checkbox,
  CheckboxProps,
  createStyles,
  makeStyles,
  Slider,
  Theme,
  withStyles,
} from '@material-ui/core';

import Button from '../Button';

import metamask from '../../assets/img/metamask.png';

withStyles({
  root: {
    color: 'rgba(255, 255, 255, 0.32)',
    '&$checked': {
      color: '#FF7F57',
    },
  },
  checked: {
    color: 'white',
  },
})((props: CheckboxProps) => <Checkbox {...props} />);

makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    margin: {
      height: theme.spacing(3),
    },
  }),
);

withStyles({
  root: {
    height: 15,
    width: '95%',
  },
  thumb: {
    height: 10,
    width: 10,
    border: '2px solid currentColor',
    color: '#FFA981',
    marginTop: -3.5,
    marginLeft: -3,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-100% - 5px)',
  },
  marked: {
    color: 'red',
  },
  markLabel: {},
  track: {
    height: 3,
    borderRadius: 3,
    color: '#FFA981',
  },
  rail: {
    height: 3,
    borderRadius: 3,
    color: '#D74D26',
  },
  markLabelActive: {
    fontStyle: 'normal',
    fontWeight: 300,
    fontSize: '12px',
    lineHeight: '130%',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.88)',
  },
  mark: {
    color: 'transparent',
  },
})(Slider);

const NoMetamaskNotice = () => {
  return (
    <MainDiv>
      <ConnectionNote>
        <SwitchBox>
          <Parts>
            <PartsTitle>
              You do not have metamask extension installed in your browser.
            </PartsTitle>
            <PartsSubtitle>
              Install metamask to take part in genesis.
            </PartsSubtitle>
            <br />
            <PartsSubtitle>
              <img src={metamask} alt="calendar" height={64} style={{ marginBottom: '12px' }} />
              <Button
                size={'sm'}
                href={'https://metamask.io'}
                text={'Install metamask'}
              >
              </Button>
            </PartsSubtitle>
          </Parts>
        </SwitchBox>
      </ConnectionNote>
    </MainDiv>
  );
};

const MainDiv = styled.div`
  width: 100vw;
  height: calc(100vh - 72px);
`;

const ConnectionNote = styled.div`
  max-width: 500px;
  text-align: center;
  color: #fff;
  margin: 0 auto 0 auto;
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: rgba(255, 255, 255, 0.88);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media (max-width: 600px) {
    width: 90%;
    top: 32px;
    left: 5%;
    transform: translate(0, 0);
  }
`;

const SwitchBox = styled.div`
  background: linear-gradient(180deg, #48423e 0%, #373030 100%);
  box-shadow: 0px 8px 16px -2px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  text-align: center;
  margin-top: 12px;
  padding: 32px 32px;
`;

const Parts = styled.a`
  text-align: center;
  cursor: pointer;
  padding: 30px 30px;
`;

const PartsTitle = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  color: rgba(255, 255, 255, 0.88);
  margin-bottom: 2px;
`;

const PartsSubtitle = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 135%;
  text-align: center;
  color: rgba(255, 255, 255, 0.64);
  margin-bottom: 0;
`;

const AddPolygon = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #ff7f57;
  cursor: pointer;
`;

export default NoMetamaskNotice;
