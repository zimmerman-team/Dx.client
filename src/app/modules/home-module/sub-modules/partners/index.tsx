import React from "react";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import Container from "@material-ui/core/Container";
import withStyles from "@material-ui/core/styles/withStyles";
import HomeFooter from "app/modules/home-module/components/Footer";
import DXBlock from "app/modules/home-module/sub-modules/partners/components/useDXBlock";
import QuoteBlock from "app/modules/home-module/sub-modules/partners/components/quoteBlock";
import OurPartnersBlock from "app/modules/home-module/sub-modules/partners/components/ourPartnersBlock";
import {
  AboutTabCard,
  BudgetsTabCard,
  GrantsTabCard,
  PerformanceTabCard,
} from "app/modules/home-module/sub-modules/partners/components/tabCard";
import { useTitle } from "react-use";
import Hero from "app/modules/home-module/components/hero";
import { useAuth0 } from "@auth0/auth0-react";
import { Box } from "@material-ui/core";
import { PrimaryButton } from "app/components/Styled/button";
import { Link } from "react-router-dom";
import SignInButtons from "app/modules/home-module/components/SignInButtons";
import InlineLogo from "app/modules/home-module/assets/inline-logo";
import TryUsBlock from "app/modules/home-module/components/TryUsBlock";
import { DESKTOP_BREAKPOINT, MOBILE_BREAKPOINT } from "app/theme";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";

const StyledTab = withStyles(() => ({
  root: {
    "&.MuiButtonBase-root": {
      "&.MuiTab-root": {
        width: "fit-content",
        minWidth: "fit-content",
        padding: "0px ",
        textTransform: "none",
      },
    },

    "&.MuiTab-textColorPrimary": {
      "& .MuiTab-wrapper": {
        width: "200px",
        fontSize: "18px",
        fontWeight: 325,
        color: "#231D2C !important",
        fontFamily: `"GothamNarrow-Book", "Helvetica Neue", sans-serif`,
        [`@media (max-width: ${DESKTOP_BREAKPOINT})`]: {
          width: "155px",
        },
      },
      "&.Mui-selected": {
        "& .MuiTab-wrapper": {
          fontSize: "18px",
          fontWeight: 400,
          color: "#161616 !important",
          fontFamily: `"GothamNarrow-Bold", "Helvetica Neue", sans-serif`,
        },
      },
    },
  },
}))(Tab);

