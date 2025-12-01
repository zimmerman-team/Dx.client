import React from "react";
import moment from "moment";
import ClockIcon from "@app/modules/home-module/assets/clock-icon.svg?react";
import OwnerIcon from "@app/modules/home-module/assets/owner-icon.svg?react";
import MenuIcon from "@app/modules/home-module/assets/menu.svg?react";
import ChevronRight from "@app/modules/home-module/assets/chevron-right.svg?react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import SourceLink from "./sourceLink";
import { Tooltip as ReactTooltip } from "react-tooltip";

import { useStoreActions } from "@app/state/store/hooks";
import Tooltip from "@material-ui/core/Tooltip";

import { isChartAIAgentActive } from "@app/state/recoil/atoms";
import { useRecoilState } from "recoil";
import MenuPopover from "@app/modules/home-module/components/AssetCollection/All/menuPopover";

import { FOCUS_VISIBLE_STYLE_LIGHT } from "@app/theme";
import Logo from "@app/assets/icons/Logo";

interface Props {
  editPath: string;
  title: string;
  descr: string;
  date: Date;
  source: string;
  sourceURL: string;
  showMenu?: boolean;
  handleDuplicate?: (id: string) => void;
  handleDelete?: (id: string) => void;
  id?: string;
  owner: string;
  inChartBuilder: boolean;
  onItemClick?: (id: string) => void;
  ownerName: string;
  hideCreateChartButton?: boolean;
  newlyCreated?: boolean;
}

