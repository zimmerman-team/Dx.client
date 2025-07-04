import { css } from "styled-components/macro";

export const socialloginbuttoncss = css`
  gap: 20px;
  width: 230px;
  height: 41px;
  display: flex;
  color: #ffffff;
  padding: 0px 16px;
  font-size: 14px;
  cursor: pointer;
  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
  line-height: normal;
  border-radius: 10px;
  flex-direction: row;
  margin-bottom: 16px;
  align-items: center;
  background: #6061e5;
  border: none;

  &:hover {
    background: #a1aebd;
  }
`;

export const termsOfServiceCss = css`
  width: 100%;
  font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;

  > span {
    font-size: 12px;
  }
`;
