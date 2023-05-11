import { createGlobalStyle } from "styled-components";

import { Color } from "./variables";

export const GlobalStyle = createGlobalStyle`
  body {
    color: ${Color.mono[900]};
    background: ${Color.mono[100]};
    font-family: sans-serif;
    height: 100%;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul, ol {
    padding: 0;
    list-style: none;
    margin: 0;
  }

  @font-face {
    font-family: "Senobi-Gothic";
    font-weight: bold;
    font-display: swap;
    src: url("/assets/fonts/subset-font.woff2") format("woff2");
  }

  #root {
    height: 100%;
  }
`;
