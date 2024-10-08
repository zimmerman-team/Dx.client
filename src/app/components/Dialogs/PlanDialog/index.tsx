import React from "react";
import styled from "styled-components/macro";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { Message } from "./common/message";
import { useRecoilState } from "recoil";
import { planDialogAtom } from "app/state/recoil/atoms";

type SnackBarProps = {
  open: boolean;
  handleClose: () => void;
  message: string;
};

const BaseSnackbar = styled((props) => (
  <Snackbar {...props} data-cy="plan-dialog" />
))`
  && {
    bottom: 16px;
  }

  & [class*="MuiSnackbarContent-root"] {
    background-color: white;
    width: 1232px;
    border-radius: 10px;
    box-shadow: 0 8px 17px -4px rgba(130, 142, 148, 0.35),
      0 0 4px 0 rgba(130, 142, 148, 0.16), 0 0 2px 0 rgba(130, 142, 148, 0.12);
    flex-wrap: nowrap;
    padding: 0 0;
    display: flex;
    justify-content: space-between;

    @media (max-width: 1280px) {
      width: 100%;
    }
  }

  /* & [class*="MuiButtonBase-root"] {
    border-radius: 10px;
    height: 32px;
  } */
  & [class*="MuiTypography-root"] {
    font-weight: 325;
    font-size: 16px;
    font-family: "GothamNarrow-Book", sans-serif;

    > a {
      font-family: "GothamNarrow-Book", sans-serif;
    }
  }

  & [class*="MuiSnackbarContent-message"] {
    padding: 24px 76px;
    width: 100%;
  }

  & [class*="MuiSnackbarContent-action"] {
    padding-left: 64px;
    font-family: "GothamNarrow-Book", sans-serif;
  }
`;

export const PlanDialog = () => {
  const [planDialog, setPlanDialog] = useRecoilState(planDialogAtom);

  const handleClose = () => {
    setPlanDialog({
      open: false,
      message: "",
      tryAgain: "",
      onTryAgain: () => {},
    });
  };

  return (
    <>
      <BaseSnackbar
        ClickAwayListenerProps={{ mouseEvent: false }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={planDialog.open}
        autoHideDuration={null}
        onClose={handleClose}
      >
        <SnackbarContent
          aria-describedby="client-snackbar"
          message={
            <Message onClose={handleClose} message={planDialog.message} />
          }
        />
      </BaseSnackbar>
    </>
  );
};
