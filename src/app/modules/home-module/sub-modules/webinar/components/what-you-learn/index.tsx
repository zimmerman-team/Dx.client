import React from "react";
import { Container } from "@material-ui/core";
import { DESKTOP_BREAKPOINT, MOBILE_BREAKPOINT } from "app/theme";
import FlagIcon from "app/modules/home-module/sub-modules/webinar/assets/FlagIcon";
import CheckIcon from "app/modules/home-module/sub-modules/webinar/assets/CheckIcon";
import { CalendarIcon2 } from "app/modules/home-module/sub-modules/webinar/assets/CalendarIcon";

const WhatYouLearn = () => {
  const features = [
    {
      icon: FlagIcon,
      title: "Platform Features",
      description:
        "Discover the DataXplorer tools and capabilities to enhance your workflow",
    },
    {
      icon: CheckIcon,
      title: "Best Practices",
      description: "Learn proven strategies and tips from our product experts",
    },
    {
      icon: CalendarIcon2,
      title: "Roadmap Preview",
      description:
        "Get exclusive insights into what's coming next and how it will benefit you",
    },
  ];
  return (
    <div
      css={`
        background-color: #ffffff;
      `}
    >
      <Container
        maxWidth="lg"
        css={`
          @media (max-width: ${DESKTOP_BREAKPOINT}) {
            padding: 0 32px !important;
          }

          @media (max-width: ${MOBILE_BREAKPOINT}) {
            padding: 0 16px !important;
          }
        `}
      >
        <div
          css={`
            padding: 60px 0;
            h2 {
              font-family: "GothamNarrow-Bold", sans-serif;
              font-size: 64px;
              line-height: normal;
              text-align: center;
              margin: 0;
              padding: 0;
              @media (max-width: ${DESKTOP_BREAKPOINT}) {
                font-size: 48px;
              }
              @media (max-width: ${MOBILE_BREAKPOINT}) {
                font-size: 34px;
              }
            }
            h4 {
              font-family: "GothamNarrow-Book", sans-serif;
              font-weight: 325;
              font-size: 18px;
              line-height: 24px;
              text-align: center;
              margin-top: 10px;
              margin-bottom: 0;
              padding: 0;
            }
          `}
        >
          <h2>What You'll Learn</h2>
          <h4>
            Each session covers the latest updates and gives you the tools
            <br /> to maximize your platform experience.
          </h4>

          <div
            css={`
              margin-top: 30px;
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 20px;

              @media (max-width: ${DESKTOP_BREAKPOINT}) {
                grid-template-columns: 1fr;
                gap: 30px;
              }
            `}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                css={`
                  display: flex;
                  align-items: center;
                  flex-direction: column;
                  border-radius: 20px;
                  border: 0.5px solid #6061e5;
                  background: #f2f7fd;
                  gap: 20px;
                  padding: 20px;
                `}
              >
                <div
                  css={`
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    background: #6061e5;
                  `}
                >
                  <feature.icon />
                </div>

                <h5
                  css={`
                    font-family: "GothamNarrow-Bold", sans-serif;
                    font-size: 18px;
                    margin: 0;
                    padding: 0;
                    line-height: 24px;
                  `}
                >
                  {feature.title}
                </h5>
                <p
                  css={`
                    font-family: "GothamNarrow-Book", sans-serif;
                    font-weight: 325;
                    font-size: 18px;
                    margin: 0;
                    padding: 0;
                    line-height: 24px;
                  `}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default WhatYouLearn;
