import React, { useState } from 'react';
import styled from 'styled-components';
import './styles/index.sass';
import { createStyles, makeStyles, Slider, Theme, withStyles } from '@material-ui/core';
import { useMediaQuery } from 'react-responsive';
import arthLogo from './img/arth-coin-1.svg';
import arthLogobg from './images/logo/ARTH-bg.svg';
import Modal from '../../components/NewModal/index';
import rightArrow from './images/polygon.svg';
import USDLogo from './images/logo/USD.svg';
import warning from '../../assets/svg/warning.svg';

import useCore from '../../hooks/useCore';
import config from '../../config';
import { platformURL } from '../../config';

const useSliderStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      // color: 'white'
    },
    margin: {
      height: theme.spacing(3),
    },
  }),
);

function valuetext(value: number) {
  return `${value}`;
}

const PrettoRestrictSlider = withStyles({
  root: {
    // color: 'white',
    height: 15,
    width: '95%',
  },
  thumb: {
    height: 10,
    width: 10,
    // backgroundColor: '#fff',
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
    // color: '#FF7F57',
  },
  marked: {
    color: 'red',
  },
  markLabel: {
    // color: 'green'
  },
  track: {
    height: 3,
    borderRadius: 3,
    color: '#FFA981',
    // top: '2%'
  },
  rail: {
    height: 3,
    borderRadius: 3,
    color: '#D74D26',
    // background:'red'
    // border: '1px solid'
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
    // height: '3px',
    // width: '3px',
    // borderRadius: '50%',
    color: 'transparent',
  },
})(Slider);

