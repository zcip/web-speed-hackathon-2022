import dayjs from "dayjs";
import React, { useCallback, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import SvgIcon from "../../../components/SvgIcon";
import { Spacer } from "../../../components/layouts/Spacer";
import { Heading } from "../../../components/typographies/Heading";
import { useFetch } from "../../../hooks/useFetch";
import { useRases } from "../../../layouts/RaseLayout/index.js";
import { Color, Space } from "../../../styles/variables";
import { jsonFetcher } from "../../../utils/HttpUtils";

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
  const { data, loading } = useRases();
  const [oddsKeyToBuy, setOddsKeyToBuy] = useState(null);
  const modalRef = useRef(null);
  const result = useFetch(`/api/races/${raceId}/odds`, jsonFetcher);

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

  const isRaceClosed = data && dayjs(data.closeAt).isBefore(new Date());
  const calloutClosed = loading || isRaceClosed;
  const infoText = loading
    ? "Loading..."
    : isRaceClosed
    ? "このレースの投票は締め切られています"
    : "オッズをクリックすると拳券が購入できます";

  return (
    <>
      <Spacer mt={Space * 4} />

      <Callout $closed={calloutClosed}>
        <SvgIcon viewBox="0 0 512 512" width="1em">
          <path
            d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"
            fill="currentColor"
          />
        </SvgIcon>
        {infoText}
      </Callout>

      <Spacer mt={Space * 4} />
      <Heading as="h2">オッズ表</Heading>

      <Spacer mt={Space * 2} />
      {result.data ? (
        <OddsTable
          entries={data.entries}
          isRaceClosed={isRaceClosed}
          odds={result.data}
          onClickOdds={handleClickOdds}
        />
      ) : (
        <PlaceholderOddsTable />
      )}

      <Spacer mt={Space * 4} />
      <Heading as="h2">人気順</Heading>

      <Spacer mt={Space * 2} />
      {result.data && (
        <OddsRankingList
          isRaceClosed={isRaceClosed}
          odds={result.data}
          onClickOdds={handleClickOdds}
        />
      )}

      <TicketVendingModal ref={modalRef} odds={oddsKeyToBuy} raceId={raceId} />
    </>
  );
};

const PlaceholderOddsTableInner = styled.div`
  width: 100%;
  background: gray;
  height: 500px;
`;

const PlaceholderOddsTable = () => {
  return (
    <div>
      <div>1位軸 ---</div>
      <Spacer mt={Space * 4} />
      <PlaceholderOddsTableInner />
    </div>
  );
};

Component.displayName = "Odds";
