import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from '../../components/NewModal/index';
import TopBar from '../../components/TopBar';
import './styles/index.sass';
import './footer.css';

const Home: React.FC = () => {
  const [openModal, toggleModal] = useState(false);
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
          ARTH 2.0

          <br />
          <span className="main-title">
            Launching Soon!
          </span>
        </div>
        <div className="title-down-text">
          <div className="line"></div>
          <div className="text-slide-right">
            <p>
              A groundbreaking new version of ARTH combining the best of algo stablecoins throughout the space is coming soon!
            </p>
          </div>
        </div>

        <div id="padding-top-30">
          <a target="_blank" href="https://medium.com/mahadao/introducing-arth-v2-7e94683d49e8" id="no-txt-decoration" rel="noopener noreferrer">
            <button className="button-small">Learn More →</button>
          </a>
        </div>
      </section>
    </div>
  );
};

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
