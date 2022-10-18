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
  background: hsla(89, 43%, 51%, 0.3);
  color: #4b4453; // text color
  border-radius: 25px;
  box-shadow: 0px 0px 18px black;
  padding: 2px;
  position: relative;
`;

export default Card;
