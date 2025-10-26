import { css } from "styled-components/macro";

import { FlattenSimpleInterpolation } from "styled-components";

export interface AnchorPluginTheme {
  input: FlattenSimpleInterpolation;
  inputInvalid: FlattenSimpleInterpolation;
  link: FlattenSimpleInterpolation;
}

export const defaultTheme: AnchorPluginTheme = {
  input: css`
    height: 34px;
    width: 220px;
    padding: 0 12px;
    font-size: 15px;
    font-family: inherit;
    background-color: transparent;
    border: none;
    color: #444;
    &:focus {
      outline: none;
    }
    &::placeholder {
      color: #888;
    }
  `,

  inputInvalid: css`
    color: #e65757;
  `,

  link: css`
    color: #2996da;
    text-decoration: underline;
  `,
};