export default function GridItem(props: Readonly<Props>) {
  const location = useLocation();
  const history = useHistory();
  const [menuOptionsDisplay, setMenuOptionsDisplay] = React.useState(false);
  const setDataset = useStoreActions(
    (actions) => actions.charts.dataset.setValue
  );
  const [displayCreateChartButton, setDisplayCreateChartButton] =
    React.useState(false);
  const { user, isAuthenticated } = useAuth0();
  const canEditDelete = React.useMemo(() => {
    return isAuthenticated && props.owner === user?.sub;
  }, [user, isAuthenticated]);
  const handleCreateNewChart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDataset(props.id ?? null);
    history.push(`/chart/new/chart-type?loadataset=true`);
  };
  const showMenuOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOptionsDisplay(!menuOptionsDisplay);
  };

  let destinationPath = `/dataset/${props.id}`;
  if (location.pathname === "/") {
    destinationPath += "?fromHome=true";
  }

  return (
    <div
      css={`
        position: relative;
      `}
      data-cy="dataset-grid-item"
      className={props.newlyCreated ? "asset-indicator" : ""}
      onMouseEnter={() => setDisplayCreateChartButton(true)}
      onMouseLeave={() => setDisplayCreateChartButton(false)}
    >
      <ReactTooltip
        anchorSelect=".asset-indicator"
        place="right"
        isOpen={props.newlyCreated}
        defaultIsOpen
        style={{
          background: "#231D2C",
          borderRadius: "10px",
          padding: "16px",
          whiteSpace: "nowrap",
          color: "#fff",
          fontSize: "14px",
          fontFamily: "GothamNarrow-Book, 'Helvetica Neue', sans-serif",
          width: "156px",
          height: "52px",
          lineHeight: "16px",
          textAlign: "center",
          zIndex: 1,
          display: props.newlyCreated ? "block" : "none",
        }}
      >
        Your Dataset is here!
      </ReactTooltip>
      <button
        aria-label={`data-card`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (props.inChartBuilder && props.onItemClick) {
            props.onItemClick(props.id!!);
          } else {
            history.push(destinationPath);
          }
        }}
        css={`
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          font: inherit;
          color: inherit;
          text-align: inherit;
          appearance: none; /* removes native OS/browser styles */
          -webkit-appearance: none;
          user-select: text;
          cursor: pointer; /* so it behaves like a button */
          width: 100%;
          height: 162px;
          display: flex;
          color: #262c34;
          background: #fff;
          position: relative;
          text-decoration: none;
          flex-direction: column;
          border: 1px solid #fff;
          transition: box-shadow 0.2s ease-in-out;
          padding: 10px;
          box-shadow: 0px 1px 14px 0px rgba(0, 0, 0, 0.12);
          border-radius: 10px;
          ${props.newlyCreated ? "border: 1.5px solid #6061E5;" : ""}

          &:hover {
            box-shadow: 0px 7px 22px 0px rgba(0, 0, 0, 0.1);
            cursor: pointer;
          }
          &:focus-visible {
            ${FOCUS_VISIBLE_STYLE_LIGHT}
          }
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            height: 20px;
            p {
              border-radius: 5px;
              background: ${props.newlyCreated ? "#6061E5" : "#ededff"};
              box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.05);
              display: flex;
              padding: 0px 6px;
              justify-content: center;
              align-items: center;
              gap: 10px;
              color: ${props.newlyCreated ? "#fff" : "#231d2c"};
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              font-size: 12px;
              width: fit-content;
              margin: 0;
              height: 20px;
              text-transform: capitalize;
              margin-bottom: 5px;
            }
          `}
        >
          <p>Dataset</p>
          {props.showMenu && (
            <MenuPopover
              handleDelete={() => props.handleDelete?.(props.id as string)}
              handleDuplicate={() =>
                props.handleDuplicate?.(props.id as string)
              }
              id={props.id as string}
              menuId="dataset-grid-item-menu"
              owner={props.owner}
              path={props.editPath}
              type="dataset"
              dataCy="dataset-grid-item-menu-btn"
              dataTestId=""
            />
          )}
        </div>

        <div
          css={`
            width: 90%;
            height: 50px;
            word-wrap: break-word;
          `}
        >
          <p
            title={props.title}
            css={`
              margin-top: -5px;
              font-size: 14px;
              line-height: 22px;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              overflow: hidden;
              margin-bottom: 2px;
              white-space: nowrap;
              text-overflow: ellipsis;
            `}
          >
            <b>{props.title}</b>
          </p>
          <p
            title={props.descr}
            css={`
              font-size: 10px;
              line-height: 14px;
              margin-top: 1px;
              color: #495057;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            `}
          >
            {props.descr}
          </p>
        </div>
        <div
          css={`
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            height: 100%;
            gap: 7px;
            p {
              margin: 0;
              font-size: 10px;
              line-height: normal;
            }
          `}
        >
          <div>
            <SourceLink source={props.source} sourceURL={props.sourceURL} />
            <div
              css={`
                display: flex;
                align-items: flex-end;
                gap: 5px;
              `}
            >
              <div
                css={`
                  display: flex;
                  align-items: center;
                  gap: 3px;
                  > svg:nth-child(2) {
                    height: 8px;
                    width: 72px;
                  }
                `}
              >
                <OwnerIcon aria-label="owner" />
                {isAuthenticated ? (
                  <p>{props.ownerName}</p>
                ) : (
                  <Logo main width="72px" height=" 7.702px" />
                )}
              </div>
              <div
                css={`
                  display: flex;
                  align-items: center;
                  gap: 3px;
                `}
              >
                <ClockIcon
                  width={12}
                  height={12}
                  role="presentation"
                  css={`
                    flex-shrink: 0;
                  `}
                />
                <p
                  css={`
                    flex-shrink: 0;
                  `}
                >
                  {moment(props.date).format("DD-MM-YYYY")}
                </p>
              </div>
            </div>
          </div>
          {displayCreateChartButton && !props.hideCreateChartButton && (
            <Tooltip
              title={
                canEditDelete
                  ? ""
                  : "You do not have permission to create a chart from this dataset"
              }
            >
              <span>
                <button
                  id="create-chart-from-dataset"
                  disabled={!canEditDelete}
                  onClick={handleCreateNewChart}
                  css={`
                    cursor: ${canEditDelete ? "pointer" : "not-allowed"};
                    color: #fff;
                    font-family: "GothamNarrow-Bold", "Helvetica Neue",
                      sans-serif;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    border-radius: 10px;
                    background: ${canEditDelete ? "#6061e5" : "#A1A4B2"};
                    height: 28px;
                    width: 118px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    border: none;
                    outline: none;
                    :focus-visible {
                      ${FOCUS_VISIBLE_STYLE_LIGHT}
                    }
                  `}
                >
                  Create Chart <ChevronRight role="presentation" />
                </button>
              </span>
            </Tooltip>
          )}
        </div>
      </button>
    </div>
  );
}
