import { FOCUS_VISIBLE_STYLE_LIGHT, MOBILE_BREAKPOINT } from "app/theme";
import { socialAuth } from "app/utils/socialAuth";
import { ReactComponent as GoogleIcon } from "app/modules/onboarding-module/asset/google-img.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/onboarding-module/asset/linkedIn-img.svg";
import { ReactComponent as MicrosoftIcon } from "app/modules/onboarding-module/asset/microsoft-img.svg";
import React from "react";

export default function AuthButtons() {
  return (
    <div
      css={`
        display: flex;
        gap: 16px;

        > button {
          gap: 8px;
          color: #231d2c;
          display: flex;
          padding: 9px 17px !important;
          height: 48px;
          border-radius: 12px;
          outline: none;
          border: none;
          background: #a1a2ff;
          align-items: center;
          justify-content: center;
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          white-space: nowrap;
          font-size: 16px;
          > svg {
            transform: scale(0.8);
          }
          :hover {
            opacity: 0.8;
            cursor: pointer;
          }
          :focus-visible {
            ${FOCUS_VISIBLE_STYLE_LIGHT}
          }
        }
        @media (max-width: ${MOBILE_BREAKPOINT}) {
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 16px;

          button {
            width: 95%;
          }
        }
      `}
    >
      <button
        onClick={() => socialAuth("google-oauth2")}
        aria-label="Sign in with Google"
      >
        <GoogleIcon /> Google
      </button>
      <button
        onClick={() => socialAuth("linkedin")}
        aria-label="Sign in with LinkedIn"
      >
        <LinkedInIcon /> LinkedIn
      </button>
      <button
        onClick={() => socialAuth("windowslive")}
        aria-label="Sign in with Microsoft"
      >
        <MicrosoftIcon /> Microsoft
      </button>
    </div>
  );
}
