import React from "react";
import styled from "styled-components";

import { Space } from "../../../../../styles/variables";

const Wrapper = styled.span`
  font-family: "Senobi-Gothic", sans-serif;
  font-weight: bold;
  padding: ${Space / 2}px ${Space * 1}px;
  background: rgba(74, 222, 128, var(--odds-opacity));
`;

/**
 * @typedef Props
 * @property {number} odds
 */

/** @type {React.FC<Props>} */
// eslint-disable-next-line react/display-name
export const OddsMarker = React.memo(({ odds }) => {
  return (
    <Wrapper style={{ ["--odds-opacity"]: Math.min(5 / odds, 1.0) }}>
      {" "}
      {odds.toFixed(1)}
    </Wrapper>
  );
});
