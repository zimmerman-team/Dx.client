import React from "react";
import { Snackbar } from "@material-ui/core";
import { MOBILE_BREAKPOINT } from "@app/theme";
import styled, { css } from "styled-components";
import { Close } from "@material-ui/icons";
import MousePointerClick from "./assets/MousePointerClick";
import DeleteIcon from "./assets/DeleteIcon";
interface Props {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  onSelectAll: () => void;
  count: number;
}

const NotificationWrapper = styled((props) => <Snackbar {...props} />)`
  && {
    bottom: 100px;

    @media (max-width: ${MOBILE_BREAKPOINT}) {
      width: 100%;
      left: auto;
      right: auto;
      bottom: 0px;
      transform: translateX(0%);
    }
  }

  & [class*="MuiSnackbarContent-root"] {
    width: 1232px;
    display: flex;
    padding: 0 56px;
    background: #231d2c;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1), 0 1px 14px 0 rgba(0, 0, 0, 0.12);
    flex-wrap: nowrap;
    border-radius: 10px;
    gap: ${(props) => (props.gap ? "0px" : "84px")};
    justify-content: center;
    border: 0.5px solid #868e96;
    box-shadow: 1px 2px 12px 0 rgba(97, 105, 114, 0.6);
    @media (max-width: 1270px) {
      width: 94vw;
      @media (max-width: 880px) {
        gap: 24px;
      }
      @media (max-width: 599px) {
        height: 280px;
        border-radius: 20px 20px 0px 0px;
      }
    }
  }

  & [class*="MuiSnackbarContent-message"] {
    color: #fff;
    padding: 10px;
    font-weight: 325;
    font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
    white-space: nowrap;
    font-size: 14px;
    line-height: 20px;
    background: #231d2c;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1), 0 1px 14px 0 rgba(0, 0, 0, 0.12);
  }
`;

const SelectAssetsSnackBarWrapper = styled((props) => <Snackbar {...props} />)`
  && {
    bottom: 16px;

    @media (max-width: ${MOBILE_BREAKPOINT}) {
      width: 100%;
      left: auto;
      right: auto;
      bottom: 0px;
      transform: translateX(0%);
    }
  }

  & [class*="MuiSnackbarContent-root"] {
    width: 1232px;
    display: flex;
    padding: 0 56px;
    background: #fff;
    flex-wrap: nowrap;
    border-radius: 10px;
    gap: ${(props) => (props.gap ? "0px" : "84px")};
    justify-content: center;
    border: 0.5px solid #868e96;
    box-shadow: 1px 2px 12px 0 rgba(97, 105, 114, 0.6);
    @media (max-width: 1270px) {
      width: 94vw;
      @media (max-width: 880px) {
        gap: 24px;
      }
      @media (max-width: 599px) {
        height: 280px;
        border-radius: 20px 20px 0px 0px;
      }
    }
  }

  & [class*="MuiSnackbarContent-message"] {
    color: #000;
    font-size: 18px;
    padding: 16px 24px;
    font-weight: 325;
    font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
    white-space: nowrap;
  }
`;

export const SelectAssetsSnackBar = (props: Props) => {
  const [showNotification, setShowNotification] = React.useState(props.open);

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  React.useEffect(() => {
    if (props.open) {
      setShowNotification(true);
    }
  }, [props.open]);
  return (
    <React.Fragment>
      <SelectAssetsSnackBarWrapper open={props.open}>
        <div
          css={`
            background: #fff;
            border: 0.5px solid #868e96;
            box-shadow: 1px 2px 12px 0 rgba(97, 105, 114, 0.6);
            font-size: 18px;
            padding: 16px 24px;
            font-weight: 325;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 24px;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
          `}
          data-cy="select-assets-snackbar"
        >
          <div
            css={`
              display: flex;
              align-items: center;
              gap: 8px;
            `}
          >
            <div
              css={`
                display: flex;
                width: 28px;
                height: 28px;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
                background: #f1f3f5;
              `}
            >
              {props.count}
            </div>
            <span>Asset{props.count !== 1 ? "s" : ""} Selected</span>
          </div>
          <div
            css={`
              height: 28px;
              width: 0px;
              border-left: 1px solid #868e96;
            `}
          />
          <button
            css={`
              border: none;
              background: transparent;
              font-size: 18px;
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              display: flex;
              align-items: center;
              gap: 8px;
              cursor: pointer;
              &:hover {
                opacity: 0.4;
              }
            `}
            onClick={props.onSelectAll}
          >
            <MousePointerClick />
            <span>Select All</span>
          </button>
          <div
            css={`
              height: 28px;
              width: 0px;
              border-left: 1px solid #868e96;
            `}
          />
          <button
            css={`
              border: none;
              background: transparent;
              font-size: 18px;
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              display: flex;
              align-items: center;
              gap: 8px;
              cursor: pointer;
              &:hover {
                opacity: 0.4;
              }
            `}
            onClick={props.onDelete}
            data-cy="delete-selected-button"
          >
            <DeleteIcon />
            <span>Delete Selected</span>
          </button>
          <div
            css={`
              height: 28px;
              width: 0px;
              border-left: 1px solid #868e96;
            `}
          />
          <Close
            css={`
              color: #231d2c;
              cursor: pointer;
              &:hover {
                opacity: 0.4;
              }
            `}
            onClick={props.onClose}
          />
        </div>
      </SelectAssetsSnackBarWrapper>
      <NotificationWrapper
        open={showNotification}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
      >
        <div
          css={`
            color: #fff;
            padding: 10px;
            font-weight: 325;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            white-space: nowrap;
            font-size: 14px;
            line-height: 20px;
            background: #231d2c;
            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1),
              0 1px 14px 0 rgba(0, 0, 0, 0.12);
            border-radius: 10px;
          `}
        >
          You're in multi-delete mode. Select assets using the checkboxes, or
          press Esc to exit.
        </div>
      </NotificationWrapper>
    </React.Fragment>
  );
};
