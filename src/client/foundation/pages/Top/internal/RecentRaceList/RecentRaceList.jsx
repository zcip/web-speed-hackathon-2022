import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

import { LinkButton } from "../../../../components/buttons/LinkButton";
import { Spacer } from "../../../../components/layouts/Spacer";
import { Stack } from "../../../../components/layouts/Stack";
import { ImageW1H1 } from "../../../../components/media/TrimmedImage";
import { Color, FontSize, Radius, Space } from "../../../../styles/variables";
import { formatCloseAt } from "../../../../utils/DateUtils";

export const RecentRaceList = ({ children }) => {
  return (
    <Stack as="ul" gap={Space * 2}>
      {children}
    </Stack>
  );
};

const opacityAnimation = keyframes`
  0% {
    opacity: 0%;
  }
  100% {
    opacity: 100%;
  }
`;

const ItemWrapper = styled.li`
  --item-number: ${(props) => props.itemNumber};
  @media (prefers-reduced-motion: no-preference) {
    opacity: 0;
    animation: ${opacityAnimation} 500ms cubic-bezier(0.2, 0.6, 0.35, 1);
    animation-fill-mode: both;
    animation-delay: calc(var(--item-number) * 0.1s);
  }
  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
  }
  background: ${Color.mono[0]};
  border-radius: ${Radius.MEDIUM};
  padding: ${Space * 3}px;
`;

const RaceButton = styled(LinkButton)`
  background: ${Color.mono[700]};
  border-radius: ${Radius.MEDIUM};
  color: ${Color.mono[0]};
  padding: ${Space * 1}px ${Space * 2}px;

  &:hover {
    background: ${Color.mono[800]};
  }
`;

const RaceTitle = styled.h2`
  font-size: ${FontSize.LARGE};
  font-weight: bold;
`;

/**
 * @typedef ItemProps
 * @property {Model.Race} race
 */

/** @type {React.VFC<ItemProps>} */
const Item = ({ itemNumber, race }) => {
  const [closeAtText, setCloseAtText] = useState(formatCloseAt(race.closeAt));

  // 締切はリアルタイムで表示したい
  useEffect(() => {
    // 締め切りを過ぎていたら更新はしない
    if (dayjs(race.closeAt).isBefore(new Date())) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setCloseAtText(() => formatCloseAt(race.closeAt));
      // 更新間隔は1分なので1分ごとに更新
    }, 1000 * 60);

    return () => clearTimeout(timer);
  }, [race.closeAt]);

  return (
    <ItemWrapper itemNumber={itemNumber}>
      <Stack horizontal alignItems="center" justifyContent="space-between">
        <Stack gap={Space * 1}>
          <RaceTitle>{race.name}</RaceTitle>
          <p>{closeAtText}</p>
        </Stack>

        <Spacer mr={Space * 2} />

        <Stack.Item grow={0} shrink={0}>
          <Stack horizontal alignItems="center" gap={Space * 2}>
            <ImageW1H1
              height={100}
              loading="lazy"
              src={race.image}
              width={100}
            />
            <RaceButton to={`/races/${race.id}/race-card`}>投票</RaceButton>
          </Stack>
        </Stack.Item>
      </Stack>
    </ItemWrapper>
  );
};
RecentRaceList.Item = Item;
