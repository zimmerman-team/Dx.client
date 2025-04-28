import React from "react";

import { Box, Container } from "@material-ui/core";
import { ReactComponent as MissionImg } from "app/modules/home-module/assets/about-mission.svg";
import { ReactComponent as DXImg } from "app/modules/home-module/assets/about-dx.svg";
import { ReactComponent as StoryImg } from "app/modules/home-module/assets/about-story.svg";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import HomeFooter from "app/modules/home-module/components/Footer";
import { subParagraphcss } from "./style";
import { useTitle } from "react-use";
import { PrimaryButton } from "app/components/Styled/button";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { socialAuth } from "app/utils/socialAuth";
import { ReactComponent as GoogleIcon } from "app/modules/onboarding-module/asset/google-img.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/onboarding-module/asset/linkedIn-img.svg";
import { ReactComponent as MicrosoftIcon } from "app/modules/onboarding-module/asset/microsoft-img.svg";
import HeroEllipses from "app/modules/home-module/assets/hero-ellipses.png";
import HeroEllipsesTablet from "app/modules/home-module/assets/hero-ellipses-tablet.svg";
import HeroEllipsesMobile from "app/modules/home-module/assets/hero-ellipses-mobile.svg";
import { ReactComponent as BackArrow } from "app/modules/home-module/assets/back-arrow.svg";
import SiemAvi from "app/modules/home-module/assets/team/siem.png";
import JohnAvi from "app/modules/home-module/assets/team/john.png";
import KennyAvi from "app/modules/home-module/assets/team/kenny.png";
import AylinAvi from "app/modules/home-module/assets/team/aylin.png";
import SylvanAvi from "app/modules/home-module/assets/team/sylvan.png";
import VeronikaAvi from "app/modules/home-module/assets/team/veronika.png";
import StefanosAvi from "app/modules/home-module/assets/team/stefanos.png";
import EmmanuellaAvi from "app/modules/home-module/assets/team/emmanuella.png";
import SamuelAvi from "app/modules/home-module/assets/team/samuel.png";
import AnsonAvi from "app/modules/home-module/assets/team/anson.png";
import EmptyAvi from "app/modules/home-module/assets/team/empty.png";
import AddAssetDropdown from "app/modules/home-module/components/AddAssetDropdown";

