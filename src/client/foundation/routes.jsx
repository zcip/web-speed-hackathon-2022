import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Component } from "./layouts/CommonLayout";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Component />} path="/">
      <Route
        index
        lazy={() => import(/* webpackChunkName: "Top" */ "./pages/Top")}
      />
      <Route
        lazy={() => import(/* webpackChunkName: "Top" */ "./pages/Top")}
        path=":date"
      />
      <Route
        lazy={() =>
          import(/* webpackChunkName: "RaseLayout" */ "./layouts/RaseLayout")
        }
        path="races/:raceId"
      >
        <Route
          lazy={() =>
            import(
              /* webpackChunkName: "rases-RaceCard" */ "./pages/races/RaceCard"
            )
          }
          path="race-card"
        />
        <Route
          lazy={() =>
            import(/* webpackChunkName: "rases-Odds" */ "./pages/races/Odds")
          }
          path="odds"
        />
        <Route
          lazy={() =>
            import(
              /* webpackChunkName: "rases-RaceResult" */ "./pages/races/RaceResult"
            )
          }
          path="result"
        />
      </Route>
    </Route>,
  ),
);
