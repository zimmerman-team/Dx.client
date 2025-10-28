import React from "react";
import { Box, Container } from "@material-ui/core";
import { ReactComponent as StoryImg } from "app/modules/home-module/assets/about-story.svg";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import HomeFooter from "app/modules/home-module/components/Footer";
import { useTitle } from "react-use";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import HeroEllipses from "app/modules/home-module/assets/hero-ellipses.png";
import HeroEllipsesTablet from "app/modules/home-module/assets/hero-ellipses-tablet.svg";
import HeroEllipsesMobile from "app/modules/home-module/assets/hero-ellipses-mobile.svg";
import AddAssetDropdown from "app/modules/home-module/components/AddAssetDropdown";
import {
  DESKTOP_BREAKPOINT,
  MOBILE_BREAKPOINT,
  TABLET_STARTPOINT,
} from "app/theme";
import { ctaLinkStyle } from "app/modules/home-module/sub-modules/partners";
import TeamSection from "./teamSection";
import MissionSection from "./missionSection";
import FeaturesSection from "./featuresSection";
import AuthButtons from "./authButtons";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";

export default function AboutModule() {
  useTitle("Dataxplorer - About");
  const { isAuthenticated } = useAuth0();
  const cmsData = useCMSData({ returnData: true });

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-top: 50px;
        min-height: calc(100vh - 50px);
        @media (max-width: 880px) {
          margin-top: 66px;
          min-height: calc(100vh - 66px);
        }
      `}
    >
      <main
        css={`
          padding-bottom: 100px;
          @media (max-width: 960px) {
            padding-bottom: 40px;
          }
          background-color: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0) 0%,
            #f2f7fd 100%
          );
        `}
      >
        <div
          css={`
            padding: 77px 0;
            @media (max-width: 600px) {
              padding: 64px 0;
            }

            background: url(${HeroEllipses}),
              linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f2f7fd 100%);
            background-color: #f2f7fd;
            background-repeat: no-repeat;
            background-size: cover;
            background-position: 58px 0%;
            @media (max-width: 960px) {
              background: url(${HeroEllipsesTablet}),
                linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f2f7fd 100%);
              background-repeat: no-repeat;
              background-size: cover;
              background-position: bottom right;
            }
            @media (max-width: 744px) {
              background: url(${HeroEllipsesMobile}),
                linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f2f7fd 100%);
              background-repeat: no-repeat;
              background-size: cover;
              background-position: bottom right;
            }
          `}
        >
          {" "}
          <Container maxWidth="lg">
            <h1
              css={`
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                font-size: 48px;
                font-style: normal;
                font-weight: 400;
                line-height: 130%;
                margin: 0;
                @media (min-width: ${TABLET_STARTPOINT}) {
                  display: none;
                }
              `}
            >
              {getCMSDataField(cmsData, "pagesAbout.title", "Our Story")}
            </h1>
            <div
              css={`
                display: flex;
                justify-content: space-between;
                align-items: center;
                @media (max-width: ${MOBILE_BREAKPOINT}) {
                  flex-direction: column-reverse;
                }
              `}
            >
              <div
                css={`
                  flex-basis: 50%;

                  @media (max-width: ${MOBILE_BREAKPOINT}) {
                    p {
                      font-size: 16px;
                    }
                    h1 {
                      font-size: 40px;
                    }
                  }
                `}
              >
                <h1
                  css={`
                    font-family: "GothamNarrow-Bold", "Helvetica Neue",
                      sans-serif;
                    font-size: 64px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 130%;
                    margin: 0;
                    @media (max-width: ${MOBILE_BREAKPOINT}) {
                      display: none;
                    }
                  `}
                >
                  {getCMSDataField(cmsData, "pagesAbout.title", "Our Story")}
                </h1>

                <p
                  css={`
                    margin: 0;
                    margin-top: 37.38px;
                    font-size: 24px;
                    font-style: normal;
                    font-weight: 325;
                    line-height: normal;
                    font-family: "GothamNarrow-Book", "Helvetica Neue",
                      sans-serif;
                    @media (max-width: 1024px) {
                      font-family: "GothamNarrow-Book", "Helvetica Neue",
                        sans-serif;
                      font-size: 18px;
                    }
                    @media (max-width: 500px) {
                      margin-top: 0px;
                    }
                  `}
                >
                  {getCMSDataField(
                    cmsData,
                    "pagesAbout.subTitle1",
                    `With 20+ years combined experience in data and global health
                  development, we empower organisations with innovative data
                  solutions to enhance their communication. Our decade-long
                  commitment drives us to advance data communication
                  continually.`
                  )}
                  <br />
                  <br />
                  {getCMSDataField(
                    cmsData,
                    "pagesAbout.subTitle2",
                    `Discover the true potential of your data with Dataxplorer. Let
                  us help you harness its power!`
                  )}
                </p>
              </div>

              <div
                css={`
                  margin-right: -41px;
                  margin-bottom: -141px;
                  flex-shrink: 0;
                  flex-basis: 50%;
                  @media (max-width: ${DESKTOP_BREAKPOINT}) {
                    margin-right: unset;
                    svg {
                      width: 100%;
                      height: 100%;
                    }
                    @media (max-width: ${MOBILE_BREAKPOINT}) {
                      margin-bottom: unset;
                    }
                  }
                `}
              >
                <StoryImg />
              </div>
            </div>
            <div
              css={`
                margin-top: 24px;
              `}
            >
              {isAuthenticated && (
                <div
                  css={`
                    display: flex;
                    column-gap: 20px;
                    a {
                      text-decoration: none;
                    }
                    @media (max-width: ${MOBILE_BREAKPOINT}) {
                      flex-direction: column;
                      gap: 10px;
                      justify-content: center;
                      align-items: center;
                    }
                  `}
                >
                  <AddAssetDropdown />

                  <Link
                    to="/"
                    data-cy="empower-block-explore-stories-link"
                    css={ctaLinkStyle("dashboard")}
                  >
                    {getCMSDataField(
                      cmsData,
                      "pagesAbout.exploreDashboardCta",
                      "Explore the Dashboard"
                    )}
                  </Link>
                </div>
              )}
              {!isAuthenticated && <AuthButtons />}
            </div>
          </Container>
        </div>

        <FeaturesSection />
        <Box
          height={{
            xs: 32,
            md: 40,
            lg: 80,
          }}
        />

        <Container maxWidth="lg">
          <TeamSection />
          <div
            css={`
              height: 120px;
              @media (min-width: ${TABLET_STARTPOINT}) {
                @media (max-width: ${DESKTOP_BREAKPOINT}) {
                  height: 72px;
                }
              }
              @media (max-width: ${MOBILE_BREAKPOINT}) {
                height: 56px;
              }
            `}
          />
          <MissionSection />
        </Container>
      </main>
      <HomeFooter />
    </div>
  );
}
