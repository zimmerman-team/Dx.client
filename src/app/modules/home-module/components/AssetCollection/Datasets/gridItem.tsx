import React from "react";
import moment from "moment";
import { ReactComponent as ClockIcon } from "app/modules/home-module/assets/clock-icon.svg";
import { ReactComponent as OwnerIcon } from "app/modules/home-module/assets/owner-icon.svg";
import { ReactComponent as MenuIcon } from "app/modules/home-module/assets/menu.svg";
import { ReactComponent as Logo } from "app/modules/home-module/assets/logo.svg";

import { useHistory, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useStoreActions } from "app/state/store/hooks";
import { isChartAIAgentActive } from "app/state/recoil/atoms";
import { useRecoilState } from "recoil";
import MenuItems from "app/modules/home-module/components/AssetCollection/All/menuItems";

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
  const [displayCreateChartButton, setDisplayCreateChartButton] =
    React.useState(false);
  const setIsAiSwitchActive = useRecoilState(isChartAIAgentActive)[1];
  const { user, isAuthenticated } = useAuth0();

  const showMenuOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOptionsDisplay(!menuOptionsDisplay);
  };
  const canDatasetEditDelete = React.useMemo(() => {
    return isAuthenticated && props.owner === user?.sub;
  }, [user, isAuthenticated]);
  const setDataset = useStoreActions(
    (actions) => actions.charts.dataset.setValue
  );

  function handleCreateNewChart() {
    setDataset(props.id as string);
    setIsAiSwitchActive(true);
  }
  let destinationPath = `/dataset/${props.id}`;
  if (location.pathname === "/") {
    destinationPath += "?fromHome=true";
  }

  return (
    <div
      onMouseEnter={() => setDisplayCreateChartButton(true)}
      onMouseLeave={() => setDisplayCreateChartButton(false)}
      css={`
        position: relative;
      `}
      data-cy="dataset-grid-item"
    >
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
            margin-bottom: 5px;
            p {
              border-radius: 5px;
              background: #ededff;
              box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.05);
              display: flex;
              padding: 0px 6px;
              justify-content: center;
              align-items: center;
              gap: 10px;
              color: #231d2c;
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              font-size: 12px;
              width: fit-content;
              margin: 0;
              height: 20px;
              text-transform: capitalize;
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
          <div
            css={`
              display: flex;
              align-items: flex-end;
              gap: 5px;
              a {
                color: #231d2c;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                font-size: 12px;
                font-weight: 325;
                line-height: normal;
                text-decoration-line: underline;
                text-decoration-style: solid;
                text-underline-position: from-font;
                display: inline-block;
                max-width: 80px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            `}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.26825 9.12491L8.39414 2.99955L3.85718 2.99955C3.74351 2.99955 3.6345 2.9544 3.55413 2.87403C3.47376 2.79365 3.42861 2.68465 3.42861 2.57098C3.42861 2.45732 3.47376 2.34831 3.55413 2.26793C3.6345 2.18756 3.74351 2.14241 3.85718 2.14241L9.42861 2.14241C9.54227 2.14241 9.65128 2.18756 9.73165 2.26793C9.81202 2.34831 9.85718 2.45732 9.85718 2.57098L9.85718 8.14241C9.85718 8.25607 9.81202 8.36508 9.73165 8.44546C9.65128 8.52583 9.54227 8.57098 9.42861 8.57098C9.31494 8.57098 9.20593 8.52583 9.12556 8.44546C9.04519 8.36508 9.00003 8.25607 9.00003 8.14241L9.00003 3.60544L2.87468 9.73134C2.83486 9.77116 2.78759 9.80274 2.73556 9.82429C2.68354 9.84584 2.62778 9.85693 2.57146 9.85693C2.51515 9.85693 2.45939 9.84584 2.40736 9.82429C2.35534 9.80274 2.30807 9.77116 2.26825 9.73134C2.22843 9.69152 2.19684 9.64425 2.17529 9.59222C2.15375 9.5402 2.14265 9.48444 2.14265 9.42812C2.14265 9.37181 2.15375 9.31605 2.17529 9.26403C2.19684 9.212 2.22843 9.16473 2.26825 9.12491Z"
                fill="#343330"
              />
            </svg>

            <a
              title={props.source}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.stopPropagation();
              }}
              href={props.sourceURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {props.source}
            </a>
          </div>

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
      {/* {displayCreateChartButton &&
        !props.inChartBuilder &&
        canDatasetEditDelete && (
          <Link
            to={{
              pathname: `/chart/new/chart-type`,
              search: "?loadataset=true",
            }}
          >
            <button
              onClick={handleCreateNewChart}
              disabled={!canDatasetEditDelete}
              css={`
                position: absolute;
                cursor: ${canDatasetEditDelete ? "pointer" : "not-allowed"};
                height: 20px;
                border-radius: 20px;
                color: #ffffff;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                right: 8px;
                bottom: 40px;
                z-index: 2;
                border: none;
                outline: none;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8.3px;
                background: #359c96;
                @media (max-width: ${MOBILE_BREAKPOINT}) {
                  display: none;
                }
                span {
                  margin: 0;
                  padding: 0;
                  font-size: 10px;
                }
              `}
            >
              <span>Create chart with AI</span>
              <InfoIcon />
            </button>
          </Link>
        )} */}

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
