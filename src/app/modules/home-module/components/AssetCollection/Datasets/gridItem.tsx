import React from "react";
import moment from "moment";
import { ReactComponent as ClockIcon } from "app/modules/home-module/assets/clock-icon.svg";
import { ReactComponent as OwnerIcon } from "app/modules/home-module/assets/owner-icon.svg";
import { ReactComponent as MenuIcon } from "app/modules/home-module/assets/menu.svg";
import { ReactComponent as Logo } from "app/modules/home-module/assets/logo.svg";

import { useHistory, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { isChartAIAgentActive } from "app/state/recoil/atoms";
import { useRecoilState } from "recoil";
import MenuItems from "app/modules/home-module/components/AssetCollection/All/menuItems";
import SourceLink from "./sourceLink";
import { Tooltip } from "react-tooltip";

interface Props {
  path: string;
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
  ownerName: string;
}

export default function GridItem(props: Readonly<Props>) {
  const location = useLocation();
  const history = useHistory();
  const [menuOptionsDisplay, setMenuOptionsDisplay] = React.useState(false);
  const setIsAiSwitchActive = useRecoilState(isChartAIAgentActive)[1];
  const { isAuthenticated } = useAuth0();

  const showMenuOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOptionsDisplay(!menuOptionsDisplay);
  };
  const [highlightedId, setHighlightedId] = React.useState<string | null>(null);
  const queryParams = new URLSearchParams(location.search);
  const searchParams = queryParams.get("newlyCreatedId");

  let destinationPath = `/dataset/${props.id}`;
  if (location.pathname === "/") {
    destinationPath += "?fromHome=true";
  }

  React.useEffect(() => {
    if (searchParams) {
      setHighlightedId(searchParams);

      // Auto-clear after 5 seconds
      const timeout = setTimeout(() => {
        setHighlightedId(null);
        const queryParams = new URLSearchParams(location.search);
        queryParams.delete("newlyCreatedId");
        history.replace({
          pathname: location.pathname,
          search: queryParams.toString(),
        });
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, []);

  return (
    <div
      css={`
        position: relative;
      `}
      data-cy="dataset-grid-item"
      className="asset-indicator"
    >
      <Tooltip
        anchorSelect=".asset-indicator"
        place="right"
        hidden={highlightedId !== props.id}
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
        }}
      >
        Your Dataset is here!
      </Tooltip>
      <div
        onClick={(e) => {
          history.push(destinationPath);
        }}
        css={`
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
          ${highlightedId === props.id ? "border: 1.5px solid #6061E5;" : ""}

          &:hover {
            box-shadow: 0px 7px 22px 0px rgba(0, 0, 0, 0.1);
            cursor: pointer;
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
              background: ${highlightedId === props.id ? "#6061E5" : "#ededff"};
              box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.05);
              display: flex;
              padding: 0px 6px;
              justify-content: center;
              align-items: center;
              gap: 10px;
              color: ${highlightedId === props.id ? "#fff" : "#231d2c"};
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
            <button
              css={`
                border: none;
                background: ${menuOptionsDisplay ? "#CFD0F4" : "transparent"};
                outline: none;
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                height: 19px;
                width: 19px;
                border-radius: 5px;
                right: 5px;
                top: 12px;
                cursor: pointer;

                svg {
                  flex-shrink: 0;
                }
                &:hover {
                  background: transparent;
                }
              `}
              onClick={showMenuOptions}
              data-cy="dataset-grid-item-menu-btn"
            >
              <MenuIcon />
            </button>
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
              <OwnerIcon />
              {isAuthenticated ? (
                <p>{props.ownerName?.split(" ")?.[0]}</p>
              ) : (
                <Logo />
              )}
            </div>
            <div
              css={`
                display: flex;
                align-items: center;
                gap: 3px;
              `}
            >
              <ClockIcon width={12} height={12} />
              <p>{moment(props.date).format("MMMM YYYY")}</p>
            </div>
          </div>
        </div>
      </div>

      <MenuItems
        handleClose={() => setMenuOptionsDisplay(false)}
        handleDelete={() => props.handleDelete?.(props.id as string)}
        handleDuplicate={() => props.handleDuplicate?.(props.id as string)}
        id={props.id as string}
        owner={props.owner}
        path={props.path}
        type="dataset"
        display={menuOptionsDisplay}
      />
    </div>
  );
}
