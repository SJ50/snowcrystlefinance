import React from 'react';
import styled from 'styled-components';

// import { Card } from '@material-ui/core';
import Card from '../../../components/Card';

interface ExchangeStatProps {
  tokenName: string;
  description: string;
  price: string;
}
const HomeCard = styled.div`
  border-radius: 25px;
  box-shadow: 0px 0px 18px black;
  padding: 2px;
`;
const ExchangeStat: React.FC<ExchangeStatProps> = ({ tokenName, description, price }) => {
  return (
    <HomeCard>
      <StyledCardContentInner>
        <StyledCardTitle>{`💰 ${tokenName} = ${price} USDC`}</StyledCardTitle>
        <StyledDesc>{description}</StyledDesc>
      </StyledCardContentInner>
    </HomeCard>
  );
};

const StyledCardTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const StyledDesc = styled.span`
  //color: ${(props) => props.theme.color.grey[300]};
  text-align: center;
`;

const StyledCardContentInner = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing[2]}px;
`;

export default ExchangeStat;
