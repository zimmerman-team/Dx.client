/* third-party */
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import useTitle from "react-use/lib/useTitle";
/* project */
import HomeFooter from "app/modules/home-module/components/Footer";
import AssetsCollection from "./components/AssetCollection";
import Hero from "./components/hero";
import NonAuthUserLibrary from "./components/nonAuthUserLibrary";
import { Box } from "@material-ui/core";
import SignInButtons from "./components/SignInButtons";
import Card from "./components/carousel";
import useBackgroundColor from "app/hooks/useBackgroundColor";

export default function HomeModule() {
  useTitle("Dataxplorer");

  const { isAuthenticated } = useAuth0();
  useBackgroundColor(isAuthenticated ? "#FFF" : "#f2f7fd", [isAuthenticated]);

  return (
    <div
      css={`
        margin-top: 50px;
        min-height: calc(100vh - 50px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        @media (max-width: 881px) {
          margin-top: 66px;
          min-height: calc(100vh - 66px);
        }
      `}
    >
      <div>
        {!isAuthenticated ? (
          <>
            <Hero
              title={
                <>
                  Create high impact data driven{" "}
                  <b
                    css={`
                      background: linear-gradient(90deg, #231d2c, #6061e5);
                      -webkit-background-clip: text;
                      -webkit-text-fill-color: transparent;
                    `}
                  >
                    stories
                  </b>
                </>
              }
            >
              <p>Sign in for free to unlock data visualisation tools with</p>
              <Box height={"10px"} />
              <SignInButtons />
            </Hero>
            <Card />
          </>
        ) : (
          <Box height={40} />
        )}

        {!isAuthenticated ? <NonAuthUserLibrary /> : <AssetsCollection />}
      </div>
      <HomeFooter mini={isAuthenticated} />
    </div>
  );
}
