import React from "react";
import { Outlet, useOutletContext, useParams } from "react-router-dom";
import styled from "styled-components";

import { Container } from "../../components/layouts/Container";
import { Section } from "../../components/layouts/Section";
import { Spacer } from "../../components/layouts/Spacer";
import { ImageW16H9 } from "../../components/media/TrimmedImage";
import { TabNav } from "../../components/navs/TabNav";
import { Heading } from "../../components/typographies/Heading";
import { useFetch } from "../../hooks/useFetch";
import { Color, Radius, Space } from "../../styles/variables";
import { formatTime } from "../../utils/DateUtils";
import { jsonFetcher } from "../../utils/HttpUtils";

const LiveBadge = styled.span`
  background: ${Color.red};
  border-radius: ${Radius.SMALL};
  color: ${Color.mono[0]};
  font-weight: bold;
  padding: ${Space * 1}px;
  text-transform: uppercase;
`;

export const Component = () => {
  const { raceId } = useParams();
  const result = useFetch(`/api/races/${raceId}`, jsonFetcher);
  const { data } = result;

  if (data == null && result.loading) {
    return (
      <Container>
        <Spacer mt={Space * 2} />
        <Heading as="h1">Loading...</Heading>
        <p>開始 --:-- 締切 --:--</p>

        <Spacer mt={Space * 2} />

        <Section dark shrink>
          <LiveBadge>Live</LiveBadge>
          <Spacer mt={Space * 2} />
          <ImageW16H9
            height={225}
            src="/assets/images/400x255.webp"
            width={400}
          />
        </Section>

        <Spacer mt={Space * 2} />

        <Section>
          <TabNav>
            <TabNav.Item to={`/races/${raceId}/race-card`}>出走表</TabNav.Item>
            <TabNav.Item to={`/races/${raceId}/odds`}>オッズ</TabNav.Item>
            <TabNav.Item to={`/races/${raceId}/result`}>結果</TabNav.Item>
          </TabNav>
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      <Spacer mt={Space * 2} />
      <Heading as="h1">{data.name}</Heading>
      <p>
        開始 {formatTime(data.startAt)} 締切 {formatTime(data.closeAt)}
      </p>

      <Spacer mt={Space * 2} />

      <Section dark shrink>
        <LiveBadge>Live</LiveBadge>
        <Spacer mt={Space * 2} />
        <ImageW16H9 height={225} src={data.image} width={400} />
      </Section>

      <Spacer mt={Space * 2} />

      <Section>
        <TabNav>
          <TabNav.Item to={`/races/${raceId}/race-card`}>出走表</TabNav.Item>
          <TabNav.Item to={`/races/${raceId}/odds`}>オッズ</TabNav.Item>
          <TabNav.Item to={`/races/${raceId}/result`}>結果</TabNav.Item>
        </TabNav>
        {data && <Outlet context={result} />}
      </Section>
    </Container>
  );
};

Component.displayName = "RaseLayout"

export function useRases() {
  return useOutletContext();
}
