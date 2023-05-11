import dayjs from "dayjs";
import React, { Suspense, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { Container } from "../../components/layouts/Container";
import { Spacer } from "../../components/layouts/Spacer";
import { Stack } from "../../components/layouts/Stack";
import { Heading } from "../../components/typographies/Heading";
import { useAuthorizedFetch } from "../../hooks/useAuthorizedFetch";
import { useFetch } from "../../hooks/useFetch";
import { Color, Radius, Space } from "../../styles/variables";
import { authorizedJsonFetcher, jsonFetcher } from "../../utils/HttpUtils";

import { HeroImage } from "./internal/HeroImage";
import { RecentRaceList } from "./internal/RecentRaceList";

const ChargeDialog = React.lazy(() => import("./internal/ChargeDialog"));

const ChargeButton = styled.button`
  background: ${Color.mono[700]};
  border-radius: ${Radius.MEDIUM};
  color: ${Color.mono[0]};
  padding: ${Space * 1}px ${Space * 2}px;

  &:hover {
    background: ${Color.mono[800]};
  }
`;

/** @type {React.VFC} */
export const Component = () => {
  const { date = dayjs().format("YYYY-MM-DD") } = useParams();

  const chargeDialogRef = useRef(null);

  const { data: userData, revalidate } = useAuthorizedFetch(
    "/api/users/me",
    authorizedJsonFetcher,
  );

  const { data: raceData, loading: raseLoading } = useFetch(
    `/api/races?since=${dayjs(date).unix()}&until=${dayjs(date)
      .endOf("day")
      .unix()}`,
    jsonFetcher,
  );

  const handleClickChargeButton = useCallback(() => {
    if (chargeDialogRef.current === null) {
      return;
    }

    chargeDialogRef.current.showModal();
  }, []);

  const handleCompleteCharge = useCallback(() => {
    revalidate();
  }, [revalidate]);

  const todayRacesToShow =
    raceData != null
      ? [...raceData.races].sort(
          (/** @type {Model.Race} */ a, /** @type {Model.Race} */ b) =>
            dayjs(a.startAt) - dayjs(b.startAt),
        )
      : [];

  return (
    <Container>
      <HeroImage url={"/assets/images/hero.webp"} />

      <Spacer mt={Space * 2} />
      {userData && (
        <Stack horizontal alignItems="center" justifyContent="space-between">
          <div>
            <p>ポイント残高: {userData.balance}pt</p>
            <p>払戻金: {userData.payoff}Yeen</p>
          </div>

          <ChargeButton onClick={handleClickChargeButton}>
            チャージ
          </ChargeButton>
        </Stack>
      )}

      <Spacer mt={Space * 2} />
      <section>
        <Heading as="h1">本日のレース</Heading>
        {/* 要素取得中は、要素の高さを保つ */}
        {raseLoading && <div style={{ minHeight: "90vh" }}></div>}
        {todayRacesToShow.length > 0 && (
          <RecentRaceList>
            {todayRacesToShow.map((race, i) => (
              <RecentRaceList.Item key={race.id} itemNumber={i} race={race} />
            ))}
          </RecentRaceList>
        )}
      </section>

      {userData && (
        <Suspense>
          <ChargeDialog
            ref={chargeDialogRef}
            onComplete={handleCompleteCharge}
          />
        </Suspense>
      )}
    </Container>
  );
};

Component.displayName = "Top";
