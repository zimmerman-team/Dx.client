import React from "react";
import { subParagraphcss } from "./style";
import MissionImg from "@app/modules/home-module/assets/about-mission.svg?react";
import DXImg from "@app/modules/home-module/assets/about-dx.svg?react";
import { Box } from "@material-ui/core";
import { DESKTOP_BREAKPOINT } from "@app/theme";
import { getCMSDataField } from "@app/utils/getCMSDataField";
import { useCMSData } from "@app/hooks/useCMSData";

export default function MissionSection() {
  const cmsData = useCMSData({ returnData: true });
  return (
    <>
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
            <h3 id="ab-desktop">
              {getCMSDataField(cmsData, "pagesAbout.missionTitle", "Mission")}
            </h3>
            <div
              css={`
                height: 24px;
              `}
            />
            <p css={``}>
              {getCMSDataField(
                cmsData,
                "pagesAbout.missionText",
                `Our mission is to create lasting impact for organizations that
              bring positive change to our world by helping them to unlock the
              power of data. Our trusted and easy-to-use data solutions boost an
              organization's performance by powering its core mission.`
              )}
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
          @media (max-width: ${DESKTOP_BREAKPOINT}) {
            > div:nth-of-type(1) {
              display: flex;
              flex-direction: column-reverse;
            }
          }
        `}
      >
        <div>
          <div>
            <h3 id="ab-desktop">
              {getCMSDataField(
                cmsData,
                "pagesAbout.dataxplorerTitle",
                "Dataxplorer"
              )}
            </h3>
            <Box height={24} />
            <p>
              {getCMSDataField(
                cmsData,
                "pagesAbout.dataxplorerText1",
                `Many organizations struggle to convey the data they collect,
              analyze, and share. We specialize in turning data into a strategic
              asset, helping global organizations communicate their impact with
              precision and effectiveness.`
              )}
              <br /> <br />{" "}
              {getCMSDataField(
                cmsData,
                "pagesAbout.dataxplorerText2",
                `To position your organization as a leader in your
              field using the power of data, we offer Dataxplorer, an
              AI-powered, purpose-driven data platform. Dataxplorer equips
              people with insightful data for making informed decisions, driving
              us closer to an equitable future for all.`
              )}
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
    </>
  );
}
