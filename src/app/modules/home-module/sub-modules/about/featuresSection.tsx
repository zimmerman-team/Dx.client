import {
  TABLET_STARTPOINT,
  DESKTOP_BREAKPOINT,
  MOBILE_BREAKPOINT,
} from "app/theme";
import React from "react";
import { Container } from "@material-ui/core";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";

export default function FeaturesSection() {
  const cmsData = useCMSData({ returnData: true });

  const features = React.useMemo(
    () => [
      {
        title: "+100.000",
        subtitle: getCMSDataField(
          cmsData,
          "pagesAbout.feature1Subtitle",
          "Datasets available"
        ),
        text: getCMSDataField(
          cmsData,
          "pagesAbout.feature1Text",
          "Access over 100.000 datasets to create stories and charts. Create impact with data from 3rd parties built in Dataxplorer or connect your in-house datasources."
        ),
      },
      {
        title: "+15 Visuals",
        subtitle: getCMSDataField(
          cmsData,
          "pagesAbout.feature2Subtitle",
          "Chart type provided"
        ),
        text: getCMSDataField(
          cmsData,
          "pagesAbout.feature2Text",
          "Dataxplorer offers over 15 different chart types for you to work with. Based on the open sources Apache E-charts library you are able to create rich graphs."
        ),
      },
      {
        title: "+3",
        subtitle: getCMSDataField(
          cmsData,
          "pagesAbout.feature3Subtitle",
          "Languages are supported"
        ),
        text: getCMSDataField(
          cmsData,
          "pagesAbout.feature3Text",
          "Dataxplorer caters to a global clientele, ensuring seamless data integration and communication. We will offer Dataxplorer in 3 different languages."
        ),
      },
    ],
    [cmsData]
  );
  return (
    <>
      <div
        css={`
          background-color: #6061e5;
          padding: 48px 0;
        `}
      >
        <Container maxWidth="lg">
          <div
            css={`
              display: flex;
              justify-content: center;
              column-gap: 180px;
              @media (min-width: ${TABLET_STARTPOINT}) {
                @media (max-width: ${DESKTOP_BREAKPOINT}) {
                  column-gap: 56px;
                }
              }

              @media (max-width: ${MOBILE_BREAKPOINT}) {
                column-gap: unset;
                flex-direction: column;
                gap: 40px;
                padding: 0 16px;
              }
            `}
          >
            {features.map((feature, index) => (
              <div
                key={feature.title}
                css={`
                  width: ${index === 2 ? "100%" : "auto"};
                  @media (max-width: 1218px) {
                    h2 {
                      margin-left: unset;
                    }
                    p {
                      &:nth-of-type(1) {
                        margin-left: unset;
                      }
                      &:nth-of-type(2) {
                        width: 100%;
                      }
                    }
                  }
                `}
              >
                <h2
                  css={`
                    font-family: "GothamNarrow-Bold", "Helvetica Neue",
                      sans-serif;
                    font-size: 36px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 130%;
                    margin: 0;
                    color: #fff;

                    @media (max-width: ${MOBILE_BREAKPOINT}) {
                      font-size: 32px;
                    }
                  `}
                >
                  {feature.title}
                </h2>
                <p
                  css={`
                    font-size: 24px;
                    font-family: "GothamNarrow-Bold", "Helvetica Neue",
                      sans-serif;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 130%;
                    margin: 0;
                    color: #fff;

                    @media (min-width: ${TABLET_STARTPOINT}) {
                      @media (max-width: ${DESKTOP_BREAKPOINT}) {
                        column-gap: 18px;
                      }
                    }
                    @media (max-width: ${MOBILE_BREAKPOINT}) {
                      font-size: 20px;
                    }
                  `}
                >
                  {feature.subtitle}
                </p>
                <p
                  css={`
                    color: #fff;
                    font-family: "GothamNarrow-Book", "Helvetica Neue",
                      sans-serif;
                    white-space: pre-line;
                    margin: 0;
                    margin-top: 16px;
                    font-size: 16px;
                  `}
                >
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}
