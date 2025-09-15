import { Box } from "@material-ui/core";
import {
  TABLET_STARTPOINT,
  DESKTOP_BREAKPOINT,
  MOBILE_BREAKPOINT,
  FOCUS_VISIBLE_STYLE_DARK,
} from "app/theme";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import { ctaLinkStyle } from "app/modules/home-module/sub-modules/partners";
import { team } from "./data";
import EmptyAvi from "app/modules/home-module/assets/team/empty.png";
import { Link } from "react-router-dom";
import { ReactComponent as BackArrow } from "app/modules/home-module/assets/back-arrow.svg";

export default function TeamSection() {
  const [selectedItem, setSelectedItem] = React.useState(0);

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
        alt={"Potential Team Member"}
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
    <div>
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
      {/* Mobile display of the team using a carousel */}
      <div
        css={`
          @media (min-width: ${TABLET_STARTPOINT}) {
            display: none;
          }
          width: 55%;
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
          ariaLabel="Team members carousel"
        >
          {allTeamCarousel}
        </Carousel>
        <button
          css={`
            all: unset;
          `}
          aria-label="Previous Slide"
        >
          <BackArrow
            css={`
              position: absolute;
              left: -100px;
              top: 35%;
            `}
            onClick={() => setSelectedItem(0)}
          />
        </button>
      </div>
      <div
        css={`
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          column-gap: 48px;
          row-gap: 64px;
          @media (min-width: 880px) {
            @media (max-width: ${DESKTOP_BREAKPOINT}) {
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
          @media (max-width: ${MOBILE_BREAKPOINT}) {
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
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
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
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
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
            <a
              href="/contact"
              css={`
                ${ctaLinkStyle("contact")}
                margin-top: 32px;
                font-size: 16px;
                width: 100%;
                background: #231d2c;
                &:focus-visible {
                  ${FOCUS_VISIBLE_STYLE_DARK}
                }
              `}
            >
              Join Our Team
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
