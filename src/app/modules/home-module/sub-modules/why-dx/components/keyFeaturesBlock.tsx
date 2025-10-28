import React from "react";
import { GridSpacing } from "@material-ui/core/Grid";
import { ReactComponent as AIPoweredImg } from "app/modules/home-module/assets/whydx-ai-powered-illustration.svg";
import { ReactComponent as CharVizImg } from "app/modules/home-module/assets/whydx-chartviz-illustration.svg";
import { ReactComponent as OpenSourceImg } from "app/modules/home-module/assets/whydx-opensource-illustration.svg";
import { ReactComponent as StoriesImg } from "app/modules/home-module/assets/whydx-stories-illustration.svg";
import { ReactComponent as SearchImg } from "app/modules/home-module/assets/whydx-search-illustration.svg";
import { keyfeaturescss } from "app/modules/home-module/sub-modules/why-dx/style";
import { useMediaQuery } from "@material-ui/core";
import { MOBILE_BREAKPOINT } from "app/theme";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";

export default function KeyFeaturesBlock() {
  const isTablet = useMediaQuery("(max-width:1024px)");
  const isMobile = useMediaQuery(`(max-width:${MOBILE_BREAKPOINT})`);

  const cmsData = useCMSData({ returnData: true });

  let spacing: GridSpacing = 8;
  if (isTablet) {
    spacing = 6;
  }
  if (isMobile) {
    spacing = 2;
  }
  return (
    <section
      aria-label="Key Features of dataxplorer"
      css={keyfeaturescss.container}
    >
      <h2>
        {getCMSDataField(
          cmsData,
          "pagesWhyDataxplorer.keyFeaturesTitle",
          "Unlock the Power of Data with Dataxplorer"
        )}
      </h2>
      <div css={keyfeaturescss.flexContainer(false)}>
        <div
          css={`
            flex-basis: 50%;
          `}
        >
          <SearchImg
            role="presentation"
            css={`
              border-radius: 16px;
              box-shadow: 0px 13.449px 20.173px 0px rgba(0, 0, 0, 0.05),
                0px 4.035px 6.724px 0px rgba(0, 0, 0, 0.05),
                0px 0.672px 6.724px 0px rgba(0, 0, 0, 0.05);
              width: 100%;
            `}
          />
        </div>
        <div
          css={`
            flex-basis: 50%;
          `}
        >
          <div css={keyfeaturescss.text}>
            <h3>
              {getCMSDataField(
                cmsData,
                "pagesWhyDataxplorer.keyFeature1Title",
                "All-in-One Stack"
              )}
            </h3>
            <p>
              {getCMSDataField(
                cmsData,
                "pagesWhyDataxplorer.keyFeature1Text1",
                `Dataxplorer consolidates all your data management needs into a
              single, integrated stack. Whether it's data integration,
              visualization, or story creation, you'll find it all here. No more
              juggling multiple tools or struggling to maintain compatibility.`
              )}
              <br /> <br />
              {getCMSDataField(
                cmsData,
                "pagesWhyDataxplorer.keyFeature1Text2",
                `Our open-source platform simplifies your workflow, making your
              mission more efficient, and saving you time and resources`
              )}
            </p>
          </div>
        </div>
      </div>
      <div
        css={`
          height: 80px;
          @media (max-width: 1024px) {
            height: 80px;
          }
          @media (max-width: 600px) {
            height: 32px;
          }
        `}
      />
      <div
        css={`
          ${keyfeaturescss.flexContainer(true)};
        `}
      >
        <div
          css={`
            flex-basis: 50%;
          `}
        >
          <div css={keyfeaturescss.text}>
            <h3>
              {getCMSDataField(
                cmsData,
                "pagesWhyDataxplorer.keyFeature2Title",
                "Connect Data with Ease"
              )}
            </h3>
            <p>
              {getCMSDataField(
                cmsData,
                "pagesWhyDataxplorer.keyFeature2Text",
                `Dataxplorer simplifies the complex task of data integration,
              enabling you to seamlessly centralize your crucial datasets. Gone
              are the days of laborious manual data manipulation; we've
              streamlined the process for your convenience. <br /> <br />
              Spend less time on data wrangling and more on what matters most -
              making informed decisions.`
              )}
            </p>
          </div>
        </div>
        <div
          css={`
            flex-basis: 50%;
          `}
        >
          <AIPoweredImg
            role="presentation"
            css={`
              box-shadow: 0px 14.97px 22.455px 0px rgba(0, 0, 0, 0.05),
                0px 4.491px 7.485px 0px rgba(0, 0, 0, 0.05),
                0px 0.749px 7.485px 0px rgba(0, 0, 0, 0.05);
              border-radius: 16px;
            `}
          />
        </div>
      </div>
      <div
        css={`
          height: 80px;
          @media (max-width: 1024px) {
            height: 80px;
          }
          @media (max-width: 600px) {
            height: 32px;
          }
        `}
      />
      <div css={keyfeaturescss.flexContainer(false)}>
        <div
          css={`
            flex-basis: 50%;
          `}
        >
          <CharVizImg
            role="presentation"
            css={`
              border-radius: 16px;
              background: #fbfbfb;
              box-shadow: 0px 18.798px 28.197px 0px rgba(0, 0, 0, 0.05),
                0px 5.639px 9.399px 0px rgba(0, 0, 0, 0.05),
                0px 0.94px 9.399px 0px rgba(0, 0, 0, 0.05);
            `}
          />
        </div>
        <div
          css={`
            flex-basis: 50%;
          `}
        >
          <div css={keyfeaturescss.text}>
            <h3>
              {getCMSDataField(
                cmsData,
                "pagesWhyDataxplorer.keyFeature3Title",
                "Visualize Your Impact"
              )}
            </h3>
            <p>
              {getCMSDataField(
                cmsData,
                "pagesWhyDataxplorer.keyFeature3Text",
                `Your data is a valuable resource, and Dataxplorer empowers you to
              make the most of it. Our AI-driven agents are at your disposal,
              ready to generate the most pertinent charts for your specific
              dataset. With just a few clicks, you'll unlock insightful
              visualizations that vividly narrate your data's story, helping you
              uncover trends and patterns.`
              )}
            </p>
          </div>
        </div>
      </div>
      <div
        css={`
          height: 80px;
          @media (max-width: 1024px) {
            height: 80px;
          }
          @media (max-width: 600px) {
            height: 32px;
          }
        `}
      />
      <div css={keyfeaturescss.flexContainer(true)}>
        <div
          css={`
            flex-basis: 50%;
          `}
        >
          <div css={keyfeaturescss.text}>
            <h3>
              {getCMSDataField(
                cmsData,
                "pagesWhyDataxplorer.keyFeature4Title",
                "Interactive Stories"
              )}{" "}
            </h3>
            <p>
              {getCMSDataField(
                cmsData,
                "pagesWhyDataxplorer.keyFeature4Text1",
                `Transform your data-driven insights into engaging narratives that
              captivate and inform your stakeholders. Dataxplorer allows you to
              effortlessly create interactive stories that captivate and inform
              your stakeholders.`
              )}
              <br /> <br />
              {getCMSDataField(
                cmsData,
                "pagesWhyDataxplorer.keyFeature4Text2",
                `Incorporate charts, text, images, and videos seamlessly. Your
              ability to convey your findings with impact is now within reach,
              enhancing your ability to drive positive change.`
              )}
            </p>
          </div>
        </div>
        <div
          css={`
            flex-basis: 50%;
          `}
        >
          <OpenSourceImg
            role="presentation"
            css={`
              border-radius: 16px;
              background: #fbfbfb;
              box-shadow: 0px 13.449px 20.173px 0px rgba(0, 0, 0, 0.05),
                0px 4.035px 6.724px 0px rgba(0, 0, 0, 0.05),
                0px 0.672px 6.724px 0px rgba(0, 0, 0, 0.05);
            `}
          />
        </div>
      </div>
      <div
        css={`
          height: 80px;

          @media (max-width: ${MOBILE_BREAKPOINT}) {
            height: 32px;
          }
        `}
      />
      <div css={keyfeaturescss.flexContainer(false)}>
        <div
          css={`
            flex-basis: 50%;
          `}
        >
          <StoriesImg
            role="presentation"
            css={`
              border-radius: 16px;
              background: #fbfbfb;
              box-shadow: 0px 14.97px 22.455px 0px rgba(0, 0, 0, 0.05),
                0px 4.491px 7.485px 0px rgba(0, 0, 0, 0.05),
                0px 0.749px 7.485px 0px rgba(0, 0, 0, 0.05);
            `}
          />
        </div>
        <div
          css={`
            flex-basis: 50%;
          `}
        >
          <div css={keyfeaturescss.text}>
            <h3>
              {getCMSDataField(
                cmsData,
                "pagesWhyDataxplorer.keyFeature5Title",
                "Join The Data Revolution"
              )}
            </h3>
            <p>
              {getCMSDataField(
                cmsData,
                "pagesWhyDataxplorer.keyFeature5Text1",
                `Become a pioneer in the realm of data-driven decision-making.
              Embrace the future with Dataxplorer and experience the
              transformative power of streamlined data management. Sign up today
              and take the first step towards making a significant impact in the
              international aid development sector. `
              )}
              <br /> <br />
              {getCMSDataField(
                cmsData,
                "pagesWhyDataxplorer.keyFeature5Text2",
                `With Dataxplorer, your journey to data-driven excellence begins
              now.`
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
