import React from "react";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";
import { ReactComponent as ClockIcon } from "app/modules/home-module/assets/clock-icon.svg";
import { ReactComponent as OwnerIcon } from "app/modules/home-module/assets/owner-icon.svg";
import { ReactComponent as MenuIcon } from "app/modules/home-module/assets/menu.svg";
import { ReactComponent as DataCardImg } from "app/modules/home-module/assets/data-card-img.svg";
import { ReactComponent as InfoIcon } from "app/modules/home-module/assets/info-icon.svg";
import { Link, useLocation } from "react-router-dom";
import { useMediaQuery } from "@material-ui/core";
import { useAuth0 } from "@auth0/auth0-react";
import { useStoreActions } from "app/state/store/hooks";
import { isChartAIAgentActive } from "app/state/recoil/atoms";
import { useRecoilState } from "recoil";
import MenuItems from "app/modules/home-module/components/AssetCollection/Datasets/menuItems";
import { MOBILE_BREAKPOINT } from "app/theme";

interface Props {
  path: string;
  title: string;
  descr: string;
  date: Date;
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
      <Link
        to={destinationPath}
        css={`
          text-decoration: none;
        `}
      >
        <div
          css={`
            width: 100%;
            height: 162px;
            display: flex;
            color: #262c34;
            background: #fff;

            flex-direction: column;
            padding: 12px 8px 4px 12px;
            justify-content: space-between;
            box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.05);

            &:hover {
              box-shadow: 0px 7px 22px 0px rgba(0, 0, 0, 0.1);
            }
            overflow: hidden;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
            `}
          >
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
            {props.showMenu && (
              <IconButton
                css={`
                  position: absolute;
                  right: -2px;
                  top: 0px;
                  cursor: pointer;

                  &:hover {
                    background: transparent;
                  }
                `}
                onClick={showMenuOptions}
                data-cy="dataset-grid-item-menu-btn"
              >
                <MenuIcon />
              </IconButton>
            )}
          </div>
          <div
            css={`
              display: flex;
              position: relative;
            `}
          >
            <div
              css={`
                position: absolute;
                bottom: -14px;
                svg {
                  width: 119.084px;
                  height: 69.761px;
                }
              `}
            >
              <DataCardImg />
            </div>
          </div>
        </div>
      </Link>
      {displayCreateChartButton &&
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
        )}
      {menuOptionsDisplay && (
        <MenuItems
          handleClose={() => setMenuOptionsDisplay(false)}
          handleDelete={() => props.handleDelete?.(props.id as string)}
          handleDuplicate={() => props.handleDuplicate?.(props.id as string)}
          id={props.id as string}
          owner={props.owner}
          path={props.path}
          type="dataset"
        />
      )}
      <div
        css={`
          position: absolute;
          bottom: 12px;
          right: 16px;
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
            align-items: center;
            gap: 3px;
          `}
        >
          <OwnerIcon />
          <p>{props.ownerName?.split(" ")?.[0]}</p>
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
  );
}
