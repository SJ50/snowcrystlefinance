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

export default Card;
