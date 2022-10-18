import React from 'react';
import styled from 'styled-components';

const Card: React.FC = ({ children }) => <StyledCard>{children}</StyledCard>;

// const StyledCard = styled.div`
//   background: #f2f5ff;
//   border-radius: 15px;
//   color: #4b4453;
//   position: relative;
// `;
const StyledCard = styled.div`
  // background: hsla(202, 81%, 86%, 0.5);
  background-image: linear-gradient(hsla(170, 77%, 83%, 0.4), hsla(202, 81%, 86%, 0.35), hsla(0, 97%, 85%, 0.25));
  color: #4b4453; // text color
  border-radius: 25px;
  box-shadow: 0px 0px 18px black;
  padding: 2px;
  position: relative;
`;

const HomeCardPurple = styled.div`
  background: rgba(214, 211, 242, 0.9);
  border-radius: 50px;
  box-shadow: 0px 0px 18px black;
  padding: 25px;
  color: #4b4453;
`;
const HomeCard = styled.div`
  border-radius: 25px;
  box-shadow: 0px 0px 18px black;
  padding: 2px;
`;
const HomeCardPegasaurus = styled.div`
  background: rgba(217, 238, 254, 0.95);
  border-radius: 50px;
  box-shadow: 0 0 8px 3px #fff, /* inner white */ 0 0 12px 7px #a97ddb, /* middle magenta */ 0 0 16px 11px #0ff; /* outer cyan */
  padding: 20px;
  color: #4b4453;
  margin: 10px;
`;

export default Card;
