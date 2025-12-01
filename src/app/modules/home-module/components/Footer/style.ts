import { FOCUS_VISIBLE_STYLE_LIGHT } from "@app/theme";
import { css } from "styled-components";

export const homeFootercss = css`
  background: #fff;

  bottom: 0;
  left: 0;
  right: 0;

  ul {
    padding: 0;
    color: #000;

    font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
  }

  li {
    list-style-type: none;

    a {
      color: #000;
      text-decoration: none;
      :focus-visible {
        ${FOCUS_VISIBLE_STYLE_LIGHT}
      }
    }
  }
`;
