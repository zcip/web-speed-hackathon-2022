import React from "react";
import { RouterProvider } from "react-router-dom";
import { StyleSheetManager } from "styled-components";

import { AuthContextProvider } from "./contexts/AuthContext";
import { router } from "./routes";
import { GlobalStyle } from "./styles/GlobalStyle";

/** @type {React.VFC} */
export const App = () => {
  return (
    <StyleSheetManager disableVendorPrefixes>
      <AuthContextProvider>
        <GlobalStyle />
        <RouterProvider router={router} />
      </AuthContextProvider>
    </StyleSheetManager>
  );
};
