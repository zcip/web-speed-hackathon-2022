import React from "react";

import { Spacer } from "../../../components/layouts/Spacer";
import { useRases } from "../../../layouts/RaseLayout/index.js";
import { Space } from "../../../styles/variables";

import { EntryTable } from "./internal/EntryTable";
import { PlayerPictureList } from "./internal/PlayerPictureList";

/** @type {React.VFC} */
export const Component = () => {
  const { data } = useRases();

  return (
    <>
      <Spacer mt={Space * 2} />
      <PlayerPictureList>
        {data.entries.map((entry) => (
          <PlayerPictureList.Item
            key={entry.id}
            image={entry.player.image}
            name={entry.player.name}
            number={entry.number}
          />
        ))}
      </PlayerPictureList>

      <Spacer mt={Space * 4} />
      <EntryTable entries={data.entries} />
    </>
  );
};

Component.displayName = "RaceCard";
