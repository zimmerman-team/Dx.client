import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { socialAuth } from "app/utils/socialAuth";
import { ReactComponent as GoogleIcon } from "app/modules/onboarding-module/asset/google-img.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/onboarding-module/asset/linkedIn-img.svg";
import { ReactComponent as MicrosoftIcon } from "app/modules/onboarding-module/asset/microsoft-img.svg";

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
            margin-bottom: 34px;
            margin-top: 0;
            color: #231d2c;
            @media (max-width: 1200px) {
              font-size: 36px;
              line-height: normal;
            }
            @media (max-width: 600px) {
              font-size: 18px;
              line-height: normal;
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
          @media (max-width: 1120px) {
            flex-direction: column;
            height: 100%;
            padding: unset;
            padding-top: 58px;
            padding-bottom: 45px;
            align-items: center;
            p {
              &:nth-of-type(1) {
                text-align: center;
              }
              &:nth-of-type(2) {
                text-align: center;
              }
            }

            @media (max-width: 774px) {
              padding: 32px 32px;
              flex-direction: column;
              align-items: center;
              gap: 20px;
              p {
                margin: 0;
                &:nth-of-type(1) {
                  font-size: 31px;
                  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                  line-height: normal;
                }
                &:nth-of-type(2) {
                  font-size: 18px;
                  font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                  line-height: normal;
                  margin-top: 8px;
                }
              }
            }
          }
        `}
      >
        <div>
          <p>{props.title}</p> <p>{props.subtitle}</p>
        </div>
        {isAuthenticated && (
          <div
            css={`
              display: flex;
              flex-direction: column;
              gap: 24px;
              align-items: center;
              @media (max-width: 774px) {
                gap: 22px;
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
                height: 41px;
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
                @media (max-width: 655px) {
                  width: 100%;
                }
              }
              @media (max-width: 655px) {
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
                @media (max-width: 655px) {
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

            {props.contactUs ? <Link to="/contact">Contact Us</Link> : null}
          </div>
        )}
      </div>
    </>
  );
}