const Home: React.FC = () => {
  const isMobile = useMediaQuery({ maxWidth: '600px' });
  const [openModal, toggleModal] = useState(false);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const sliderClasses = useSliderStyles();
  const [sliderValue, setSliderValue] = React.useState(1990);
  const [arthValue, setArth] = useState(2);
  const [fiatValue, setFiat] = useState(1);
  const handleClose = () => {
    toggleModal(false);
  };

  const handleCoffeeValues = (val: number | string) => {
    setFiat(0.6 + (Number(val) - 1990) * 0.2);
    setArth(2 - ((Number(val) - 1990) / 23.3) * 0.1);
  };
  const handleSliderChange = (ev: any, value?: any) => {
    handleCoffeeValues(value);
    setSliderValue(value);
  };

  const core = useCore();
  const token1 = core.tokens.ARTH;

  const tradelink =
    'https://exchange.dfyn.network/#/swap?inputCurrency=0x2791bca1f2de4661ed88a30c99a7a9449aa84174&outputCurrency=0xe52509181feb30eb4979e29ec70d50fd5c44d590';
  // platformURL[config.platform] && platformURL[config.platform].swapUrl
  //   ? `${platformURL[config.platform].swapUrl}?inputCurrency=${'ETH'}&outputCurrency=${token1.address
  //   }`
  //   : `https://app.uniswap.org/#/swap?inputCurrency=${'ETH'}&outputCurrency=${token1.address
  //   }&use=V2`;

  return (
    <div>
      <Modal
        title="Disclaimer"
        titleLogo={
          <img
            alt={'Warning'}
            src={warning}
            height={24}
            style={{ marginRight: 5, alignItems: 'center' }}
          />
        }
        open={openModal}
        handleClose={handleClose}
      // titleLogo={
      //   <img src={InfoOutlinedIcon} alt="" width="24px" style={{ marginRight: '10px' }} />
      // }
      >
        <ModalText>
          <b>
            ARTH and ARTHX are risky assets and there is a probability that you could lose all
            your money. Do not invest if you are not aware of what you are doing.
          </b>
        </ModalText>
        <ModalText>
          Participants from countries under whose national legislation this token may be deemed
          to be a security or a regulated financial instrument are prohibited from participating
          in any manner in token issuance, including indirectly, such as via a proxy or a name
          loan.
        </ModalText>
        <ModalText>
          This token may be deemed to be a security or a regulated financial instrument within
          the meaning of applicable national legislation in China, India, the United States, the
          European Union and / or its individual member nations, Canada, South Korea, Singapore
          and other countries.
        </ModalText>
        <ModalText>
          It is your responsibility to determine whether you are from a country under whose
          national legislation this token may be deemed to be a security or a regulated
          financial instrument, and, if so, to respect the prohibition specified herein.
        </ModalText>
        <ModalHyperLink
          onClick={() =>
            window.open('https://etherscan.io/token/0x0E3cC2c4FB9252d17d07C67135E48536071735D9')
          }
        >
          View token contract on Polygonscan
        </ModalHyperLink>
      </Modal>

      <div id="header-gradient"></div>
      {/*<div className="chakra"></div>*/}
      {/*<div className="gradient-red-1"></div>*/}
      <div className="gradient-red-2"></div>
      <div className="gradient-black-1"></div>
      <section id="section-title">
        <div
          className="title-head"
          data-aos="fade-up"
          data-aos-duration="2000"
          data-aos-once="true"
        >
          <span className="main-title">Timeless value</span>
          <br />
          <span className="title-brand-name">ARTH</span>
          <br />
          {/*<div className="slogans">
            <p className="slogan slogan1">World’s first non-inflationary money.</p>
            <p className="slogan slogan2">ARTH protects you from fiat inflation.</p>
            <p className="slogan slogan3">ARTH protects you from financial crisis.</p>
            <p className="slogan slogan4">ARTH is stable.</p>
            <p className="slogan slogan5">ARTH is lightning fast.</p>
            <p className="slogan slogan6">ARTH is the first stablecoin that is resistant to black swan events.</p>
          </div>*/}
          <div className="slogans">
            <div className="cubespinner">
              <div className="slogan face1">World’s first non-inflationary money.</div>
              <div className="slogan face2">Protects you from financial crisis.</div>
              <div className="slogan face3">Is lightning fast.</div>
              <div className="slogan face4">
                Is the first stablecoin that is resistant to black swan events.
              </div>
              {/*<div className="slogan face5">ARTH protects you from financial crisis.</div>*/}
            </div>
          </div>
        </div>
        {/*<div className="title-down-text">
          <div className="line"></div>
          <div className="text-slide-right">
            <p>
              ARTH.Empowering billions with a <br /> new currency, governed by you.
            </p>
          </div>
        </div>*/}

        <div className="button-container">
          <a target="_blank" href={tradelink} id="no-txt-decoration" rel="noopener noreferrer">
            <button className="button-small-bg">Buy ARTH</button>
          </a>
          <a
            // target="_blank"
            // href="https://www.youtube.com/watch?v=H94S32HXqmU"
            id="no-txt-decoration"
            rel="noopener noreferrer"
            data-toggle="modal"
            data-target="#videoModal"
            href="javascript:void(0)"
            onClick={() => setShowVideo(true)}
          >
            <button className="button-small-transparent">
              <img src={rightArrow} height={20} style={{ marginRight: '8px' }} />
              Imagine. ARTH
            </button>
          </a>
        </div>
      </section>
      {showVideo && (
        <div id="videoModal" className="custom-video-modal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <span
                  className="close-btn"
                  data-dismiss="modal"
                  onClick={() => setShowVideo(false)}
                ></span>
              </div>
              <div className="video-outer">
                <iframe
                  id="video"
                  src="https://www.youtube.com/embed/H94S32HXqmU"
                  frameBorder="0"
                  allow="accelerometer; autoplay;"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}
      <section id="section-main-info">
        <div
          className="main-conatiner"
          data-aos="fade-up"
          data-aos-duration="2000"
          data-aos-once="true"
        >
          <img src={arthLogo} height={45} className="info-logo" />
          <br />
          <p className='main-heading'>ARTH. Never lose buying power of your money.</p>
          <br />
          <p className='section-description'>
            ARTH is designed to fight depreciation of wealth & help you pay less for more.
            Your purchasing power increases as you preserve ARTH. No matter the fluctuation in the market,
            the value of your money never drops.
          </p>
        </div>
      </section>
      <section id="section-token-logos">
        <div className="coin-arth row">
          <div
            className="col-12 col-md-6 token"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-once="true"
          >
            <div
              className="icon-section"
              data-aos="fade-up"
              data-aos-duration="2000"
              data-aos-once="true"
            >
              <div className="pulse1"></div>
              <div className="pulse2"></div>
              <div className="pulse3"></div>
              <div className="pulse4"></div>
              <div className="pulse5"></div>
              <div className="pulse6"></div>
              <div className="pulse7"></div>
              <img
                src={require('./img/arthborderlines.svg')}
                alt="frame"
                className="rightpara-leftfig-img"
              />
              <img
                src={require('./img/arthframe.svg')}
                alt="frame"
                style={{ marginTop: '5px', marginLeft: '3px' }}
                className="rightpara-leftfig-img-inner arth"
              />
            </div>
          </div>
          <div
            className="col-12 col-md-6 side-para"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-once="true"
          >
            <div className="para-text" id="margin-27px-less">
              <div className="pitch">
                <span className="main-title">Fighting Inflation</span>
                <br />
                World’s first valuecoin
              </div>
              <div className="side-text">
                ARTH is a decentralized algorithmic currency that aims to
                fight inflation irrespective of which direction the market moves,
                ARTH coin holders will never lose their purchasing power.
              </div>
              <div className="side-text">
                ARTH gives you financial freedom with no volatility as
                it’s a value-stable currency that you control.
                ARTH means wealth creation, one of the foremost goals of human life.
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="section-rate-info">
        <div className="upper-color-div">
          <p className="main-title">Your money should work for you, not against you</p>
        </div>
        <div className="rate-main-container">
          <div className="left-container">
            {/* slider Space */}
            <p className="title">Value over time to buy one cup of coffee</p>
            <p className="sub-title">
              Compare value with years <span className="tag">{sliderValue}</span>
            </p>
            <div
              style={{ width: isMobile ? '95%' : '75%', paddingInlineStart: isMobile ? 15 : 0 }}
            >
              <PrettoRestrictSlider
                defaultValue={1990}
                getAriaValueText={valuetext}
                valueLabelFormat={valuetext}
                onChange={handleSliderChange}
                // aria-label="pretto slider"
                step={1}
                marks
                min={1990}
                max={2060}
                valueLabelDisplay="off"
              />
              <div
                style={{
                  marginTop: -15,
                  marginLeft: -15,
                  marginBottom: 15,
                  display: 'flex',
                  // width: '99%',
                  justifyContent: 'space-between',
                }}
              >
                <TimeSpan>1990</TimeSpan>
                <TimeSpan>2060</TimeSpan>
              </div>
            </div>
          </div>
          <div className="right-container">
            <div className="rate-card">
              <div className="rate-input">
                <div className="rate-value-card">
                  <span className="value positive">${arthValue.toFixed(2)}</span>
                  <img src={arthLogobg} alt='ARTH Logo' height={36} />
                </div>
                <p className="input-label">ARTH Value Coin</p>
              </div>
              <div className="rate-input">
                <div className="rate-value-card">
                  <span className="value negative">${fiatValue.toFixed(2)}</span>
                  <img src={USDLogo} alt='Fiat Logo' height={36} />
                </div>
                <p className="input-label">Fiat Currency</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="section-two-features">
        <p className="title">
          ARTH is the future of money filling up
          your wallet soon with the maximum buying power
        </p>
        <div className="card-deck row">
          <div className="col-lg-6 col-sm-12">
            <div
              className="card"
              data-aos="fade-up"
              data-aos-duration="500"
              data-aos-once="true"
            >
              <div
                className="img-container img-container-head"
                data-aos="fade-up"
                data-aos-duration="2000"
                data-aos-once="true"
              >
                <img
                  src={require('./img/feature-icon/f-icon-1.svg')}
                  className="img-top"
                  alt="..."
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">Preserve Buying Power</h5>
                <p className="card-text">
                  No more erosion of hard-earned wealth due to inflation. ARTH protects and
                  increases your purchasing power shielding your financial life from the effects
                  of excessive money printing.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-sm-12">
            <div
              className="card"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-once="true"
            >
              <div
                className="img-container img-container-head"
                data-aos="fade-up"
                data-aos-duration="2000"
                data-aos-once="true"
              >
                <img
                  src={require('./img/feature-icon/f-icon-5.svg')}
                  className="img-top"
                  alt="..."
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">Promote Social good</h5>
                <p className="card-text">
                  Protecting generations of hard-earned wealth for billions around the world,
                  including for social, environmental and governance causes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="section-application">
        <p className="title">Application & Usage</p>
        <p className="subtitle">
          ARTH is for students, shoppers, tourists, businessmen, employees,
          passengers, institutions & governments. Anyone exchanging value.
        </p>
        <div className="planet-container"></div>
      </section>
      <section id="section-technology">
        <div className="main-container">
          <p className="title">Technology</p>
          <p className="subtitle">
            ARTH is an algorithmic value-stable coin built using
            robust strategies like vault optimization,
            auto collateralisation ratio, automatic rebalancing mechanism,
            anti-correlated asset selection, purchasing power pegging,
            oracle pricefeeds and more. </p>
          <div className="tech-container">
            <div className="feature-image">
              <img
                src={require('./img/feature-icon/Cross-borader transactions.svg')}
                alt="..."
                height={250}
              />
            </div>
            <div className="tech-info">
              <p className="info-title">Cross-border transactions</p>
              <p className="info-desc">
                Deployed on Layer 2 Protocol,
                ARTH offers a transaction speed of less than 3 seconds to cross the border from your wallet
                to another across the globe.
                The very near future version of ARTH shall be a cross-chain solution that brings
                the power of value coin to other blockchains like Ethereum and more
              </p>

            </div>
          </div>
          <div className="tech-container">
            <div className="feature-image">
              <img
                src={require('./img/feature-icon/Cross-chain liquidity.svg')}
                alt="..."
                height={250}
              />
            </div>
            <div className="tech-info">
              <p className="info-title">Cross-chain liquidity</p>
              <p className="info-desc">
                ARTH is compatible with tokens and currencies from other
                blockchains to create a massive liquidity pool across the chains.
                You can stake, lend, borrow, trade ARTH across chains. (coming soon)
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="section-revolution">
        <div className="main-container">
          <p className="title">Lead the revolution</p>
          <p className="subtitle">
            ARTH eliminates price instability and value erosion.
            Control your financial future, increase your money’s worth.
          </p>
          <div className="cards-container row">
            <div className="col-lg-4 col-md-4 col-sm-12 custom-col">
              <div className="Icard">
                <span className="text">
                  A revolutionary medium of exchange whose purchasing power grows with you.
                </span>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 custom-col">
              <div className="Icard">
                <span className="text">
                  A timeless store of value that is preserved across generations.
                </span>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 custom-col">
              <div className="Icard">
                <span className="text">
                  A decentralised Money that is governed by the community, and by you.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <section
        id="section-arth-backed"
        data-aos="fade-up"
        className="hide-pie-on-phone"
        data-aos-duration="2000"
        data-aos-once="true"
      >
        <div className="main-title">ARTH Global Measurement Unit</div>

        <div className="backed-circle">
          <div className="logo-icon">
            <img
              className="img"
              src={require('./images/mahadao-protocol/logo-icon.svg')}
              alt=""
            />
            <p>
              <strong>ARTH</strong>
            </p>
          </div>

          <div className="logo-icon arrow-icon">
            <p>Pegged to</p>
            <img className="img" src={require('./images/orange-green-arrow.svg')} alt="" />
          </div>

          <div className="chart-circle">
            <img className="img" src={require('./images/chart-circle.svg')} alt="" />
            <p>
              <strong>Global Measurement Unit (GMU)</strong>
            </p>
          </div>

          <ul className="chart-text">
            <li>80% Fiat</li>
            <li>15% Gold</li>
            <li>5% Bitcoin</li>
          </ul>
        </div>
      </section>*/}
      {/* <section className="arth-section" id="arth-tech">
        <div
          className="arth-heading arth-heading-regular"
          id="arth-tech-title"
          data-aos="fade-up"
          data-aos-duration="2000"
          data-aos-once="true"
        >
          Technology
          <div
            className="arth-para arth-para-regular"
            id="arth-maha-dao-para"
            data-aos="fade-up"
            data-aos-duration="2000"
            data-aos-once="true"
          >
            ARTH is an algorithmic value-stable coin built using robust strategies like vault
            optimization,
            <br />
            auto collateralisation ratio, automatic rebalancing mechanism, anti-correlated asset
            <br />
            selection, purchasing power pegging, oracle price feeds and more.
          </div>
          <section className="col-12 col-md-5 " id="arth-cross-border">
            <div
              className="arth-heading arth-heading-regular"
              id="arth-cross-border-title"
              data-aos="fade-up"
              data-aos-duration="2000"
              data-aos-once="true"
            >
              <span id="arth-cross-border-img"></span>
              Elastic Supply
              <div
                className="arth-para arth-para-regular"
                id="arth-cross-border-para"
                data-aos="fade-up"
                data-aos-duration="2000"
                data-aos-once="true"
              >
                ARTH is not dependent on depositing any kind of collateral
                and can easily scale to meet the organic demand for the coin.
              </div>
            </div>
          </section>
          <section className="col-12 col-md-5 " id="arth-cross-border">
            <div
              className="arth-heading arth-heading-regular"
              id="arth-cross-border-title"
              data-aos="fade-up"
              data-aos-duration="2000"
              data-aos-once="true"
            >
              <span id="arth-cross-chain-img"></span>
              Uniswap Integration
              <div
                className="arth-para arth-para-regular"
                id="arth-cross-border-para"
                data-aos="fade-up"
                data-aos-duration="2000"
                data-aos-once="true"
              >
                ARTH ensures stability by incentivising actors to buy back
                ARTH when it is trading below it's target price and sell ARTH
                when it is trading above.
              </div>
            </div>
          </section>
        </div>
      </section> */}
      {/* <section className="arth-section" id="arth-lead-rev">
        <div
          className="arth-heading"
          id="arth-maha-dao-title"
          data-aos="fade-up"
          data-aos-duration="2000"
          data-aos-once="true"
        >
          Lead the revolution
          <div
            className="arth-para arth-para-regular"
            id="arth-maha-dao-para"
            data-aos="fade-up"
            data-aos-duration="2000"
            data-aos-once="true"
          >
            ARTH eliminates price instability and value erosion. Control your financial future,
            increase your money’s worth.
          </div>
          <div className="arth_lead_flex row">
            <div className="padding-none col-12 col-md-4">
              <div className="arth-gradient-orange-border"></div>
              <div
                className="arth_lead_flex_card"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-once="true"
              >
                <div className="arth_lead_flex_card_text">
                  A revolutionary medium of exchange whose purchasing power grows with you.
                </div>
              </div>
            </div>
            <div className="padding-none col-12 col-md-4">
              <div className="arth-gradient-orange-border"></div>
              <div
                className="arth_lead_flex_card"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-once="true"
              >
                <div className="arth_lead_flex_card_text">
                  A timeless store of value that is preserved across the generations.
                </div>
              </div>
            </div>
            <div className="padding-none col-12 col-md-4">
              <div className="arth-gradient-orange-border"></div>
              <div
                className="arth_lead_flex_card"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-once="true"
              >
                <div className="arth_lead_flex_card_text">
                  A decentralised Money that is governed by the community, and by you.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/*<section
        className="text-center"
        id="arth-section-title"
        data-aos="fade-up"
        data-aos-duration="2000"
        data-aos-once="true"
      >
        <div className="arth-heading arth-heading-regular main-title">
          ARTH. Money Reinvented.
          <div className="arth-para arth-para-regular" id="arth-section-title-sub">
            Join the mission as we establish a new standard of money. A better money.
          </div>
        </div>
        <div id="padding-top-30">
          <a
            target="_blank"
            href="https://mahaswap.com/"
            rel="noopener noreferrer"
            id="no-txt-decoration"
          >
            <button className="button-small">Buy ARTH Now →</button>
          </a>
        </div>
      </section>*/}
      {/* Footers */}
      <footer>
        <div className="footer-content">
          <div className="top-most">
            <div className="msg">
              <p className="title">
                ARTH. Money Reinvented
              </p>
              <p className="subtitle">
                Join the mission as we establish a new standard of money. A better money.
              </p>
            </div>
            <div className="action-button">
              <a
                target="_blank"
                href={tradelink}
                id="no-txt-decoration"
                rel="noopener noreferrer"
              >
                <button className="button-small-bg">Buy ARTH Now</button>
              </a>
            </div>
          </div>
          <div className="row bottom-most">
            <div className="col-12 col-sm-6 bottom-left">
              <FooterEnd>
                {/*<div className="dialog-class">*/}
                {/*  /!*<span style={{ whiteSpace: 'nowrap', marginRight: '15px' }}>POWERED BY</span>*!/*/}
                {/*  <img*/}
                {/*    src={require('./images/mainlogo.svg')}*/}
                {/*    alt="mahadao-logo"*/}
                {/*    width="140px"*/}
                {/*  />*/}
                {/*</div>*/}
                <StyledLink
                  href="https://mahadao.com/"
                  target="_blank"
                  style={{ marginLeft: 0 }}
                >
                  MAHADAO
                </StyledLink>
                <StyledLink href="https://docs.arthcoin.com" target="_blank">
                  Whitepaper
                </StyledLink>
              </FooterEnd>
            </div>
            <div className="col-12 col-sm-6 bottom-right">
              <div className="social-items">
                <a id="social-twitter" href="https://twitter.com/TheMahaDAO" rel="noopener noreferrer" target="_blank">
                  <button className="button3">
                    <i className="fab fa-twitter" />
                  </button>
                </a>
                <a id="social-medium" href="https://medium.com/mahadao" rel="noopener noreferrer" target="_blank">
                  <button className="button3">
                    <i className="fab fa-medium" />
                  </button>
                </a>
                <a id="social-telegram" href="https://t.me/MahaDAO" rel="noopener noreferrer" target="_blank">
                  <button className="button3">
                    <i className="fab fa-telegram-plane" />
                  </button>
                </a>
                <a id="social-github" href="https://github.com/mahadao" rel="noopener noreferrer" target="_blank">
                  <button className="button3">
                    <i className="fab fa-github" />
                  </button>
                </a>
                <a id="social-reddit" href="https://www.reddit.com/r/MahaDAO/" rel="noopener noreferrer" target="_blank">
                  <button className="button3">
                    <i className="fab fa-reddit" />
                  </button>
                </a>
                <a id="social-discord" href="http://discord.gg/mahadao" rel="noopener noreferrer" target="_blank">
                  <button className="button3">
                    <i className="fab fa-discord" />
                  </button>
                </a>
              </div>
            </div>
          </div>
          <div id="footer-gradient"></div>
        </div>
      </footer>
    </div>
  );
};

const TimeSpan = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.88);
`;

const FooterEnd = styled.div`
  font-family: 'Syne', sans-serif;
  text-align: center;
  font-weight: 700;
  float: right;
  color: #ababab;
  font-size: 18px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;
const StyledLink = styled.a`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 150%;
  opacity: 0.88;
  color: rgba(255, 255, 255, 0.64);
  margin-right: 32px;
  text-decoration: none;
  cursor: pointer;
  margin-left: 40px;
  &:hover {
    opacity: 0.88;
    color: #ffffff;
    text-decoration: none;
    margin-left: 40px;
  }
  @media (max-width: 768px) {
    margin: 0;
  }
`;
const ModalText = styled.div`
  text-align: left;
  margin-bottom: 15px;
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 140%;
  color: rgba(255, 255, 255, 0.64);
`;
const ModalHyperLink = styled.div`
  font-weight: 300;
  cursor: pointer;
  font-size: 16px;
  line-height: 150%;
  text-decoration-line: underline;
  text-align: center;
  color: rgba(255, 255, 255, 0.64);
  margin-top: 20px;
`;
export default Home;
