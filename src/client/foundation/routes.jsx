import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { CommonLayout } from "./layouts/CommonLayout";
import { RaseLayout } from "./layouts/RaseLayout.jsx";
import { Top } from "./pages/Top";
import { Odds } from "./pages/races/Odds";
import { RaceCard } from "./pages/races/RaceCard";
import { RaceResult } from "./pages/races/RaceResult";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<CommonLayout />} path="/">
      <Route index element={<Top />} />
      <Route element={<Top />} path=":date" />
      <Route element={<RaseLayout />} path="races/:raceId">
        <Route element={<RaceCard />} path="race-card" />
        <Route element={<Odds />} path="odds" />
        <Route element={<RaceResult />} path="result" />
      </Route>
    </Route>,
  ),
);
