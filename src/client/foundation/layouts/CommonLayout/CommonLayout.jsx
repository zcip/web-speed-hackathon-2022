import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";

import { Footer } from "../../components/navs/Footer";
import { Header } from "../../components/navs/Header/Header";

export const Component = () => {
  return (
    <div>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
      <ScrollRestoration />
    </div>
  );
};

Component.dispalyName = 'CommonLayout'