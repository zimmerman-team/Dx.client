import React from "react";
import Grid from "@material-ui/core/Grid";
import { useAuth0 } from "@auth0/auth0-react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import AuthCard from "app/modules/onboarding-module/component/card";
import MainImage from "app/modules/onboarding-module/asset/main-image.png";
import Ellipsis from "app/modules/onboarding-module/asset/ellipses.svg";
import { useTitle } from "react-use";
import HomeFooter from "app/modules/home-module/components/Footer";
import InlineLogo from "app/modules/home-module/assets/inline-logo";

export default function Onboarding() {
  useTitle("Dataxplorer - Onboarding");

  const history = useHistory();
  const location = useLocation();
  const { isAuthenticated } = useAuth0();
  const tablet = useMediaQuery("(max-width: 1140px)");

  if (isAuthenticated) {
    history.replace("/");
  }
  return (
    <div
      css={`
        height: calc(100vh - 50px);
        @media (max-width: 1140px) {
          height: calc(100vh - 66px);
        }
      `}
    >
      <Grid
        container
        css={`
          padding-left: 40px;
          position: relative;
          margin-top: 50px;
          height: calc(100vh - 50px - 64px);
          @media (max-width: 1140px) {
            padding-left: unset;
            margin-top: 66px;
            height: calc(100vh - 66px - 64px);
          }
          @media (max-width: 600px) {
            margin-top: 66px;
            height: calc(100vh - 66px - 124px);
          }
        `}
      >
        <Grid
          xs={12}
          sm={12}
          md={12}
          lg={true}
          css={`
            @media (max-width: 1024px) {
              padding-bottom: 7rem;
            }
            padding-top: 104px;
          `}
        >
          <div
            css={`
              margin: auto;
              @media (max-width: 1140px) {
                width: 395px;
              }
              @media (max-width: 428px) {
                width: 94%;
              }
            `}
          >
            <h2
              css={`
                color: #231d2c;
                font-size: 40px;
                font-weight: 700;
                font-style: normal;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                padding: 0;
                margin: 0;
                text-align: center;
                line-height: normal;
              `}
            >
              Sign in to get started
            </h2>
            <p
              css={`
                padding: 0;
                margin: 0;
                line-height: 24px;
                font-size: 18px;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                text-align: center;
                margin-top: 8px;
              `}
            >
              Choose your preferred login method below.
            </p>

            <Switch>
              <Route path="/onboarding/signup">
                <AuthCard />
              </Route>
              <Route path="/onboarding/signin">
                <AuthCard isSignIn />
              </Route>
            </Switch>
          </div>
        </Grid>
        {!tablet && (
          <Grid
            xs={false}
            sm={false}
            md={6}
            lg={"auto"}
            css={`
              right: 0;
              width: 50%;
              background: url(${Ellipsis}), #f2f7fd;
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat, no-repeat;
              display: flex;
              flex-direction: column;
              align-items: center;
            `}
          >
            <h1
              css={`
                font-size: 40px;
                line-height: normal;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                color: #231d2c;
                display: flex;
                align-items: center;
                gap: 8px;
                margin: 0;
                margin-top: 104px;
              `}
            >
              Welcome to <InlineLogo width={"239.968px"} height={"25.669px"} />
            </h1>
            <p
              css={`
                font-size: 18px;
                line-height: normal;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                color: #231d2c;
                margin-top: 8px;
              `}
            >
              Create high-impact, data-driven stories.
            </p>

            <img
              src={MainImage}
              alt=""
              css={`
                width: 512px;
                margin-top: 50px;
              `}
            />
          </Grid>
        )}
      </Grid>
      <HomeFooter />
    </div>
  );
}
