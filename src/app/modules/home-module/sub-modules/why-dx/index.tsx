import React from "react";
import Container from "@material-ui/core/Container";
import HomeFooter from "app/modules/home-module/components/Footer";
import EllipsesDesktop from "app/modules/home-module/assets/whydx-ellipses.svg";
import EllipsesTablet from "app/modules/home-module/assets/whydx-ellipses-tablet.svg";
import EllipsesMobile from "app/modules/home-module/assets/whydx-ellipses-mobile.svg";
import TryUsBlock from "app/modules/home-module/components/TryUsBlock";
import KeyFeaturesBlock from "app/modules/home-module/sub-modules/why-dx/components/keyFeaturesBlock";
import { useTitle } from "react-use";
import { useMediaQuery } from "usehooks-ts";
import Hero from "app/modules/home-module/components/hero";
import { useAuth0 } from "@auth0/auth0-react";
import { Box } from "@material-ui/core";
import AddAssetDropdown from "app/modules/home-module/components/AddAssetDropdown";
import { Link } from "react-router-dom";
import SignInButtons from "app/modules/home-module/components/SignInButtons";
import { ctaLinkStyle } from "app/modules/home-module/sub-modules/partners";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";

export default function WhyDX() {
  useTitle("Dataxplorer - Why Dataxplorer?");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 641px)");
  let Ellipses = EllipsesDesktop;
  if (isTablet) {
    Ellipses = EllipsesTablet;
  } else if (isMobile) {
    Ellipses = EllipsesMobile;
  }
  const { isAuthenticated } = useAuth0();

  const cmsData = useCMSData({ returnData: true });

  return (
    <>
      <div
        css={`
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-top: 50px;
          min-height: calc(100vh - 50px);
        `}
      >
        <div>
          <Hero
            title={
              <>
                {getCMSDataField(
                  cmsData,
                  "pagesWhyDataxplorer.heroTitle",
                  "Create high impact data driven {storiesText}",
                  {
                    storiesText: (
                      <b
                        css={`
                          background: linear-gradient(90deg, #231d2c, #6061e5);
                          -webkit-background-clip: text;
                          -webkit-text-fill-color: transparent;
                        `}
                      >
                        {getCMSDataField(
                          cmsData,
                          "pagesWhyDataxplorer.heroTitleHighlightedText",
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
            {isAuthenticated ? (
              <Box
                display={"flex"}
                gridColumnGap={"24px"}
                gridRowGap={"8px"}
                justifyContent={"center"}
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems={"center"}
              >
                <AddAssetDropdown />
                <Link
                  to="/"
                  data-cy="empower-block-explore-stories-link"
                  css={`
                    ${ctaLinkStyle("dashboard")} @media (max-width: 600px) {
                      width: max-content;
                    }
                  `}
                >
                  {getCMSDataField(
                    cmsData,
                    "pagesWhyDataxplorer.exploreDashboardCta",
                    "Explore the Dashboard"
                  )}
                </Link>
              </Box>
            ) : (
              <div>
                <p>
                  {getCMSDataField(
                    cmsData,
                    "pagesWhyDataxplorer.heroSignInText",
                    "Sign in for free to unlock data visualisation tools with"
                  )}
                </p>
                <Box height={"10px"} />
                <SignInButtons />
              </div>
            )}
          </Hero>
          <div
            css={`
              background-color: #f2f7fd;
            `}
          >
            <Container
              maxWidth="lg"
              css={`
                @media (max-width: 1024px) {
                  padding: 0 32px !important;
                }

                @media (max-width: 600px) {
                  padding: 0 24px !important;
                }
              `}
            >
              <KeyFeaturesBlock />
              <div
                css={`
                  height: 120px;
                  @media (max-width: 1024px) {
                    height: 72px;
                  }
                `}
              />
              <TryUsBlock
                title={getCMSDataField(
                  cmsData,
                  "pagesWhyDataxplorer.tryUsBlockTitle",
                  "Try Dataxplorer for free"
                )}
                subtitle={getCMSDataField(
                  cmsData,
                  "pagesWhyDataxplorer.tryUsBlockSubtitle",
                  "Dataxplorer turns data into impact"
                )}
                contactUs
                bestDecisions
                center
              />
              <div
                css={`
                  height: 100px;
                  @media (max-width: 1024px) {
                    height: 40px;
                  }
                `}
              />
            </Container>
          </div>
        </div>
        <HomeFooter />
      </div>
    </>
  );
}
