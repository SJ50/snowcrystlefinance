import React from 'react';

//Graveyard ecosystem logos
import tombLogo from '../../assets/img/SVG_Icons_and_web_bg/SNOW-Icon-01.svg';
import tShareLogo from '../../assets/img/SVG_Icons_and_web_bg/GLCR-Icon-01.svg';
import wbtcLogoPNG from '../../assets/img/wbtc.png';
import tShareLogoPNG from '../../assets/img/snoshare.png';
import tBondLogo from '../../assets/img/SVG_Icons_and_web_bg/Bond icon-01.svg';

import tombFtmLpLogo from '../../assets/img/SVG_Icons_and_web_bg/SNOW-USDC-LP-01.svg';
import tshareFtmLpLogo from '../../assets/img/SVG_Icons_and_web_bg/SHARE-USDC-LP-01.svg';

import wftmLogo from '../../assets/img/USDC.png';
import SnowLogo from '../../assets/img/Snow-coin.png';
import booLogo from '../../assets/img/spooky.png';
import zooLogo from '../../assets/img/zoo_logo.svg';
import shibaLogo from '../../assets/img/shiba_logo.svg';
import snobondLogoPNG from '../../assets/img/snobond.png';
import foxLogoPNG from '../../assets/img/fox.png';
import dibsLogoPNG from '../../assets/img/dibs.png';
import usdtLogoPNG from '../../assets/img/usdt.png';
import usdcLogoPNG from '../../assets/img/USDC.png';
import avaxLogoPNG from '../../assets/img/avax.png';
import grapeLogoPNG from '../../assets/img/grape.png';
import grapeSnowLP from '../../assets/img/grape-Snow.png';

const logosBySymbol: { [title: string]: string } = {
  //Real tokens
  //=====================
  WAVAX: avaxLogoPNG,
  TOMB: tombLogo,
  // TOMBPNG: tombLogoPNG,
  TSHAREPNG: tShareLogoPNG,
  GLCR: tShareLogo,
  SBOND: tBondLogo,
  WFTM: wftmLogo,
  SNOW: tombLogo,
  BOO: booLogo,
  SHIBA: shibaLogo,
  ZOO: zooLogo,
  WBTC: wbtcLogoPNG,
  SNOSHARE: tShareLogoPNG,
  SNOBOND: snobondLogoPNG,
  FOX: foxLogoPNG,
  DIBS: dibsLogoPNG,
  GRAPE: grapeLogoPNG,
  USDT: usdtLogoPNG,
  USDC: usdcLogoPNG,
  'SNOW-USDC-LP': tombFtmLpLogo,
  'GLCR-USDC-LP': tshareFtmLpLogo,
  'GRAPE-SNOW-LP': grapeSnowLP,
  'SNO-SNOSHARE-LP': tshareFtmLpLogo,
};

type LogoProps = {
  symbol: string;
  size?: number;
};

const TokenSymbol: React.FC<LogoProps> = ({ symbol, size = 90 }) => {
  if (!logosBySymbol[symbol]) {
    throw new Error(`Invalid Token Logo symbol: ${symbol}`);
  }if(symbol === 'GRAPE-SNOW-LP'){
    return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={95} height={60} />;
  }else{
    return (
      <img
        src={logosBySymbol[symbol]}
        alt={`${symbol} Logo`}
        width={size}
        height={size}
        style={{ /*borderRadius: '50%'*/ }}
      />
    );
  }
  
};

export default TokenSymbol;
