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
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";

export default function HomeModule() {
  useTitle("Dataxplorer");

  const cmsData = useCMSData({ returnData: true });

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
                  {getCMSDataField(
                    cmsData,
                    "pagesHome.heroTitle",
                    "Create high impact data driven {storiesText}",
                    {
                      storiesText: (
                        <b
                          css={`
                            background: linear-gradient(
                              90deg,
                              #231d2c,
                              #6061e5
                            );
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                          `}
                        >
                          {getCMSDataField(
                            cmsData,
                            "pagesHome.heroTitleStoriesText",
                            "stories"
                          )}
                        </b>
                      ),
                    },
                    true
                  )}
                </>
              }
            >
              <p>
                {getCMSDataField(
                  cmsData,
                  "pagesHome.heroSignInText",
                  "Sign in for free to unlock data visualisation tools with"
                )}
              </p>
              <Box height={"10px"} />
              <SignInButtons />
            </Hero>
            <Card />
          </>
        ) : (
          <Box height={40} />
        )}
        <main>
          {!isAuthenticated ? <NonAuthUserLibrary /> : <AssetsCollection />}
        </main>
      </div>
      <HomeFooter mini={isAuthenticated} />
    </div>
  );
}
