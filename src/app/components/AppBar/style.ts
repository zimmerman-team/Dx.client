import { css } from "styled-components/macro";

export const headercss = css`
  width: 100%;
  height: 100%;

  background-color: #f2f7fd;

  a {
    text-decoration: none;
    color: #231d2c;
    font-size: 14px;
    :hover {
      color: #6061e5;
    }
  }
  button {
    height: 33.58px;
    padding: 9.792px 35.496px;
    background: #dadaf8;
    border-radius: 24.48px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #231d2c;
    font-weight: 500;
    font-size: 11.424px;
    border: none;
    outline: none;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
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
