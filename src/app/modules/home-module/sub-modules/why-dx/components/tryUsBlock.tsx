import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { socialAuth } from "app/utils/socialAuth";
import { ReactComponent as GoogleIcon } from "app/modules/onboarding-module/asset/google-img.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/onboarding-module/asset/linkedIn-img.svg";
import { ReactComponent as MicrosoftIcon } from "app/modules/onboarding-module/asset/microsoft-img.svg";
import {
  DESKTOP_BREAKPOINT,
  MOBILE_BREAKPOINT,
  TABLET_STARTPOINT,
} from "app/theme";

export default function TryUsBlock() {
  const { isAuthenticated } = useAuth0();

  return (
    <>
      <p
        css={`
          text-align: center;
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          font-size: 48px;
          font-style: normal;
          line-height: normal;
          margin-bottom: 34px;
          margin-top: 0;
          color: #231d2c;
          @media (max-width: 1200px) {
            font-size: 36px;
            line-height: normal;
          }

          @media (max-width: ${MOBILE_BREAKPOINT}) {
            font-size: 18px;
            line-height: normal;
            margin-bottom: 32px;
          }
        `}
      >
        Best decisions are based on data
      </p>
      <div
        css={`
          background: #231d2c;
          box-shadow: 0px 4px 30px 4px rgba(206, 168, 188, 0.08);
          border-radius: 24px;
          display: flex;
          justify-content: space-between;
          padding: 58px 111px 45px 61px;
          align-items: center;
          height: 215px;
          width: 100%;
          p {
            &:nth-of-type(1) {
              color: #ffffff;
              font-size: 40px;
              line-height: 48px;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              margin: 0;
            }
            &:nth-of-type(2) {
              font-size: 24px;
              color: #f4f4f4;
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            }
          }
          @media (min-width: ${TABLET_STARTPOINT}) {
            @media (max-width: ${DESKTOP_BREAKPOINT}) {
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding: 48px 40px;
              height: 100%;
              p {
                &:nth-of-type(1) {
                  color: #ffffff;
                  font-size: 36px;
                  line-height: normal;
                }
              }
            }
          }
          @media (max-width: ${MOBILE_BREAKPOINT}) {
            padding: 48px 40px;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            height: 100%;

            p {
              margin: 0;
              text-align: center;
              &:nth-of-type(1) {
                font-size: 24px;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                line-height: normal;
              }
              &:nth-of-type(2) {
                font-size: 14px;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                line-height: normal;
                margin-top: 8px;
              }
            }
          }
        `}
      >
        <div>
          <p>Try Dataxplorer for free</p>{" "}
          <p>Dataxplorer turns data into impact </p>
        </div>
        {isAuthenticated && (
          <div
            css={`
              display: flex;
              flex-direction: column;
              gap: 24px;
              align-items: center;
              a {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;

                border-radius: 12px;
                white-space: nowrap;
                width: 210px;
                height: 48px;
                text-decoration: none;
                cursor: pointer;
                :hover {
                  opacity: 0.9;
                }
              }

              a:nth-child(1) {
                background: #6061e5;
                color: #ffffff;
              }

              a:nth-child(2) {
                background: #dadaf8;
                color: #231d2c;
              }
              @media (min-width: ${TABLET_STARTPOINT}) {
                @media (max-width: ${DESKTOP_BREAKPOINT}) {
                  flex-direction: row;
                  gap: 24px;
                  margin-top: 0;
                  a:nth-child(2) {
                    width: 124px;
                  }
                }
              }
              @media (max-width: ${MOBILE_BREAKPOINT}) {
                gap: 8px;
                margin-top: 40px;
                a:nth-child(2) {
                  width: 210px;
                }
              }
            `}
          >
            <Link to="/story/new/initial">Explore the Dashboard</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
        )}
        {!isAuthenticated && (
          <div
            css={`
              display: flex;
              flex-direction: column;
              gap: 24px;
              align-items: center;
              a {
                border-radius: 12px;
                background: var(--Secondary-Purple, #dadaf8);
                display: flex;
                width: 473px;
                height: 50px;
                justify-content: center;
                align-items: center;
                color: #231d2c;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                font-size: 18px;
                text-decoration: none;
              }
              @media (max-width: ${MOBILE_BREAKPOINT}) {
                width: 85%;
                gap: 16px;
                a {
                  width: 100%;
                }
              }
            `}
          >
            <div
              css={`
                display: flex;
                gap: 16px;
                width: 100%;
                justify-content: center;
                > button {
                  gap: 8px;
                  color: #231d2c;
                  display: flex;
                  width: 147px;
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
                }

                @media (max-width: ${MOBILE_BREAKPOINT}) {
                  flex-direction: column;
                  gap: 16px;

                  button {
                    width: 100%;
                  }
                }
              `}
            >
              <button onClick={() => socialAuth("google-oauth2")}>
                <GoogleIcon /> Google
              </button>
              <button onClick={() => socialAuth("linkedin")}>
                <LinkedInIcon /> LinkedIn
              </button>
              <button onClick={() => socialAuth("windowslive")}>
                <MicrosoftIcon /> Microsoft
              </button>
            </div>
            <Link to="/contact">Contact Us</Link>
          </div>
        )}
      </div>
    </>
  );
}
