import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as LogoIcon } from "app/modules/home-module/components/Footer/asset/logo.svg";
import { ReactComponent as CopyIcon } from "app/modules/home-module/components/Footer/asset/copy.svg";
import moment from "moment";
import {
  PRIVACY_POLICY_LINK,
  TERMS_AND_CONDITION_LINK,
} from "app/modules/chart-module/util/constants/links";

export default function MobileFooter() {
  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: white;
        padding: 16px;
      `}
    >
      <Link to="/">
        <LogoIcon />
      </Link>
      <div
        css={`
          border-top: 1px solid #d9d9d9;
          width: 100%;
          margin: 14px 0;
        `}
      />

      <div
        css={`
          height: 39px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          a {
            text-decoration: none;
            color: #000;
            font-size: 12px;
            font-family: "GothamNarrow-Book", sans-serif;
          }
          p:nth-of-type(1) {
            display: flex;
            align-items: center;
            gap: 20px;
            margin: 0;
          }
          p:nth-of-type(2) {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0;
          }
        `}
      >
        <p>
          <a
            href={PRIVACY_POLICY_LINK}
            className="privacy-link"
            target="_blank"
            rel="noreferrer"
          >
            Privacy
          </a>{" "}
          <a
            href={TERMS_AND_CONDITION_LINK}
            className="privacy-link"
            target="_blank"
            rel="noreferrer"
          >
            Terms and conditions
          </a>{" "}
        </p>
        <p
          css={`
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0;
            padding: 0;
            font-size: 12px;
          `}
        >
          <CopyIcon />
          {moment(new Date()).format("YYYY")} Dataxplorer All Rights Reserved
        </p>
      </div>
    </div>
  );
}
