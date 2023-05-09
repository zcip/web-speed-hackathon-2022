import React from "react";
import styled from "styled-components";

import { Spacer } from "../../../components/layouts/Spacer";
import { useRases } from "../../../layouts/RaseLayout/index.js";
import { Space } from "../../../styles/variables";
import { range } from "../../../utils/lodash";

import { EntryTable } from "./internal/EntryTable";
import {
  PlaceholderItem,
  PlayerPictureList,
} from "./internal/PlayerPictureList";

const PlaceholderEntryTable = styled.div`
  width: 100%;
  height: 427px;
  background: gray;
`;

/** @type {React.VFC} */
export const Component = () => {
  const { data } = useRases();

  return (
    <>
      <Spacer mt={Space * 2} />
      <PlayerPictureList>
        {!data
          ? range(1, 11).map((i) => <PlaceholderItem key={i} number={i} />)
          : data.entries.map((entry) => (
              <PlayerPictureList.Item
                key={entry.id}
                image={entry.player.image}
                name={entry.player.name}
                number={entry.number}
              />
            ))}
      </PlayerPictureList>
      <Spacer mt={Space * 4} />
      {data ? (
        <EntryTable entries={data?.entries} />
      ) : (
        <PlaceholderEntryTable />
      )}
    </>
  );
};

Component.displayName = "RaceCard";
