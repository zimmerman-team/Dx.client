import React from "react";
import GoogleIcon from "./assets/google-icon.svg?react";
import LinkedInIcon from "./assets/linkedin-icon.svg?react";
import MicrosoftIcon from "./assets/microsoft-icon.svg?react";
import { socialAuth } from "@app/utils/socialAuth";
import { FOCUS_VISIBLE_STYLE_LIGHT } from "@app/theme";

const SignInButtons = () => {
  return (
    <div
      css={`
        display: flex;
        column-gap: 16px;
        row-gap: 8px;
        justify-content: center;
        flex-direction: row;
        @media (max-width: 743px) {
          flex-direction: column;
          width: 100%;
          align-items: center;
        }
        button {
          gap: 8px;
          color: #ffffff;
          display: flex;
          padding: 12px 24px !important;
          width: 145px;
          height: 48px;
          border-radius: 12px;
          outline: none;
          border: none;
          background: #6061e5;
          align-items: center;
          justify-content: center;
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          white-space: nowrap;
          font-size: 16px;
          :hover {
            opacity: 0.8;
            cursor: pointer;
          }
          :focus-visible {
            ${FOCUS_VISIBLE_STYLE_LIGHT}
          }
        }
      `}
    >
      <button
        data-cy="google-button"
        onClick={() => socialAuth("google-oauth2")}
      >
        <GoogleIcon role="presentation" /> Google
      </button>
      <button data-cy="linkedin-button" onClick={() => socialAuth("linkedin")}>
        <LinkedInIcon role="presentation" /> LinkedIn
      </button>
      <button
        data-cy="microsoft-button"
        onClick={() => socialAuth("windowslive")}
      >
        <MicrosoftIcon role="presentation" /> Microsoft
      </button>
    </div>
  );
};

export default SignInButtons;
