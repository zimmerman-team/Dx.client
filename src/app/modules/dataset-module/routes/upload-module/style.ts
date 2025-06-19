import { Select, TextField, withStyles, InputLabel } from "@material-ui/core";
import { MOBILE_BREAKPOINT } from "app/theme";
import Snackbar from "@material-ui/core/Snackbar";
import { pad } from "lodash";
import { css } from "styled-components/macro";

export interface ISnackbarState {
  open: boolean;
  vertical: "top" | "bottom";
  horizontal: "left" | "center" | "right";
  message: string;
}

export const CssSnackbar = withStyles({
  root: {
    "  &&": {
      zIndex: 1102,
    },
    "& .MuiSnackbarContent-message": {
      fontSize: "18px",
      fontFamily: "'GothamNarrow-Bold', 'Helvetica Neue', sans-serif",
    },
    "& .MuiSnackbarContent-root": {
      backgroundColor: "#fff",
      color: "#000",
      borderRadius: "12px",
      fontSize: "18px",
      fontWeight: "bold",
      letterSpacing: "0.5px",
      width: "1232px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "@media (max-width: 1257px)": {
        width: "94vw",
      },
    },
  },
})(Snackbar);

export const stepcss = css`
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
const gothamNarrowBold = "'GothamNarrow-Book', 'Helvetica Neue', sans-serif";

export const uploadAreacss = (isDragActive: boolean, disabled?: boolean) => css`
  height: 131px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: ${!isDragActive && !disabled ? "pointer" : "default"};
  }
  p {
    text-align: center;
  }
  button:nth-of-type(1) {
    background: #e492bd;
    p {
      font-weight: 700;
    }
  }
  button {
    border: none;
    outline: none;
    background: #231d2c;
    border-radius: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 27px;
    gap: 10px;
    height: 43px;
    cursor: pointer;
    color: #ffffff;
    p {
      font-weight: 500;
      font-size: 14px;
      font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
      text-transform: uppercase;
    }
  }
  label {
    :hover {
      opacity: 0.9;
    }
  }
`;

export const metaDatacss = css`
  width: 100%;
  h1 {
    font-weight: 400;
    font-size: 48px;
    font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    margin: 0;
    margin-bottom: 36px;
    line-height: normal;

    @media (min-width: 768px) {
      @media (max-width: 1024px) {
        margin-top: 10px;
        margin-bottom: 3.5rem;
      }
    }
  }
`;

export const dataSetsCss = css`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  a {
    text-decoration: none;
  }
`;
export const mobileDescriptioncss = css`
  display: none;
  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: flex;
    padding: 24px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 100%;
    div {
      p {
        margin: 0px;
        &:nth-of-type(1) {
          color: #231d2c;
          font-family: "GothamNarrow-Bold", sans-serif;
        }
        &:nth-of-type(2) {
          font-family: "GothamNarrow-Book", sans-serif;
        }
      }
    }
  }
`;

export const CssTextField = withStyles({
  root: {
    "& .MuiInputLabel-outlined": {
      fontSize: "18px",
      lineHeight: "24px",
      fontFamily: gothamNarrowBold,
      color: "#231D2C",
      padding: "0px",
      marginLeft: "9px",
    },
    "& label.Mui-focused": {
      color: "#231D2C",
      lineHeight: "normal",
      marginLeft: "0px",
    },
    "& .MuiFormLabel-filled": {
      lineHeight: "normal",
      marginLeft: "0px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "14.5px 24px",
      backgroundColor: "#Fff",
      height: "24px",
    },
    "& .MuiFormHelperText-root": {
      color: "#231D2C",
      fontSize: "12px",
      fontWeight: 400,
      marginLeft: "0px",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#231D2C",
    },
    "& .MuiOutlinedInput-multiline ": {
      backgroundColor: "#Fff",
      padding: "0px",
    },
    "& .MuiOutlinedInput-root": {
      fontSize: "18px",
      "& fieldset": {
        borderColor: "#231D2C",
        borderRadius: "10px",
        paddingBottom: "4px",
      },
      "&:hover fieldset": {
        borderColor: "#231D2C",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#231D2C",
      },
    },
  },
})(TextField);

export const CssSelectField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "#231D2C",
    },
    "& .MuiInputLabel-outlined": {
      fontSize: "18px",
      fontFamily: gothamNarrowBold,
      color: "#231D2C",
      lineHeight: "24px",
    },
    "&.MuiSelect-outlined": {
      padding: "14.5px 24px",
      background: "#fff",
      display: "flex",
      alignItems: "center",
      lineHeight: "24px",
    },
    "&.MuiFormHelperText-root": {
      color: "#231D2C",
      fontSize: "12px",
      fontWeight: 400,
      marginLeft: "0px",
    },
    "&.MuiInput-underline:after": {
      borderBottomColor: "#231D2C",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#231D2C",
        borderRadius: "10px",
        paddingBottom: "4px",
      },
      "&:hover fieldset": {
        borderColor: "#231D2C",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#231D2C",
      },
    },
  },
})(Select);

export const CssInputLabel = withStyles({
  root: {
    "&.MuiInputLabel-outlined": {
      fontSize: "18px",
      lineHeight: "24px",
      fontFamily: gothamNarrowBold,
      color: "#231D2C",
      padding: "0px",
      marginLeft: "9px",
    },
    "&.Mui-focused": {
      color: "#231D2C",
      lineHeight: "normal",
      marginLeft: "0px",
    },
    "&.MuiFormLabel-filled": {
      lineHeight: "normal",
      marginLeft: "-2px",
    },
  },
})(InputLabel);