export default function AboutModule() {
  useTitle("Dataxplorer - About");
  const { isAuthenticated } = useAuth0();

  const [selectedItem, setSelectedItem] = React.useState(0);
  const features = [
    {
      title: "+100.000",
      subtitle: "Datasets available",
      text: "Access over 100.000 datasets to create stories and charts. Create impact with data from 3rd parties built in Dataxplorer or connect your in-house datasources.",
    },
    {
      title: "+15 Visuals",
      subtitle: "Chart type provided",
      text: "Dataxplorer offers over 15 different chart types for you to work with. Based on the open sources Apache E-charts library you are able to create rich graphs.",
    },
    {
      title: "+3",
      subtitle: "Languages are supported",
      text: "Dataxplorer caters to a global clientele, ensuring seamless data integration and communication. We will offer Dataxplorer in 3 different languages.",
    },
  ];

  const uiUx = "UI/UX Design Intern";

  const team = [
    {
      img: SiemAvi,
      name: "Siem Vaessen",
      role: "Managing Director",
      linkedIn: "https://nl.linkedin.com/in/siemvaessen",
    },
    {
      img: JohnAvi,
      name: "John Busch",
      role: "Digital Communications Specialist",
      linkedIn: "https://ch.linkedin.com/in/johnbusch74",
    },
    {
      img: StefanosAvi,
      name: "Stefanos Hadjipetrou",
      role: "Software Developer",
      linkedIn: "https://cy.linkedin.com/in/hadjipetroustefanos",
    },
    {
      img: SylvanAvi,
      name: "Sylvan Ridderinkhof",
      role: "Data Engineer",
      linkedIn: "https://nl.linkedin.com/in/sylvan-ridderinkhof-86a020107",
    },
    {
      img: KennyAvi,
      name: "Kennet Z. Porter",
      role: "UI/UX & Data Visualisation Designer",
      linkedIn: "https://es.linkedin.com/in/kennet-z-porter/en",
    },
    {
      img: AylinAvi,
      name: "Aylin Paçaci",
      role: uiUx,
      linkedIn: "https://tr.linkedin.com/in/aylinpacaci",
    },
    {
      img: EmmanuellaAvi,
      name: "Emmanuella Okorie",
      role: "Frontend Developer",
      linkedIn: "https://ng.linkedin.com/in/okorie-emmanuella-350916173",
    },
    {
      img: SamuelAvi,
      name: "Okechukwu Samuel \n Owhondah",
      role: "Frontend Developer",
      linkedIn: "https://ng.linkedin.com/in/okorie-emmanuella-350916173",
    },
    {
      img: VeronikaAvi,
      name: "Veronika Ivanova",
      role: uiUx,
      linkedIn: "https://nl.linkedin.com/in/veronika-ivanova-448b6b1b6",
    },
    {
      img: AnsonAvi,
      name: "Shiyi Anson Chen",
      role: uiUx,
      linkedIn: "",
    },
  ];

  const teamCarousel = team.map((member) => (
    <div key={member.name}>
      <img
        src={member.img}
        alt={member.name}
        css={`
          width: 270.25px;
          height: 307.25px;
          border-radius: 20px;
        `}
      />
      <p
        css={`
          margin: 0;
          margin-top: 32px;
          font-size: 24px;
          font-family: "GothamNarrow-Bold";
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          color: #504e4e;
          white-space: pre-line;
          @media (max-width: 500px) {
            font-size: 20px;
            margin-top: 16px;
          }
        `}
      >
        {member.name}
      </p>
      <p
        css={`
          margin: 0;
          font-size: 16px;
          font-style: normal;
          font-weight: 325;
          line-height: normal;
          font-family: "GothamNarrow-Book";
          color: #231d2c;
        `}
      >
        {member.role}
      </p>
    </div>
  ));
  const futureTeam = Array.from({ length: 1 }).map((_, index) => (
    <div key={index}>
      <img
        src={EmptyAvi}
        alt={"Empty"}
        css={`
          width: 270.25px;
          height: 307.25px;
          border-radius: 20px;
        `}
      />
      <Link
        to={"/contact"}
        css={`
          margin-top: 32px;
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          font-size: 20px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          text-transform: uppercase;
          border-radius: 30px;
          background: #231d2c;
          box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
          width: max-content;
          margin: 32px auto 0 auto;
          display: block;
          color: #fff;
          padding: 12px 27px;
          border: none;
          text-decoration: none;
          @media (max-width: 500px) {
            font-size: 16px;
            padding: 12px 24px;
          }
        `}
      >
        Join Our Team
      </Link>
    </div>
  ));
  const allTeamCarousel = [...teamCarousel, ...futureTeam];

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
      <section
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
                @media (min-width: 600px) {
                  display: none;
                }
              `}
            >
              Our Story
            </h1>
            <div
              css={`
                display: flex;
                justify-content: space-between;
                align-items: center;
                @media (max-width: 600px) {
                  flex-direction: column-reverse;
                }
              `}
            >
              <div
                css={`
                  width: 518px;
                  @media (max-width: 1200px) {
                    width: 62%;
                  }
                  @media (max-width: 805px) {
                    width: 100%;
                  }
                  @media (max-width: 500px) {
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
                    @media (max-width: 600px) {
                      display: none;
                    }
                  `}
                >
                  Our Story
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
                  With 20+ years combined experience in data and global health
                  development, we empower organisations with innovative data
                  solutions to enhance their communication. Our decade-long
                  commitment drives us to advance data communication
                  continually.
                  <br />
                  <br />
                  Discover the true potential of your data with Dataxplorer. Let
                  us help you harness its power!
                </p>
              </div>

              <div
                css={`
                  margin-right: -41px;
                  @media (max-width: 1200px) {
                    margin-right: unset;
                    svg {
                      width: 100%;
                      height: 100%;
                    }
                  }
                  @media (max-width: 500px) {
                    margin-top: 0;
                  }
                `}
              >
                <StoryImg />
              </div>
            </div>
            <div
              css={`
                margin-top: 24px;
                @media (max-width: 500px) {
                  margin-top: 24px;
                }
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
                    @media (max-width: 425px) {
                      flex-direction: column;
                      gap: 10px;
                      justify-content: center;
                      align-items: center;
                    }
                  `}
                >
                  <AddAssetDropdown />

                  <Link to="/" data-cy="empower-block-explore-stories-link">
                    <PrimaryButton
                      size="big"
                      bg="light"
                      type="button"
                      css={`
                        height: 48px;
                      `}
                    >
                      Explore the Dashboard
                    </PrimaryButton>
                  </Link>
                </div>
              )}
              {!isAuthenticated && (
                <div
                  css={`
                    display: flex;
                    gap: 16px;
                    > button {
                      gap: 8px;
                      color: #231d2c;
                      display: flex;
                      padding: 9px 17px !important;
                      height: 48px;
                      border-radius: 12px;
                      outline: none;
                      border: none;
                      background: #a1a2ff;
                      align-items: center;
                      justify-content: center;
                      font-family: "GothamNarrow-Bold", "Helvetica Neue",
                        sans-serif;
                      white-space: nowrap;
                      font-size: 16px;
                      > svg {
                        transform: scale(0.8);
                      }
                      :hover {
                        opacity: 0.8;
                        cursor: pointer;
                      }
                    }
                    @media (max-width: 500px) {
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      gap: 8px;

                      button {
                        width: 95%;
                      }
                    }
                  `}
                >
                  <button onClick={() => socialAuth("google-oauth2")}>
                    <GoogleIcon /> Google
                  </button>
                  <button onClick={() => socialAuth("linkedin")}>
                    <LinkedInIcon /> LinkedIn
                  </button>
                  <button onClick={() => socialAuth("windowslive")}>
                    <MicrosoftIcon /> Microsoft
                  </button>
                </div>
              )}
            </div>
          </Container>
        </div>

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
                column-gap: 180px;
                justify-content: center;
                @media (max-width: 1110px) {
                  column-gap: 56px;
                }
                @media (max-width: 600px) {
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

                      @media (max-width: 600px) {
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

                      @media (max-width: 960px) {
                        font-size: 18px;
                      }
                      @media (max-width: 600px) {
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
                      @media (max-width: 960px) {
                        font-size: 14px;
                      }
                      @media (max-width: 600px) {
                        font-size: 16px;
                      }
                    `}
                  >
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </div>
        <Box
          height={{
            xs: 32,
            md: 40,
            lg: 80,
          }}
        />

        <Container maxWidth="lg">
          <h2
            css={`
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              font-size: 36px;
              font-style: normal;
              font-weight: 400;
              line-height: 130%;
              margin: 0;
              text-align: center;
              color: #231d2c;
              @media (max-width: 600px) {
                font-size: 24px;
              }
            `}
          >
            Meet Our Team
          </h2>
          <p
            css={`
              text-align: center;
              font-size: 18px;
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              font-style: normal;
              font-weight: 325;
              line-height: normal;
              margin: 0;
              margin-top: 11px;
              color: #231d2c;
              @media (max-width: 960px) {
                font-size: 24px;
              }
              @media (max-width: 600px) {
                font-size: 18px;
              }
            `}
          >
            Zimmerman B.V. is a data information technology company based in
            Amsterdam that specialises
            <br /> in making data meaningful through visualisation tooling and
            dashboards.
          </p>
          <Box
            height={{
              xs: 56,
              md: 40,
              lg: 75,
            }}
          />
          <div
            css={`
              @media (min-width: 501px) {
                display: none;
              }
              width: 55%;
              height: 325px;
              margin: auto;
              img {
                width: 100%;
                height: 50%;

                object-fit: cover;
              }
              position: relative;
            `}
          >
            <Carousel
              autoPlay
              infiniteLoop
              swipeable
              stopOnHover
              showStatus={false}
              showThumbs={false}
              showArrows={false}
              showIndicators={false}
              selectedItem={selectedItem}
              onChange={(index) => setSelectedItem(index)}
            >
              {allTeamCarousel}
            </Carousel>
            <BackArrow
              css={`
                position: absolute;
                left: -100px;
                top: 35%;
              `}
              onClick={() => setSelectedItem(0)}
            />
          </div>
          <div
            css={`
              display: grid;
              grid-template-columns: repeat(4, minmax(0, 1fr));
              column-gap: 48px;
              row-gap: 64px;
              @media (min-width: 880px) {
                @media (max-width: 1314px) {
                  row-gap: 56px;
                  grid-template-columns: repeat(3, minmax(0, 1fr));
                  justify-items: center;
                }
              }
              @media (max-width: 879px) {
                grid-template-columns: repeat(3, minmax(0, 1fr));
                justify-items: center;
                img {
                  width: 100%;
                  height: 70%;
                  object-fit: cover;
                }
              }
              @media (max-width: 830px) {
                grid-template-columns: repeat(3, minmax(0, 1fr));
                row-gap: 46px;
                justify-items: center;
                column-gap: 35px;
                img {
                  width: 100%;
                  height: 70%;
                  object-fit: cover;
                }
              }
              @media (max-width: 500px) {
                display: none;
              }
            `}
          >
            {team.map((member) => (
              <div key={member.name}>
                <img
                  src={member.img}
                  alt={member.name}
                  css={`
                    width: 270.25px;
                    height: 307.25px;
                    border-radius: 20px;
                  `}
                />
                <p
                  css={`
                    margin: 0;
                    margin-top: 32px;
                    font-size: 24px;
                    font-family: "GothamNarrow-Bold", "Helvetica Neue",
                      sans-serif;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    color: #504e4e;
                    white-space: pre-line;
                    @media (max-width: 960px) {
                      font-size: 18px;
                      margin-top: 24px;
                    }
                  `}
                >
                  {member.name}
                </p>
                <p
                  css={`
                    margin: 0;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 325;
                    line-height: normal;
                    font-family: "GothamNarrow-Book", "Helvetica Neue",
                      sans-serif;
                    color: #231d2c;
                    @media (max-width: 960px) {
                      font-size: 12px;
                    }
                  `}
                >
                  {member.role}
                </p>
              </div>
            ))}
            {Array.from({ length: 1 }).map((_, index) => (
              <div key={index}>
                <img
                  src={EmptyAvi}
                  alt={"Empty"}
                  css={`
                    width: 270.25px;
                    height: 307.25px;
                    border-radius: 20px;
                  `}
                />
                <a href="/contact">
                  <PrimaryButton
                    size="big"
                    bg="dark"
                    type="button"
                    css={`
                      height: 48px;
                      margin-top: 32px;
                      font-size: 16px;
                      width: 100%;
                    `}
                  >
                    Join Our Team
                  </PrimaryButton>
                </a>
              </div>
            ))}
          </div>
          <div
            css={`
              height: 120px;
              @media (max-width: 960px) {
                height: 72px;
              }
            `}
          />
          <div css={subParagraphcss}>
            <div>
              <div css={``}>
                <MissionImg
                  css={`
                    border-radius: 16px;
                    background: #fbfbfb;
                    box-shadow: 0px 14.97px 22.455px 0px rgba(0, 0, 0, 0.05),
                      0px 4.491px 7.485px 0px rgba(0, 0, 0, 0.05),
                      0px 0.749px 7.485px 0px rgba(0, 0, 0, 0.05);
                  `}
                />
              </div>
              <div>
                <h3 id="ab-desktop">Mission</h3>
                <div
                  css={`
                    height: 24px;
                  `}
                />
                <p css={``}>
                  Our mission is to create lasting impact for organizations that
                  bring positive change to our world by helping them to unlock
                  the power of data. Our trusted and easy-to-use data solutions
                  boost an organization's performance by powering its core
                  mission.
                </p>
              </div>
            </div>
          </div>
          <div
            css={`
              height: 120px;
              @media (max-width: 960px) {
                height: 72px;
              }
            `}
          />
          <div
            css={`
              ${subParagraphcss};
              @media (max-width: 1024px) {
                > div:nth-of-type(1) {
                  display: flex;
                  flex-direction: column-reverse;
                }
              }
            `}
          >
            <div>
              <div>
                <h3 id="ab-desktop">Dataxplorer</h3>
                <Box height={24} />
                <p>
                  Many organizations struggle to convey the data they collect,
                  analyze, and share. We specialize in turning data into a
                  strategic asset, helping global organizations communicate
                  their impact with precision and effectiveness.
                  <br /> <br /> To position your organization as a leader in
                  your field using the power of data, we offer Dataxplorer, an
                  AI-powered, purpose-driven data platform. Dataxplorer equips
                  people with insightful data for making informed decisions,
                  driving us closer to an equitable future for all.
                </p>
              </div>

              <div>
                <DXImg
                  css={`
                    border-radius: 16px;
                    background: #fbfbfb;
                    box-shadow: 0px 4.035px 6.724px 0px rgba(0, 0, 0, 0.05),
                      0px 13.449px 20.173px 0px rgba(0, 0, 0, 0.05),
                      0px 0.672px 6.724px 0px rgba(0, 0, 0, 0.05);
                  `}
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
      <HomeFooter />
    </div>
  );
}
