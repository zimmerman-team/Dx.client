import { TABLET_STARTPOINT } from "app/theme";
import { css } from "styled-components/macro";

export const styles = {
  container: css`
    right: 0;
    top: 153px;
    z-index: 99;
    width: 400px;
    display: flex;
    position: fixed;
    background: #f1f3f5;
    flex-direction: column;
    height: calc(100vh - 153px);
    transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
    @media (min-width: ${TABLET_STARTPOINT}) and (max-width: 1110px) {
      width: 36.83%; //percentage value of 274px which is the width at 744px as per design
    }
    @media (max-width: 881px) {
      top: 169px;
    }
  `,
  initial: css`
    display: flex;
    color: #98a1aa;
    padding: 100px;
    font-size: 18px;
    font-weight: 500;
    line-height: 22px;
    text-align: center;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  `,
};
