import React from "react";
import {
  AboutTabCard,
  BudgetsTabCard,
  GrantsTabCard,
  PerformanceTabCard,
} from "@app/modules/home-module/sub-modules/partners/components/tabCard";
import {
  DESKTOP_BREAKPOINT,
  FOCUS_VISIBLE_STYLE_LIGHT,
  MOBILE_BREAKPOINT,
} from "@app/theme";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import { StyledTab, StyledTabs } from "./style";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export const Pagination = (props: {
  index: number;
  onChangeIndex: (index: number) => void;
  dots: number;
  bottom: string;
  color: string;
}) => (
  <div
    css={`
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      gap: 8px;
      top: unset;
      left: 0%;
      bottom: ${props.bottom};
      position: absolute;
    `}
  >
    {new Array(props.dots).fill(0).map((_, i) => (
      <button
        key={i}
        aria-label={`Go to slide ${i + 1} of ${props.dots}`}
        aria-current={props.index === i ? "true" : "false"}
        css={`
          padding: 0;
          margin: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          outline: none;
          background: ${props.index === i ? props.color : "#fff"};
          cursor: pointer;
          /* Tooltip */
          box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.6);
          :focus-visible {
            ${FOCUS_VISIBLE_STYLE_LIGHT}
          }
        `}
        onClick={() => props.onChangeIndex(i)}
      />
    ))}
  </div>
);
export default function PartnerCarousel() {
  const tabRef = React.useRef<HTMLDivElement>(null);

  const [displayTab, setDisplayTab] = React.useState<number>(0);
  const handleChange = (
    event: React.ChangeEvent<{}> | null,
    newValue: number
  ) => {
    setDisplayTab(newValue);
  };

  const [autoPlay, setAutoPlay] = React.useState<boolean>(false);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight")
      handleChange(null, (displayTab + 1) % cards.length);
    if (e.key === "ArrowLeft")
      handleChange(null, (displayTab - 1 + cards.length) % cards.length);
  };
  const cards = [
    <AboutTabCard />,
    <GrantsTabCard />,
    <BudgetsTabCard />,
    <PerformanceTabCard />,
  ];

  const scrollTab = (direction: "left" | "right") => {
    if (tabRef.current) {
      const scrollAmount = 200; // Adjust this value as needed
      const scrollLeft = tabRef.current.scrollLeft;
      if (direction === "left") {
        tabRef.current.scrollTo({
          left: scrollLeft - scrollAmount,
          behavior: "smooth",
        });
        setDisplayTab((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (direction === "right") {
        tabRef.current.scrollTo({
          left: scrollLeft + scrollAmount,
          behavior: "smooth",
        });
        setDisplayTab((prev) => (prev < cards.length - 1 ? prev + 1 : prev));
      }
    }
  };
  return (
    <>
      <div
        // onMouseEnter={() => setAutoPlay(false)}
        // onMouseLeave={() => setAutoPlay(true)}
        css={`
          width: 100%;
          position: relative;
          @media (max-width: 1129px) {
            width: 100%;
            height: 100%;
          }
          @media (max-width: ${MOBILE_BREAKPOINT}) {
            width: 100%;
            height: 100%;
          }
        `}
      >
        <div
          ref={tabRef}
          css={`
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            @media (max-width: ${MOBILE_BREAKPOINT}) {
              overflow: auto;
              width: 70%;
              margin: 0 auto;
            }
          `}
        >
          <div
            css={`
              position: absolute;
              top: 0;
              left: 0;
              display: none;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              @media (max-width: ${MOBILE_BREAKPOINT}) {
                display: flex;
              }
              button {
                border-radius: 16px;
                width: 48px;
                height: 48px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #6061e5;
                color: #fff;
                border: none;
                cursor: pointer;
              }
            `}
          >
            <button onClick={() => scrollTab("left")} aria-label="Scroll left">
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              onClick={() => scrollTab("right")}
              aria-label="Scroll right"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
          <StyledTabs
            onKeyDown={handleKeyDown}
            role="tablist"
            TabIndicatorProps={{
              style: {
                bottom: "0px",
                height: "2px",
              },
            }}
            value={displayTab}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            className="Home-MuiTabs-flexContainer"
            data-cy="partners-tabs"
            css={`
              @media (max-width: ${MOBILE_BREAKPOINT}) {
                margin-left: 298px;
              }
            `}
          >
            <StyledTab
              // disableTouchRipple
              focusRipple
              label="About"
              value={0}
              data-cy="about-tab"
              aria-controls={`tabpanel-${displayTab}`}
              id={`tab-${displayTab}`}
              role="tab"
            />
            <StyledTab
              // disableTouchRipple
              focusRipple
              label="Grants"
              value={1}
              data-cy="grants-tab"
              aria-controls={`tabpanel-${displayTab}`}
              id={`tab-${displayTab}`}
              role="tab"
            />
            <StyledTab
              // disableTouchRipple
              focusRipple
              label="Budgets"
              value={2}
              data-cy="budgets-tab"
              aria-controls={`tabpanel-${displayTab}`}
              id={`tab-${displayTab}`}
              role="tab"
            />
            <StyledTab
              focusRipple
              // disableTouchRipple
              label="Performance"
              value={3}
              data-cy="performance-tab"
              aria-controls={`tabpanel-${displayTab}`}
              id={`tab-${displayTab}`}
              role="tab"
            />
          </StyledTabs>
        </div>
        <div
          css={`
            height: 40px;
            @media (max-width: 1024px) {
              height: 32px;
            }
          `}
        />
        <div
          css={`
            position: relative;
            background: #6061e5;
            border-radius: 30px;
            padding: 40px;
            @media (max-width: ${DESKTOP_BREAKPOINT}) {
              padding: 20px;
            }
          `}
        >
          <AutoPlaySwipeableViews
            index={displayTab}
            onChangeIndex={(index) => autoPlay && handleChange(null, index)}
            animateTransitions={true}
            interval={3000}
            autoplay={autoPlay}
          >
            {cards.map((card, index) => (
              <div
                css={`
                  height: 100%;
                `}
                key={index}
                data-cy="partners-view"
                role="tabpanel"
                id={`tabpanel-${index}`}
                aria-labelledby={`tab-${index}`}
                hidden={displayTab !== index}
              >
                {card}
              </div>
            ))}
          </AutoPlaySwipeableViews>
          <div
            css={`
              height: 30px;
            `}
          />
          <Pagination
            dots={4}
            index={displayTab}
            onChangeIndex={(index) => handleChange(null, index)}
            bottom="25px"
            color="#231D2C"
          />
        </div>
      </div>
    </>
  );
}
