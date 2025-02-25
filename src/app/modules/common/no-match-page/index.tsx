import React from "react";
import { Link, useHistory } from "react-router-dom";
import { ReactComponent as BgImg } from "app/modules/common/no-match-page/asset/bg-ellipse.svg";
import { PrimaryButton } from "app/components/Styled/button";
import HomeFooter from "app/modules/home-module/components/Footer";

// cc:refactor this component, inline css need to be moved to proper styled components

export const NoMatchPage = () => {
  const history = useHistory();

  return (
    <div
      css={`
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      `}
    >
      <div
        css={`
          width: 100%;
          height: calc(100vh - 113px);
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          position: relative;
        `}
      >
        <BgImg
          css={`
            position: absolute;
            top: 80px;
            z-index: -1;
            left: 0;
            width: 100%;
          `}
        />
        <div>
          <h2
            css={`
              font-size: 64px;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              color: #231d2c;
              margin: 0;
              line-height: normal;
            `}
          >
            404
          </h2>
        </div>

        <div
          css={`
            p {
              text-align: center;
            }
            p:nth-of-type(1) {
              font-size: 34px;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              color: #6061e5;
              margin: 0;
              line-height: 41px;
            }
            p:nth-of-type(2) {
              font-size: 18px;
              font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
              color: #231d2c;
              margin: 0;
              margin-top: 24px;
            }
            margin-bottom: 24px;
          `}
        >
          <p>Oops! This page could not be found</p>
          <p>
            Sorry but the page you are looking for does not exist, have been
            removed, have changed or is temporarily unavailable.
          </p>
        </div>
        <div
          css={`
            display: flex;
            gap: 30px;
            justify-content: center;
            @media (max-width: 500px) {
              flex-direction: column;
              align-items: center;
              width: 100%;
            }
          `}
        >
          <Link
            to="/"
            css={`
              text-decoration: none;
            `}
          >
            <PrimaryButton bg="dark" size="big">
              Back to Home Page
            </PrimaryButton>
          </Link>
          <PrimaryButton
            onClick={() => {
              history.go(-1);
            }}
            bg="light"
            size="big"
          >
            Previous page
          </PrimaryButton>
        </div>
      </div>
      <HomeFooter mini />
    </div>
  );
};
