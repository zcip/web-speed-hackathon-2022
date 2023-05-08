import dayjs from "dayjs";
import React, { useCallback, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import SvgIcon from "../../../components/SvgIcon";
import { Spacer } from "../../../components/layouts/Spacer";
import { Heading } from "../../../components/typographies/Heading";
import { useRases } from "../../../layouts/RaseLayout/index.js";
import { Color, Space } from "../../../styles/variables";

import { OddsRankingList } from "./internal/OddsRankingList";
import { OddsTable } from "./internal/OddsTable";
import { TicketVendingModal } from "./internal/TicketVendingModal";

const Callout = styled.aside`
  align-items: center;
  background: ${({ $closed }) =>
    $closed ? Color.mono[200] : Color.green[100]};
  color: ${({ $closed }) => ($closed ? Color.mono[600] : Color.green[500])};
  display: flex;
  font-weight: bold;
  gap: ${Space * 2}px;
  justify-content: left;
  padding: ${Space * 1}px ${Space * 2}px;
`;

/** @type {React.VFC} */
export const Component = () => {
  const { raceId } = useParams();
  const { data } = useRases();
  const [oddsKeyToBuy, setOddsKeyToBuy] = useState(null);
  const modalRef = useRef(null);

  const handleClickOdds = useCallback(
    /**
     * @param {Model.OddsItem} odds
     */
    (odds) => {
      setOddsKeyToBuy(odds.key);
      modalRef.current?.showModal();
    },
    [],
  );

  const isRaceClosed = dayjs(data.closeAt).isBefore(new Date());

  return (
    <>
      <Spacer mt={Space * 4} />

      <Callout $closed={isRaceClosed}>
        <SvgIcon viewBox="0 0 512 512" width="1em">
          <path
            d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"
            fill="currentColor"
          />
        </SvgIcon>
        {isRaceClosed
          ? "このレースの投票は締め切られています"
          : "オッズをクリックすると拳券が購入できます"}
      </Callout>

      <Spacer mt={Space * 4} />
      <Heading as="h2">オッズ表</Heading>

      <Spacer mt={Space * 2} />
      <OddsTable
        entries={data.entries}
        isRaceClosed={isRaceClosed}
        odds={data.trifectaOdds}
        onClickOdds={handleClickOdds}
      />

      <Spacer mt={Space * 4} />
      <Heading as="h2">人気順</Heading>

      <Spacer mt={Space * 2} />
      <OddsRankingList
        isRaceClosed={isRaceClosed}
        odds={data.trifectaOdds}
        onClickOdds={handleClickOdds}
      />

      <TicketVendingModal ref={modalRef} odds={oddsKeyToBuy} raceId={raceId} />
    </>
  );
};

Component.displayName = "Odds"