/** third party */
import React from "react";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
/** project */
import WHOLogo from "app/modules/home-module/assets/WHO-logo.svg";
import KaggleLogo from "app/modules/home-module/assets/kaggle-logo.svg";
import WorldBankLogo from "app/modules/home-module/assets/world-bank-logo.svg";
import HDXLogo from "app/modules/home-module/assets/hdx-logo.svg";
import TGFLogo from "app/modules/home-module/assets/tgf-logo.svg";
import { ReactComponent as ClockIcon } from "app/modules/home-module/assets/clock-icon.svg";

import moment from "moment";
import { IExternalDataset } from "app/modules/dataset-module/routes/upload-module/upload-steps/externalSearch";
export default function ExternalDatasetCard(
  props: Readonly<{
    name: string;
    description: string;
    url: string;
    source: string;
    publishedDate: string;
    handleDownload: (dataset: IExternalDataset) => void;
    dataset: IExternalDataset;
    searchValue?: string;
  }>
) {
  const sourceLogo = (source: string) => {
    switch (source) {
      case "WHO":
        return <img src={WHOLogo} alt="WHO-logo" />;
      case "Kaggle":
        return <img src={KaggleLogo} alt="kaggle-logo" />;
      case "World Bank":
        return <img src={WorldBankLogo} alt="world-bank-logo" />;
      case "HDX":
        return <img src={HDXLogo} alt="hdx-logo" />;
      case "TGF":
        return <img src={TGFLogo} alt="tgf-logo" />;
      default:
        return <div />;
    }
  };
  const [showButton, setShowButton] = React.useState<boolean>(false);

  const highlightMatch = (text: string, searchValue?: string) => {
    if (!searchValue) {
      return text;
    }
    const regex = new RegExp(`(${searchValue})`, "i");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? <span key={index}>{part}</span> : part
    );
  };

  return (
    <div
      onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}
      data-cy={`external-search-card-${props.source}`}
      css={`
        width: 296px;
        height: 162px;
        box-shadow: 0px 7px 16px 0px rgba(0, 0, 0, 0.05);
        padding: 12px;
        background: #fff;
        position: relative;
        p:nth-of-type(1) {
          color: #262c34;
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          font-size: 14px;
          margin: 0;
          margin-bottom: 4.05px;
          line-height: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          span {
            color: #6061e5;
            text-decoration: underline;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            font-size: 14px;
          }
        }
        p:nth-of-type(2) {
          color: #495057;
          font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
          font-size: 12px;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: normal;
          span {
            color: #6061e5;
            text-decoration: underline;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            font-size: 12px;
          }
        }
        p:nth-of-type(3) {
          color: #495057;
          font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
          font-size: 12px;
          text-decoration-line: underline;
          margin: 0;
          margin-top: 4px;
          margin-bottom: 9px;
          height: 12px;
          line-height: normal;
          a {
            text-decoration: none;
            color: inherit;
            font-size: 12px;
          }
        }
        div {
          /* height: 62px; */
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          img {
            object-fit: cover;
          }
          button {
            outline: none;
            border: none;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 8px 16px;
            border-radius: 8px;
            background: #231d2c;
            color: #fff;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            font-size: 12px;
            line-height: 8px;
          }
        }
        p:nth-of-type(4) {
          color: #231d2c;
          font-family: "GothamNarrow-Book";
          font-size: 10px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 4px;
          position: absolute;
          right: 16px;
          bottom: 12px;
          margin: 0;
          line-height: normal;
          svg {
            width: 12px;
            height: 12px;
          }
        }
      `}
    >
      <p title={props.name}>{highlightMatch(props.name, props.searchValue)}</p>
      <p title={props.description}>
        {highlightMatch(props.description, props.searchValue)}
      </p>
      <p>
        <a href={props.url} rel="noreferrer noopener" target="_blank">
          Link to data source.
        </a>
      </p>
      <div
        css={`
          /* height: 62px; */
          margin: 0;
          display: flex;
          align-items: center;
        `}
      >
        {sourceLogo(props.source)}
        {showButton && (
          <button
            onClick={() => props.handleDownload(props.dataset)}
            data-cy="import-to-dx-button"
          >
            Connect to Dataxplorer
          </button>
        )}
      </div>

      <p>
        {" "}
        <ClockIcon />
        {moment(props.publishedDate).format("MMMM YYYY")}
      </p>
    </div>
  );
}
