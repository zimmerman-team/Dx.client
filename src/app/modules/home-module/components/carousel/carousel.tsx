import React from "react";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import CardA from "app/modules/home-module/assets/dashboard-card-a.png";
import CardB from "app/modules/home-module/assets/dashboard-card-b.png";
import CardC from "app/modules/home-module/assets/dashboard-card-c.png";
import CardD from "app/modules/home-module/assets/dashboard-card-d.png";

import { DESKTOP_BREAKPOINT, MOBILE_BREAKPOINT } from "app/theme";
import { Pagination } from "app/modules/home-module/sub-modules/partners";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
export default function DashboardCarousel() {
  const cards = [CardA, CardB, CardC, CardD];
  const [displayTab, setDisplayTab] = React.useState<number>(0);
  const handleChange = (
    event: React.ChangeEvent<{}> | null,
    newValue: number
  ) => {
    setDisplayTab(newValue);
  };

  const [autoPlay, setAutoPlay] = React.useState<boolean>(false);
  return (
    <div
      css={`
        width: 100%;
        position: relative;
        @media (max-width: ${DESKTOP_BREAKPOINT}) {
          justify-content: center;
        }
      `}
    >
      <AutoPlaySwipeableViews
        index={displayTab}
        onChangeIndex={(index) => autoPlay && handleChange(null, index)}
        animateTransitions={true}
        interval={5000}
        style={{
          height: "100%",
        }}
      >
        {cards.map((card, index) => (
          <div
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
            css={`
              height: 100%;
              width: 100%;
              display: flex;
              justify-content: flex-end;
              img {
                width: 525px;
                height: 335px;
                object-fit: cover;
              }
              @media (max-width: ${DESKTOP_BREAKPOINT}) {
                justify-content: center;
              }
              @media (max-width: ${MOBILE_BREAKPOINT}) {
                img {
                  width: 328px;
                  height: 209.295px;
                }
              }
            `}
            key={index}
          >
            <img src={card} alt="DX-preview" />
          </div>
        ))}
      </AutoPlaySwipeableViews>
      <Pagination
        dots={4}
        index={displayTab}
        onChangeIndex={(index) => handleChange(null, index)}
        bottom="-15px"
        color="#6061E5"
      />
    </div>
  );
}
