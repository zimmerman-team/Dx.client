import React from "react";
import Container from "@material-ui/core/Container";
import AssetsList from "./assetsList";
import { PrimaryButton } from "app/components/Styled/button";
import { ReactComponent as RightArrow } from "app/modules/home-module/assets/right-arr.svg";
import { DESKTOP_BREAKPOINT, MOBILE_BREAKPOINT } from "app/theme";
import { useHistory } from "react-router-dom";
import TryUsBlock from "app/modules/home-module/components/TryUsBlock";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";

export default function NonAuthUserLibrary() {
  const cmsData = useCMSData({ returnData: true });
  const history = useHistory();

  return (
    <React.Fragment>
      <Container
        maxWidth="lg"
        css={`
          box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.1);

          padding: 72px 24px;
          @media (max-width: 960px) {
            padding: 40px 32px;
          }
          @media (max-width: 744px) {
            padding: 40px 16px;
          }
        `}
      >
        <div
          css={`
            display: flex;
            justify-content: space-between;
            align-items: center;
            h2 {
              color: #231d2c;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              font-size: 48px;
              margin: 0;
              line-height: 100%;
            }
            p {
              color: #231d2c;
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              font-size: 18px;
              line-height: 24px;
              margin: 0;
            }
            @media (max-width: ${DESKTOP_BREAKPOINT}) {
              flex-direction: column;
              align-items: flex-start;
              row-gap: 20px;
              h2 {
                svg {
                  height: 34px;
                  width: fit-content;
                }
              }
              @media (max-width: ${MOBILE_BREAKPOINT}) {
                h2 {
                  font-size: 34px;
                  svg {
                    height: 25px;
                    width: fit-content;
                  }
                }
              }
            }
          `}
        >
          <div>
            <h2>
              {getCMSDataField(
                cmsData,
                "pagesHome.defaultAssetsTitle",
                "See Our Default Dataxplorer Assets"
              )}
            </h2>
            <p>
              {getCMSDataField(
                cmsData,
                "pagesHome.defaultAssetsSubtitle",
                `Explore ready-made assets from DataXplorer. Sign in to create your
              own data stories.`
              )}
            </p>
          </div>
          <div
            css={`
              button {
                height: 41px;
                gap: 28px;
                @media (max-width: ${DESKTOP_BREAKPOINT}) {
                  font-size: 16px;
                }
                @media (max-width: ${MOBILE_BREAKPOINT}) {
                  font-size: 14px;
                }
              }
            `}
          >
            <PrimaryButton
              bg="light"
              size="small"
              onClick={() => history.push("/onboarding/signin")}
            >
              {getCMSDataField(
                cmsData,
                "pagesHome.defaultAssetsSeeItInActionButton",
                "See It in Action"
              )}
              <RightArrow />
            </PrimaryButton>
          </div>
        </div>
        <AssetsList />
        <TryUsBlock
          title={getCMSDataField(
            cmsData,
            "pagesHome.tryUsBlockTitle",
            "Give Dataxplorer a try, on us"
          )}
          subtitle={getCMSDataField(
            cmsData,
            "pagesHome.tryUsBlockSubtitle",
            "Dataxplorer turns data into impact in minutes"
          )}
          signInWith
        />
      </Container>
    </React.Fragment>
  );
}
