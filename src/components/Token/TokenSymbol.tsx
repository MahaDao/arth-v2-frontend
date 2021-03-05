import React from 'react';

import bacLogo from '../../assets/img/basis-cash-logo.svg';
import basLogo from '../../assets/img/basis-share-logo.svg';
// import babLogo from '../../assets/img/basis-bond-logo.svg';
import mahaLogo from '../../assets/img/MAHA.png';
import arthLogo from '../../assets/img/ARTH.png';
import arthBLogo from '../../assets/img/ARTHB.png';
import yCRVLogo from '../../assets/img/ycrv.png';
import DAILogo from '../../assets/img/DAI.png';
import sUSDLogo from '../../assets/img/sUSD.png';
import USDCLogo from '../../assets/img/USDC.png';
import USDTLogo from '../../assets/img/USDT.png';

import ETH from '../../assets/img/ethereum.png';
import MKR from '../../assets/img/MAKER.webp';
import BAS from '../../assets/img/BAS.webp';
import SHARE from '../../assets/img/SHARE.webp';
import COMP from '../../assets/img/COMP.webp';
import ESD from '../../assets/img/ESD.webp';
import SUSHI from '../../assets/img/SUSHI.webp';
import CURVE from '../../assets/img/CURVE.webp';
import FRAX from '../../assets/img/frax.jpg';
import YFI from '../../assets/img/YFI.webp';
import DSD from '../../assets/img/DSD.webp';
import MATIC from '../../assets/img/Matic.webp';
import RSR from '../../assets/img/RSR.webp';

const logosBySymbol: { [title: string]: string } = {
  ARTH: arthLogo,
  MAHA: mahaLogo,
  ARTHB: arthBLogo,
  yCRV: yCRVLogo,
  DAI: DAILogo,
  SUSD: sUSDLogo,
  USDC: USDCLogo,
  USDT: USDTLogo,

  MKR: MKR,
  BAS: BAS,
  SHARE: SHARE,
  COMP: COMP,
  ESD: ESD,
  SUSHI: SUSHI,
  ETH: ETH,
  CURVE: CURVE,
  FRAX: FRAX,
  FXS: FRAX,
  YFI: YFI,
  DSD: DSD,
  MATIC: MATIC,
  RSR: RSR,

  'ARTH_DAI-UNI-LPv2': bacLogo,
  'ARTH_DAI-MAHA-LPv1': bacLogo,
  'BAC_DAI-UNI-LPv2': bacLogo,
  'MAHA_ETH-UNI-LPv2': mahaLogo,
  'BAS_DAI-UNI-LPv2': basLogo,
};

type BasisLogoProps = {
  symbol: string;
  size?: number;
};

const TokenSymbol: React.FC<BasisLogoProps> = ({ symbol, size = 64 }) => {
  if (!logosBySymbol[symbol]) {
    // throw new Error(`Invalid BasisLogo symbol: ${symbol}`);
    return <img src={logosBySymbol['DAI']} alt={`${symbol} Logo`} width={size} height={size} />;
  }
  return (
    <img
      src={logosBySymbol[symbol]}
      alt={`${symbol} Logo`}
      style={{ borderRadius: '100%' }}
      width={size}
      height={size}
    />
  );
};

export default TokenSymbol;
