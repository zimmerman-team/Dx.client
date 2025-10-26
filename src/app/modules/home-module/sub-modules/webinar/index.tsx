import React from "react";
import Hero from "app/modules/home-module/components/hero";
import { Box, Container } from "@material-ui/core";
import { ClockIcon } from "./assets/ClockIcon";
import { UsersIcon } from "./assets/UsersIcon";
import { CalendarIcon } from "./assets/CalendarIcon";
import { DESKTOP_BREAKPOINT, MOBILE_BREAKPOINT } from "app/theme";
import WhatYouLearn from "./components/what-you-learn";
import ReserveYourSpot from "./components/reserve-your-spot";

const WebinarPage = () => {
  return (
    <div
      css={`
        margin-top: 50px;
        min-height: calc(100vh - 50px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      `}
    >
      <Hero
        title={
          <>
            <b
              css={`
                background: linear-gradient(
                  96deg,
                  #231d2c 50.57%,
                  #6061e5 71.38%
                );
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              `}
            >
              Join to Our Webinar Series
            </b>
          </>
        }
      >
        <div
          css={`
            p {
              font-family: "GothamNarrow-Book", sans-serif !important;
              font-weight: 325 !important;
              @media (max-width: ${DESKTOP_BREAKPOINT}) {
                font-size: 18px !important;
              }
            }
          `}
        >
          <p>
            Be among the first to experience the future of data visualization
            and storytelling. Join us for an <br /> exclusive deep-dive into our
            DataXplorer walkthrough, explore the features, and upcoming roadmap.
            <br /> Get insights and ask questions directly to our product team.
          </p>
          <Box height={"24px"} />
          <div
            css={`
              display: flex;
              gap: 30px;
              justify-content: center;
              @media (max-width: ${MOBILE_BREAKPOINT}) {
                flex-direction: column;
                margin: 0 auto;
                width: max-content;
              }
              p {
                display: flex;
                align-items: center;
                gap: 10px;
              }
            `}
          >
            <p>
              <ClockIcon /> 45 minutes
            </p>
            <p>
              <UsersIcon /> Interactive Q&A
            </p>
            <p>
              <CalendarIcon /> Monthly Sessions
            </p>
          </div>
        </div>
      </Hero>

      <WhatYouLearn />
      <ReserveYourSpot />
    </div>
  );
};

export default WebinarPage;
