import React, { useState } from 'react';
import styled from 'styled-components';
import InfoOutlinedIcon from '../../assets/img/InfoIcon.svg';
import Modal from '../../components/NewModal/index';
import TopBar from '../../components/TopBar';
import './styles/index.sass';
import './footer.css';

const Home: React.FC = () => {
  const [openModal, toggleModal] = useState(true);
  const handleClose = () => {
    toggleModal(false);
  };
  return (
    <div>
      <Modal
        title="Disclaimer"
        open={openModal}
        handleClose={handleClose}
        // titleLogo={
        //   <img src={InfoOutlinedIcon} alt="" width="24px" style={{ marginRight: '10px' }} />
        // }
      >
        <ModalText>
          <b>
            ARTH and ARTH Bonds are risky assets and there is a probability that you could lose
            all your money. Do not invest if you are not aware of what you are doing.
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
          View token contract on Etherscan
        </ModalHyperLink>
      </Modal>
      <TopBar />
      <div id="header-gradient"></div>
      <div className="chakra"></div>
      <div className="gradient-red-1"></div>
      <div className="gradient-red-2"></div>
      <div className="gradient-black-1"></div>
      <section id="section-title">
        <div
          className="title-head"
          data-aos="fade-up"
          data-aos-duration="2000"
          data-aos-once="true"
        >
          <span className="main-title">Timeless value.</span>
          <br />
          World’s first non-depreciating money.
        </div>
        <div className="title-down-text">
          <div className="line"></div>
          <div className="text-slide-right">
            <p>
              ARTH.Empowering billions with a <br /> new currency, governed by you.
            </p>
          </div>
        </div>

        <div id="padding-top-30">
          <a target="_blank" href="https://mahaswap.com/" id="no-txt-decoration">
            <button className="button-small">Buy ARTH Now →</button>
          </a>
        </div>
      </section>
      <section id="section-three-features">
        <div className="card-deck row">
          <div className="col-12 col-md-4">
            <div
              className="card height-100"
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
                <h5 className="card-title">Preserve Wealth</h5>
                <p className="card-text">
                  No more erosion of hard-earned wealth due to inflation. ARTH protects and
                  increases your purchasing power shielding your financial life from the effects
                  of excessive money printing.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div
              className="card height-100"
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
                  src={require('./img/feature-icon/f-icon-2.svg')}
                  className="img-top"
                  alt="..."
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">Value Stable</h5>
                <p className="card-text">
                  ARTH is pegged against a Global Measurement Unit consisting of a
                  well-diversified, anti-correlated, carefully curated basket of assets to
                  provide ARTH users a lasting stability of intrinsic value.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div
              className="card height-100"
              data-aos="fade-up"
              data-aos-duration="1500"
              data-aos-once="true"
            >
              <div
                className="img-container img-container-head"
                data-aos="fade-up"
                data-aos-duration="2000"
                data-aos-once="true"
              >
                <img
                  src={require('./img/feature-icon/f-icon-4.svg')}
                  className="img-top"
                  alt="..."
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">Elastic Supply</h5>
                <p className="card-text">
                  Arth has an elastic supply, which means its supply can easily grow or shrink
                  to meet the current market demand
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div
        className="outer-div"
        style={{
          background:
            'linear-gradient(360deg, rgba(22, 22, 22, 0.8) 29.94%, rgba(22, 22, 22, 0.510647) 72.76%, rgba(22, 22, 22, 0) 102.62%)',
        }}
      >
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
                  Fighting Depreciation
                  <br />
                  World's first valuecoin
                </div>
                <div className="side-text">
                  ARTH is a decentralized algorithmic currency that aims to fight depreciation.
                  Irrespective of which direction the market moves, ARTH coin holders will never
                  lose their buying power.
                </div>
                <div className="side-text">
                  ARTH gives you financial freedom with no volatility as it’s a value-stable
                  currency that you control. ARTH means wealth creation, one of the foremost
                  goals of human life.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* This is for Chart */}
      <section
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
      </section>
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
      <section
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
          <a target="_blank" href="https://mahaswap.com/" id="no-txt-decoration">
            <button className="button-small">Buy ARTH Now →</button>
          </a>
        </div>
      </section>
      {/* Footers */}
      <footer>
        <div className="footer-content">
          <div className="row bottom-most">
            <div className="col-12 col-sm-6">
              <div className="social-items">
                <a id="social-twitter" href="https://twitter.com/TheMahaDAO">
                  <button className="button3">
                    <i
                      className="fab fa-twitter"
                      style={{ marginTop: '12px', marginLeft: '12px' }}
                    ></i>
                  </button>
                </a>
                <a id="social-medium" href="https://medium.com/mahadao">
                  <button className="button3">
                    <i
                      className="fab fa-medium"
                      style={{ marginTop: '12px', marginLeft: '12px' }}
                    ></i>
                  </button>
                </a>
                <a id="social-telegram" href="https://t.me/MahaDAO">
                  <button className="button3">
                    <i
                      className="fab fa-telegram-plane"
                      style={{ marginTop: '12px', marginLeft: '10px' }}
                    ></i>
                  </button>
                </a>
                <a id="social-github" href="https://github.com/mahadao">
                  <button className="button3">
                    <i
                      className="fab fa-github"
                      style={{ marginTop: '11.5px', marginLeft: '11.5px' }}
                    ></i>
                  </button>
                </a>
                <a id="social-reddit" href="https://www.reddit.com/r/MahaDAO/">
                  <button className="button3">
                    <i
                      className="fab fa-reddit"
                      style={{ marginTop: '10.5px', marginLeft: '10.5px' }}
                    ></i>
                  </button>
                </a>
                <a id="social-discord" href="https://discord.gg/V6sr3fe">
                  <button className="button3">
                    <i
                      className="fab fa-discord"
                      style={{ marginTop: '12px', marginLeft: '12px' }}
                    ></i>
                  </button>
                </a>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <FooterEnd>
                <StyledLink href="https://docs.arthcoin.com" target="_blank">
                  Arth GitBook
                </StyledLink>
                <div className="dialog-class">
                  <span style={{ whiteSpace: 'nowrap', marginRight: '15px' }}>POWERED BY</span>
                  <img src={require('./images/mainlogo.svg')} alt="mahadao-logo" width="140px" />
                </div>
              </FooterEnd>
            </div>
          </div>
          <div id="footer-gradient"></div>
        </div>
      </footer>
    </div>
  );
};
const FooterEnd = styled.div`
  font-family: 'Syne', sans-serif;
  text-align: center;
  font-weight: 700;
  float: right;
  color: #ababab;
  font-size: 18px;
  padding-top: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const StyledLink = styled.a`
  font-weight: bold;
  text-decoration: none;
  font-size: 18px;
  line-height: 22px;
  color: #ffffff;
  margin-right: 32px;
  cursor: pointer;
  color: #ffffff;
  opacity: 0.64;
  &:hover {
    opacity: 0.88;
    color: #ffffff;
    text-decoration: none;
  }
  @media (max-width: 768px) {
    margin-top: 32px;
    margin-bottom: 32px;
    margin-top: 0px;
  }
`;
const ModalText = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  text-align: left;
  margin-bottom: 15px;
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
