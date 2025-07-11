import { css } from "styled-components/macro";

export const styles = {
  container: css`
    width: 100%;
    height: 100%;
  `,
  innercontainer: css`
    left: 0;
    max-width: 1280px;
    position: relative;
    padding: 40px 0px 0 0;
    min-height: calc(100vh - 100px);
  `,
  previewInnercontainer: (isEditMode: boolean) => css`
    left: 0;
    margin-top: 64px;
    max-width: 1280px;
    position: relative;
    align-self: flex-start;
    width: calc(100vw - ((100vw - 1280px) / 2) - 400px - 24px);

    ${isEditMode &&
    `
      display: flex;
      flex-flow: row;
      flex: 1 1 100%;
      flex-direction: row;
      
      &:hover {
        background: #edf1f3;
        transition: background 0.2s ease-in-out;

        svg {
          > rect {
            fill: #edf1f3;
            transition: fill 0.2s ease-in-out;
          }
        }
      }
    `}

    @media (max-width: 1280px) {
      width: calc(100vw - 400px);
    }
  `,
};
