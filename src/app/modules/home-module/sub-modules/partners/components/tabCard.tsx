import React from "react";
import AboutCard from "@app/modules/home-module/assets/about-card.png";
import GrantsCard from "@app/modules/home-module/assets/grants-card.png";
import BudgetsCard from "@app/modules/home-module/assets/budgets-card.png";
import PerfomanceCard from "@app/modules/home-module/assets/targets-result.png";
import { FOCUS_VISIBLE_STYLE_LIGHT } from "@app/theme";
import { useCMSData } from "@app/hooks/useCMSData";
import { getCMSDataField } from "@app/utils/getCMSDataField";

function TabCard(props: {
  src: string;
  alt: string;
  title: string;
  description: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div
      css={`
        position: relative;
        z-index: 1;
        width: 100%;
        display: flex;
        flex-direction: ${props.reverse ? "row-reverse" : "row"};
        height: 100%;
        justify-content: center;
        align-items: center;
        gap: 56px;
        font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
        color: #ffffff;
        overflow-x: hidden;

        a {
          text-decoration: none;
          color: #ffffff;
          border-bottom: 1px solid #ffffff;
          cursor: pointer;
          :focus-visible {
            ${FOCUS_VISIBLE_STYLE_LIGHT}
          }
        }

        img {
          width: 508px;
          object-fit: contain;
          position: relative;
          z-index: 2;
        }

        h4 {
          font-size: 34px;
          line-height: normal;
          margin: 0;
          margin-bottom: 11px;
        }
        p {
          font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
          white-space: pre-line;
          font-weight: 400;
          line-height: 24px;
          font-size: 18px;
        }

        @media (max-width: 1439px) {
          flex-direction: column;
          gap: 30px;
          img {
            width: 473.5px;
          }
        }
        @media (max-width: 743px) {
          gap: 20px;
          img {
            width: 285.841px;
          }
        }
      `}
    >
      <div>
        <img src={props.src} alt={props.alt} />
      </div>
      <div>
        <h4>
          <b>{props.title}</b>
        </h4>
        {props.description}
      </div>
    </div>
  );
}

export const AboutTabCard = () => {
  const cmsData = useCMSData({ returnData: true });
  const description = (
    <p>
      {getCMSDataField(
        cmsData,
        "pagesPartners.aboutCardDescription1",
        `The Global Fund's Data Explorer is one of the key transparency tools
      of the organization.`
      )}
      <br />
      <br />{" "}
      {getCMSDataField(
        cmsData,
        "pagesPartners.aboutCardDescription2",
        `The Data Explorer visualizes where investments come from, where
      they are and what they achieve by providing pledge and contribution data,
      grant financial data, and results data at global, regional and country
      levels.`
      )}
      <br /> <br />
      <a
        href="https://data.theglobalfund.org/"
        rel="noreferrer noopener"
        target="_blank"
      >
        {getCMSDataField(
          cmsData,
          "pagesPartners.aboutCardLinkText",
          "Visit the Global Fund Data Explorer"
        )}
      </a>
    </p>
  );
  return (
    <TabCard
      src={AboutCard}
      alt="about_snippet"
      title={getCMSDataField(
        cmsData,
        "pagesPartners.aboutCardTitle",
        "The Global Fund Data Explorer"
      )}
      description={description}
      reverse
    />
  );
};

export const GrantsTabCard = () => {
  const cmsData = useCMSData({ returnData: true });
  const description = (
    <p>
      {getCMSDataField(
        cmsData,
        "pagesPartners.grantsCardDescription1",
        `The effective implementation and monitoring of thousands of grants is at
      the core of the Global Funds work to end HIV, TB and malaria as epidemics.
      All collected grant data is presented via the Data Explorer.`
      )}
      <br />
      <br />
      <a
        target="_blank"
        href="https://data.theglobalfund.org/location/KEN/grants"
        rel="noreferrer"
      >
        {getCMSDataField(
          cmsData,
          "pagesPartners.grantsCardLinkText",
          "LiveView"
        )}
      </a>{" "}
      {getCMSDataField(
        cmsData,
        "pagesPartners.grantsCardDescription2",
        " of the Grant Implementation on the Global Fund Data Explorer"
      )}
    </p>
  );
  return (
    <TabCard
      src={GrantsCard}
      alt="grants_snippet"
      title={getCMSDataField(
        cmsData,
        "pagesPartners.grantsCardTitle",
        "Grant Implementation Period"
      )}
      description={description}
    />
  );
};

export const BudgetsTabCard = () => {
  const cmsData = useCMSData({ returnData: true });
  const description = (
    <p>
      {getCMSDataField(
        cmsData,
        "pagesPartners.budgetsCardDescription1",
        `The Global Fund applies strict budget requirements during the development,
      review and implementation of Global Fund-supported programs. It
      establishes clear eligibility criteria for grant expenditures and
      requirements for monitoring and financial storytelling obligations.`
      )}
      <br />
      <br />{" "}
      {getCMSDataField(
        cmsData,
        "pagesPartners.budgetsCardDescription2",
        `All collected financial storytelling data on budgets including
      investment landscapes and corresponding cost categories is presented via
      the Data Explorer.`
      )}
      <br />
      <br />
      <a
        target="_blank"
        href="https://data.theglobalfund.org/location/KEN/budgets/flow"
        rel="noreferrer"
      >
        {getCMSDataField(
          cmsData,
          "pagesPartners.budgetsCardLinkText",
          "LiveView"
        )}
      </a>
      {getCMSDataField(
        cmsData,
        "pagesPartners.budgetsCardDescription3",
        " of the Budget Flow on the Global Fund Data Explorer"
      )}
    </p>
  );
  return (
    <TabCard
      reverse
      src={BudgetsCard}
      alt="budgets_snippet"
      title="Grant Budgeting"
      description={description}
    />
  );
};

export const PerformanceTabCard = () => {
  const cmsData = useCMSData({ returnData: true });
  const description = (
    <p>
      {getCMSDataField(
        cmsData,
        "pagesPartners.performanceCardDescription1",
        `The Global Fund requires countries to story grant performance indicators
      on funded programs. The data provided by national monitoring and
      evaluation systems is critical to informing decision-making on the part of
      both implementers and funders.`
      )}
      <br />
      <br />
      {getCMSDataField(
        cmsData,
        "pagesPartners.performanceCardDescription2",
        `All collected performance data on funded programs is presented via the
      Data Explorer.`
      )}
      <br />
      <br />
      <a
        target="_blank"
        href="https://data.theglobalfund.org/grant/KEN-H-TNT/3/targets-results"
        rel="noreferrer"
      >
        {getCMSDataField(
          cmsData,
          "pagesPartners.performanceCardLinkText",
          "LiveView"
        )}
      </a>{" "}
      {getCMSDataField(
        cmsData,
        "pagesPartners.performanceCardDescription3",
        " of the Performance Framework"
      )}
    </p>
  );
  return (
    <TabCard
      src={PerfomanceCard}
      alt="performance_snippet"
      title={getCMSDataField(
        cmsData,
        "pagesPartners.performanceCardTitle",
        "Targets & results"
      )}
      description={description}
    />
  );
};
