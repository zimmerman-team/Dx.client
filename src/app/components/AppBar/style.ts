import { css } from "styled-components/macro";

export const headercss = css`
  width: 100%;
  height: 100%;

  background-color: transparent;

  a {
    text-decoration: none;
    color: #231d2c;
    font-size: 14px;
    :hover {
      color: #6061e5;
    }
  }
`;

export const logocss = css`
  display: flex;
  justify-content: center;
  gap: 6px;
  text-decoration: none;
`;

export const navLinkcss = (display: string, location: string) => css`
  a {
    color: ${display === location ? "#6061E5 !important" : "#231D2C"};
  }
`;
