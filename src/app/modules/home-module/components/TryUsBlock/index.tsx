import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { socialAuth } from "app/utils/socialAuth";
import { ReactComponent as GoogleIcon } from "app/modules/home-module/components/SignInButtons/assets/google-icon.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/home-module/components/SignInButtons/assets/linkedin-icon.svg";
import { ReactComponent as MicrosoftIcon } from "app/modules/home-module/components/SignInButtons/assets/microsoft-icon.svg";

interface TryUsBlockProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  bestDecisions?: boolean;
  contactUs?: boolean;
}

export default function TryUsBlock(props: TryUsBlockProps) {
  const { isAuthenticated } = useAuth0();

  return (
    <>
      {props.bestDecisions ? (
        <p
          css={`
            text-align: center;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            font-size: 48px;
            font-style: normal;
            line-height: normal;
            margin-bottom: 32px;
            margin-top: 0;
            color: #231d2c;
            @media (max-width: 1200px) {
              font-size: 36px;
              line-height: normal;
            }
            @media (max-width: 600px) {
              font-size: 18px;
              line-height: 24px;
              margin-bottom: 32px;
            }
          `}
        >
          Best decisions are based on data
        </p>
      ) : null}

      <div
        css={`
          background: #231d2c;
          box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.6);
          border-radius: 16px;
          display: flex;
          justify-content: space-between;
          padding: 48px 64px;
          align-items: center;
          width: 100%;
          @media (max-width: 1439px) {
            flex-direction: column;
            padding: 48px 40px;
            align-items: center;
            gap: 40px;
          }
        `}
      >
        <div>
          <p
            css={`
              color: #ffffff;
              font-size: 40px;
              line-height: normal;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              margin: 0;
              @media (max-width: 1439px) {
                text-align: center;
                font-size: 36px;
              }
              @media (max-width: 743px) {
                font-size: 24px;
              }
            `}
          >
            {props.title}
          </p>{" "}
          <p
            css={`
              margin: 0;
              font-size: 24px;
              color: #f4f4f4;
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              line-height: normal;
              margin-top: 16px;
              @media (max-width: 1439px) {
                text-align: center;
                margin-top: 8px;
              }
              @media (max-width: 743px) {
                font-size: 14px;
                line-height: 20px;
              }
            `}
          >
            {props.subtitle}
          </p>
        </div>
        {isAuthenticated && (
          <div
            css={`
              display: flex;
              flex-direction: column;
              gap: 24px;
              align-items: center;
              @media (max-width: 1439px) {
                flex-direction: row;
              }
              @media (max-width: 743px) {
                flex-direction: column;
                gap: 8px;
              }

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
                padding: 18.5px 24px;
                cursor: pointer;
                :hover {
                  opacity: 0.9;
                }
                @media (max-width: 1439px) {
                  width: max-content;
                }
                @media (max-width: 743px) {
                  width: 210px;
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
            `}
          >
            <Link to="/story/new/initial">Explore the Dashboard</Link>
            {props.contactUs ? <Link to="/contact">Contact Us</Link> : null}
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
                @media (max-width: 743px) {
                  width: 210px;
                }
              }
              @media (max-width: 743px) {
                width: 85%;
                gap: 16px;
              }
            `}
          >
            <div
              css={`
                display: flex;
                gap: 16px;
                width: 100%;
                justify-content: center;
                align-items: center;
                > button {
                  gap: 8px;
                  color: white;
                  display: flex;
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
                  > svg {
                    transform: scale(0.8);
                  }
                  :hover {
                    opacity: 0.8;
                    cursor: pointer;
                  }
                }
                @media (max-width: 743px) {
                  flex-direction: column;
                  gap: 16px;

                  button {
                    width: 210px;
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

            {props.contactUs ? <Link to="/contact">Contact Us</Link> : null}
          </div>
        )}
      </div>
    </>
  );
}