const StyledTabs = withStyles({
  root: {
    "& .MuiTabs-scroller": {
      "& .MuiTabs-flexContainer": {
        gap: "20px",
        [`@media (max-width: ${DESKTOP_BREAKPOINT})`]: {
          gap: "10px",
        },
      },
    },
  },
})(Tabs);

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const Pagination = (props: {
  index: number;
  onChangeIndex: (index: number) => void;
  dots: number;
}) => (
  <div
    css={`
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      gap: 8px;
      @media (max-width: 1129px) {
        top: unset;
        bottom: 3%;
      }
    `}
  >
    {new Array(props.dots).fill(0).map((_, i) => (
      <div
        key={i}
        css={`
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${props.index === i ? "#231D2C" : "#fff"};
          cursor: pointer;

          /* Tooltip */
          box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.6);
        `}
        onClick={() => props.onChangeIndex(i)}
      />
    ))}
  </div>
);
export default function PartnersModule() {
  useTitle("Dataxplorer - Partners");

  const { isAuthenticated } = useAuth0();

  const tabRef = React.useRef<HTMLDivElement>(null);

  const [displayTab, setDisplayTab] = React.useState<number>(0);
  const handleChange = (
    event: React.ChangeEvent<{}> | null,
    newValue: number
  ) => {
    setDisplayTab(newValue);
  };

  const [autoPlay, setAutoPlay] = React.useState<boolean>(false);

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
        css={`
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          margin-top: 50px;
          min-height: calc(100vh - 50px);
          background: #ffffff;
        `}
      >
        <div>
          <Hero title="Our Partners">
            {isAuthenticated ? (
              <div>
                <p>
                  Collaboration is at the heart of everything we do — meet the
                  partners driving change with us.
                </p>
                <Box height={"40px"} />
                <Box
                  display={"flex"}
                  gridColumnGap={{ xs: "8px", sm: "24px" }}
                  gridRowGap={"8px"}
                  justifyContent={"center"}
                  flexDirection={"row"}
                  alignItems={"center"}
                >
                  <Link
                    to="/"
                    data-cy="empower-block-explore-stories-link"
                    css={`
                      text-decoration: none;
                    `}
                  >
                    <PrimaryButton
                      css={`
                        height: 48px;
                        @media (max-width: ${MOBILE_BREAKPOINT}) {
                          width: 175px;
                          height: 35px;
                          padding: 12px 12px;
                        }
                      `}
                      size="big"
                      bg="light"
                      type="button"
                    >
                      Go to the Dashboard
                    </PrimaryButton>
                  </Link>
                  <Link
                    to="/contact"
                    css={`
                      text-decoration: none;
                    `}
                  >
                    <PrimaryButton
                      css={`
                        height: 48px;
                        @media (max-width: ${MOBILE_BREAKPOINT}) {
                          width: 106px;
                          height: 35px;
                          padding: 12px 12px;
                        }
                      `}
                      size="big"
                      bg="light"
                      type="button"
                    >
                      Contact Us
                    </PrimaryButton>
                  </Link>
                </Box>
              </div>
            ) : (
              <div>
                <p>
                  Collaboration is at the heart of everything we do — meet the
                  partners driving change with us.
                  <br />
                  Sign in to get the most out of <InlineLogo /> and keep things
                  connected.
                </p>
                <Box height={"40px"} />
                <SignInButtons />
              </div>
            )}
          </Hero>
          <OurPartnersBlock />

          <Container
            maxWidth="lg"
            css={`
              padding: 80px 24px;
              @media (max-width: ${DESKTOP_BREAKPOINT}) {
                padding: 60px 32px !important;
              }

              @media (max-width: ${MOBILE_BREAKPOINT}) {
                padding: 50px 24px !important;
              }
            `}
          >
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              direction="column"
              css={`
                width: 100%;
                gap: 40px;
              `}
            >
              <DXBlock />

              <div
                onMouseEnter={() => setAutoPlay(false)}
                onMouseLeave={() => setAutoPlay(true)}
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
                    <button onClick={() => scrollTab("left")}>
                      <ChevronLeft />
                    </button>
                    <button onClick={() => scrollTab("right")}>
                      <ChevronRight />
                    </button>
                  </div>
                  <StyledTabs
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
                      disableTouchRipple
                      label="About"
                      value={0}
                      data-cy="about-tab"
                    />
                    <StyledTab
                      disableTouchRipple
                      label="Grants"
                      value={1}
                      data-cy="grants-tab"
                    />
                    <StyledTab
                      disableTouchRipple
                      label="Budgets"
                      value={2}
                      data-cy="budgets-tab"
                    />
                    <StyledTab
                      disableTouchRipple
                      label="Performance"
                      value={3}
                      data-cy="performance-tab"
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
                    onChangeIndex={(index) =>
                      autoPlay && handleChange(null, index)
                    }
                    animateTransitions={true}
                    interval={3000}
                  >
                    {cards.map((card, index) => (
                      <div
                        css={`
                          height: 100%;
                        `}
                        key={index}
                        data-cy="partners-view"
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
                  />
                </div>
              </div>

              <QuoteBlock />
            </Grid>
          </Container>
          <div
            css={`
              background: #f2f7fd;
            `}
          >
            {" "}
            <Container
              maxWidth="lg"
              css={`
                padding: 80px 24px;
                @media (max-width: ${DESKTOP_BREAKPOINT}) {
                  padding: 60px 32px !important;
                }

                @media (max-width: ${MOBILE_BREAKPOINT}) {
                  padding: 50px 24px !important;
                }
              `}
            >
              <TryUsBlock
                title="Give Dataxplorer a try, on us"
                subtitle="Dataxplorer turns data into impact in minutes"
                signInWith
              />
            </Container>
          </div>
        </div>
        <HomeFooter />
      </div>
    </>
  );
}
