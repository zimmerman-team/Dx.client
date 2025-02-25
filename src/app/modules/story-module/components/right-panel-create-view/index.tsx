/* third-party */
import React, { useState } from "react";
import find from "lodash/find";
import { useDrag } from "react-dnd";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import MuiButton from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import { EditorState } from "draft-js";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import SearchIcon from "@material-ui/icons/Search";
import { withStyles } from "@material-ui/core/styles";
import { useHistory, useParams } from "react-router-dom";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import {
  storyRightPanelViewAtom,
  chartFromStoryAtom,
  isDividerOrRowFrameDraggingAtom,
  isChartDraggingAtom,
  isChartAIAgentActive,
} from "app/state/recoil/atoms";
import { Close } from "@material-ui/icons";
import { IconButton, Tooltip } from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
/* project */
import { useStoreActions, useStoreState } from "app/state/store/hooks";

import { IFramesArray } from "app/modules/story-module/views/create/data";
import EditHeaderIcon from "app/modules/story-module/asset/EditHeaderIcon";
import TextPreviewImg from "app/modules/story-module/asset/textPreview.svg";
import { ReactComponent as YoutubeIcon } from "app/modules/story-module/asset/youtube-icon.svg";
import YoutubeGradient from "app/modules/story-module/asset/youtube-gradient.png";
import {
  Charts,
  IChartDetail,
} from "app/modules/story-module/components/right-panel-create-view/data";
import DividerPreviewImg from "app/modules/story-module/asset/dividerPreview.svg";
import HeaderPreviewImg from "app/modules/story-module/asset/headerPreviewImg.svg";
import RowFramePreviewImg from "app/modules/story-module/asset/rowframePreview.svg";
import { ReactComponent as AddNewImage } from "app/modules/home-module/assets/add-img.svg";
import { ReactComponent as DividerIcon } from "app/modules/story-module/asset/dividerIcon.svg";
import { ReactComponent as ActiveChartIcon } from "app/modules/story-module/asset/active-chart-icon.svg";
import { ReactComponent as ActiveElementsIcon } from "app/modules/story-module/asset/active-elements-icon.svg";
import { ReactComponent as ActiveMediaIcon } from "app/modules/story-module/asset/active-media-icon.svg";
import { ReactComponent as ChartIcon } from "app/modules/story-module/asset/chart-icon.svg";
import { ReactComponent as MediaIcon } from "app/modules/story-module/asset/media-icon.svg";
import { ReactComponent as ElementsIcon } from "app/modules/story-module/asset/elements-icon.svg";
import { ReactComponent as VideoIcon } from "app/modules/story-module/asset/video-icon.svg";
import ChartOptionColor from "app/modules/chart-module/routes/customize/components/ChartOptionColor";
import { ReactComponent as RowframeIcon } from "app/modules/story-module/asset/rowframe-icon.svg";
import PanelLabel from "app/modules/story-module/components/right-panel-create-view/panelLabel";
import { elementItemcss } from "app/modules/story-module/components/right-panel-create-view/style";
import GridItem from "app/modules/story-module/components/right-panel-create-view/rhpGridItem";
import { css } from "styled-components";
import { get } from "lodash";
import { useSearchMediaSources } from "app/hooks/useSearchMediaSources";
import { useDebounce } from "react-use";
import Skeleton from "@material-ui/lab/Skeleton";
import { useInfinityScroll } from "app/hooks/useInfinityScroll";
import { IHeaderDetails } from "app/modules/story-module/components/right-panel/data";
import { useCheckUserPlan } from "app/hooks/useCheckUserPlan";
import { PrimaryButton, TertiaryButton } from "app/components/Styled/button";

interface Props {
  showHeaderItem: boolean;
  headerDetails: IHeaderDetails;
  setHeaderDetails: React.Dispatch<React.SetStateAction<IHeaderDetails>>;
  framesArray: IFramesArray[];
  storyName: string;
  onSave: (type: "create" | "edit") => Promise<void>;
}

const Button = withStyles(() => ({
  root: {
    width: "50%",
    height: "52px",
    fontWeight: 700,
    fontSize: "14px",
    borderRadius: "0px",
    backgroundColor: "#C7CDD1",
    fontFamily: "GothamNarrow-Bold, 'Helvetica Neue', sans-serif",
    "&:first-child": {
      borderRight: "1px solid #f1f3f5",
    },
    "&:hover": {
      backgroundColor: "#70777E",
    },
  },
  label: {
    color: "#fff",
    fontSize: "14px",
    textTransform: "none",
    fontFamily: "GothamNarrow-Book, 'Helvetica Neue', sans-serif",
  },
}))(MuiButton);

const StyledMenu = withStyles({
  paper: {
    width: 159,
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(152, 161, 170, 0.6)",
    "&::-webkit-scrollbar": {
      width: 5,
      borderRadius: 10,
      background: "#231d2c",
    },
    "&::-webkit-scrollbar-track": {
      borderRadius: 10,
      background: "#dfe3e6",
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: 10,
      background: "#231d2c",
    },
  },
  list: {
    padding: 0,
    maxHeight: 500,
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    autoFocus={false}
    {...props}
  />
));

const StyledMenuItem = withStyles(() => ({
  root: {
    width: "100%",
    fontSize: "14px",
    color: "#231d2c",
    padding: "10px 12px",
    borderBottom: "1px solid #DFE3E6",
  },
}))(MenuItem);

export const StoryElementsType = {
  ROWFRAME: "rowFrame",
  TEXT: "text",
  DIVIDER: "divider",
  HEADER: "header",
  CHART: "chart",
  BIG_NUMBER: "bigNumber",
  IMAGE: "image",
  VIDEO: "video",
  ROW: "row",
};

const sortByOptions = [
  { value: "createdDate desc", label: "Recent" },
  { value: "createdDate asc", label: "Recent" },
  { value: "name desc", label: "Name" },
  { value: "name asc", label: "Name" },
];

const videoSources = [
  { value: "youtube", label: "Youtube" },
  { value: "vimeo", label: "Vimeo" },
];

const imageSources = [
  { value: "unsplash", label: "Unsplash" },
  // { value: "shutterstock", label: "Shutterstock" },
];

const UpgradeCard = (props: { onClose: () => void }) => {
  const history = useHistory();

  return (
    <div
      css={`
        width: 93%;
        position: absolute;
        right: 13px;
        bottom: 21px;
        padding: 26px;
        border-radius: 10px;
        background: #fff;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
        z-index: 1;
      `}
    >
      <h2
        css={`
          margin: 0;
          color: #231d2c;
          font-family: "GothamNarrow-Bold", sans-serif;
          font-size: 24px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          @media (max-width: 768px) {
            font-size: 18px;
          }
        `}
      >
        Enhance Your Stories with Multimedia!
      </h2>
      <p
        css={`
          margin: 0;
          margin-top: 8px;
          font-family: "GothamNarrow-Book", sans-serif;
          font-size: 18px;
          font-style: normal;
          font-weight: 325;
          line-height: normal;
          @media (max-width: 768px) {
            font-size: 14px;
          }
        `}
      >
        Currently, adding videos and images to stories is a feature exclusive to
        our premium plans. Upgrade now to bring your data to life with engaging
        visuals and make your stories more impactful.
      </p>

      <div
        css={`
          display: flex;
          align-items: center;
          gap: 16px;
          padding-top: 24px;
          justify-content: flex-end;
          @media (max-width: 768px) {
            flex-direction: column;
            gap: 16px;
            button {
              width: 100%;
              font-size: 16px;
            }
          }
        `}
      >
        <PrimaryButton
          size="big"
          bg="light"
          type="button"
          onClick={() => {
            history.push("/pricing");
            props.onClose();
          }}
        >
          Upgrade
        </PrimaryButton>
        <TertiaryButton size="big" bg="light" onClick={props.onClose}>
          Not Now
        </TertiaryButton>
      </div>
    </div>
  );
};

export function StoryRightPanelCreateView(props: Readonly<Props>) {
  const [currentView, setCurrentView] = useRecoilState(storyRightPanelViewAtom);
  const [_chartFromStory, setChartFromStory] =
    useRecoilState(chartFromStoryAtom);
  const whiteBackgroundOnly = "background-color: #fff;";
  const whiteBackgroundRoundedBottomRight =
    whiteBackgroundOnly + " border-radius: 0px 0px 8px 0px;";
  const whiteBackgroundRoundedBottomLeft =
    whiteBackgroundOnly + " border-radius: 0px 0px 0px 8px;";
  const whiteBackgroundNotRounded =
    whiteBackgroundOnly + " border-radius: 0px 0px 0px 0px";

  const { userPlan } = useCheckUserPlan();

  const [open, setOpen] = useState(true);

  const [elementItemDetails, setElementItemDetails] = React.useState([
    {
      elementType: StoryElementsType.HEADER,
      leftIcon: <EditHeaderIcon />,
      previewImg: HeaderPreviewImg,
      name: "Header",
      description: "Remove or add header to your story",
      openTooltip: false,
    },
    {
      elementType: StoryElementsType.ROWFRAME,
      leftIcon: <RowframeIcon />,
      previewImg: RowFramePreviewImg,
      name: "Add row frame",
      description: "Start adding placeholders to fit with your content",
      openTooltip: false,
    },

    {
      elementType: StoryElementsType.DIVIDER,
      leftIcon: <DividerIcon />,
      previewImg: DividerPreviewImg,
      name: "Add divider",
      description: "Use dividers to separate sections ",
      openTooltip: false,
    },
  ]);

  const [mediaItemDetails, setMediaItemDetails] = React.useState([
    {
      elementType: StoryElementsType.TEXT,
      leftIcon: (
        <TextFieldsIcon
          css={`
            width: 48px;
            height: 48px;
          `}
        />
      ),
      previewImg: TextPreviewImg,
      name: "Add text box",
      description: "Include written content to enrich your stories",
      openTooltip: false,
    },
    {
      elementType: StoryElementsType.IMAGE,
      leftIcon: (
        <PhotoLibraryIcon
          css={`
            width: 36px;
            height: 36px;
            margin: 6px;
          `}
        />
      ),
      previewImg: TextPreviewImg,
      name: "Add image",
      description: "Include imagery content to enrich your stories",
      openTooltip: false,
    },
    {
      elementType: StoryElementsType.VIDEO,
      leftIcon: <VideoIcon />,
      previewImg: TextPreviewImg,
      name: "Add video",
      description: "Include video content to enrich your story",
      openTooltip: false,
    },
  ]);

  React.useEffect(() => {
    if (!props.headerDetails.showHeader && currentView === "editHeader") {
      setCurrentView("elements");
    }
  }, [props.headerDetails.showHeader]);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setChartFromStory({
        state: false,
        page: "",
        view: "",
        action: null,
        chartId: null,
      });
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      css={`
        width: 100%;
        display: flex;
        height: 100%;
        flex-direction: column;
        box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.6);
        position: relative;
      `}
    >
      <div
        css={`
          width: 100%;
          display: ${currentView === "editHeader" ? "none" : "flex"};
          height: 67px;
          background: #f1f3f5;
          align-items: center;
          button {
            padding: 20px;
            height: 100%;
            :hover {
              background: transparent;
              border-radius: none;
            }
          }
        `}
      >
        <IconButton
          disableRipple
          data-testid="elements-button"
          onClick={() => setCurrentView("elements")}
          data-cy="story-panel-elements-tab"
          css={`
            ${(() => {
              if (currentView === "elements") {
                return "background: transparent;";
              } else if (currentView === "charts") {
                return whiteBackgroundRoundedBottomRight;
              } else if (currentView === "media") {
                return whiteBackgroundNotRounded;
              } else {
                return "";
              }
            })()}
          `}
        >
          {currentView === "elements" ? (
            <ActiveElementsIcon />
          ) : (
            <ElementsIcon />
          )}
        </IconButton>
        <IconButton
          data-cy="story-panel-chart-tab"
          disableRipple
          onClick={() => setCurrentView("charts")}
          data-testid="charts-button"
          css={`
            ${(() => {
              if (currentView === "elements") {
                return whiteBackgroundRoundedBottomLeft;
              } else if (currentView === "charts") {
                return "background-color: transparent;";
              } else if (currentView === "media") {
                return whiteBackgroundRoundedBottomRight;
              } else {
                return "";
              }
            })()}
          `}
        >
          {currentView === "charts" ? <ActiveChartIcon /> : <ChartIcon />}
        </IconButton>

        <IconButton
          disableRipple
          onClick={() => setCurrentView("media")}
          data-cy="story-panel-media-tab"
          data-testid="media-button"
          css={`
            ${(() => {
              if (currentView === "elements") {
                return whiteBackgroundNotRounded;
              } else if (currentView === "charts") {
                return whiteBackgroundRoundedBottomLeft;
              } else if (currentView === "media") {
                return "background: transparent;";
              } else {
                return "";
              }
            })()}
          `}
        >
          {currentView === "media" ? <ActiveMediaIcon /> : <MediaIcon />}
        </IconButton>

        <div
          css={`
            ${(() => {
              if (currentView === "elements") {
                return whiteBackgroundOnly;
              } else if (currentView === "charts") {
                return whiteBackgroundOnly;
              } else if (currentView === "media") {
                return whiteBackgroundRoundedBottomLeft;
              } else {
                return "";
              }
            })()}
            width: 100%;
            height: 100%;
          `}
        ></div>
      </div>
      {open &&
      currentView === "media" &&
      userPlan?.planData?.name === "Free" ? (
        <UpgradeCard onClose={() => setOpen(false)} />
      ) : null}

      <PanelLabel currentView={currentView} />
      {currentView === "elements" && (
        <div
          css={`
            width: 100%;
            display: flex;
            user-select: none;
            flex-direction: column;
          `}
        >
          {elementItemDetails.map((item) => (
            <ElementItem
              key={item.elementType}
              {...item}
              disabled={
                item.elementType === StoryElementsType.HEADER
                  ? !props.showHeaderItem
                  : false
              }
            />
          ))}
        </div>
      )}
      {currentView === "charts" && (
        <StoryRightPanelCreateViewChartList
          headerDetails={props.headerDetails}
          framesArray={props.framesArray}
          storyName={props.storyName}
          onSave={props.onSave}
        />
      )}
      {currentView === "media" && (
        <div
          css={`
            width: 100%;
            display: flex;
            user-select: none;
            flex-direction: column;
            background: transparent;
            padding-bottom: 25px;
            overflow-y: scroll;
          `}
        >
          {mediaItemDetails.map((item, index) => (
            <ElementItem
              key={item.elementType}
              {...item}
              disabled={false}
              upgradeRequired={
                (item.elementType === StoryElementsType.IMAGE ||
                  item.elementType === StoryElementsType.VIDEO) &&
                userPlan?.planData?.name === "Free"
              }
              ItemDetails={mediaItemDetails}
              setItemDetails={setMediaItemDetails}
              index={index}
              draggable={
                !(
                  item.elementType === StoryElementsType.IMAGE ||
                  item.elementType === StoryElementsType.VIDEO
                )
              }
            />
          ))}
        </div>
      )}
      {currentView === "editHeader" && <EditHeaderPanelView {...props} />}
    </div>
  );
}

function StoryRightPanelCreateViewChartList(
  props: Readonly<{
    headerDetails: IHeaderDetails;
    framesArray: IFramesArray[];
    storyName: string;
    onSave: (type: "create" | "edit") => Promise<void>;
  }>
) {
  const token = useStoreState((state) => state.AuthToken.value);

  const [search, setSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState(sortByOptions[0]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const chartList = useStoreState(
    (state) => (state.charts.ChartGetList.crudData || []) as IChartDetail[]
  );
  const loadChartList = useStoreActions(
    (actions) => actions.charts.ChartGetList.fetch
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    loadChartList({
      token,
      storeInCrudData: true,
      filterString: `filter={"where":{"name":{"like":"${search}.*","options":"i"}},"order":"${sortBy.value}"}`,
    });
  }, [token, search, sortBy]);

  return (
    <React.Fragment>
      <div
        css={`
          width: 100%;
          gap: 8px;
          display: flex;
          padding: 12px 23px;
          position: relative;
          flex-direction: row;
          @media (min-width: 768px) and (max-width: 1090px) {
            flex-wrap: wrap;
            justify-content: flex-end;
          }
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            gap: 8px;
            width: 187px;
            height: 35px;
            background: #dfe3e6;
            border-radius: 24px;
            padding: 0 8px;
            @media (min-width: 768px) and (max-width: 1090px) {
              width: 100%;
            }
          `}
        >
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            data-cy="story-panel-chart-search-input"
            css={`
              width: 100%;
              height: 100%;
              border-style: none;
              background: transparent;
            `}
          />
          <SearchIcon htmlColor="#495057" />
        </div>
        <Button
          disableTouchRipple
          onClick={handleClick}
          css={`
            width: 159px;
            height: 35px;
            border-radius: 24px;
            background: #231d2c;
            text-transform: capitalize;
            padding-left: 16px;
            display: flex;
            svg {
              margin-left: 10px;
              transition: all 0.2s ease-in-out;
              transform: rotate(${anchorEl ? "180" : "0"}deg);
              > path {
                fill: #fff;
              }
            }
            @media (max-width: 768px) {
              justify-self: flex-end;
            }
          `}
        >
          <span
            css={`
              color: #fff;
              font-size: 14px;
              overflow: hidden;
              font-weight: 325;
              white-space: nowrap;
              text-overflow: ellipsis;
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            `}
          >
            Sort by {sortBy.label}
          </span>
          <KeyboardArrowDownIcon />
        </Button>
        <StyledMenu
          keepMounted
          anchorEl={anchorEl}
          id="breadcrumb-menu"
          onClose={handleClose}
          open={Boolean(anchorEl)}
        >
          {sortByOptions.map((option) => (
            <StyledMenuItem
              key={option.value}
              onClick={() => {
                setSortBy(option);
                handleClose();
              }}
            >
              {option.label}
            </StyledMenuItem>
          ))}
        </StyledMenu>
      </div>
      <div
        css={`
          gap: 18px;
          width: 100%;
          display: flex;
          overflow-y: auto;
          padding: 0px 23px;
          margin-top: 8px;
          margin-bottom: 16px;

          flex-direction: column;

          height: calc(100vh - 48px - 50px - 52px - 60px);
          max-height: calc(100vh - 48px - 50px - 52px - 60px);

          &::-webkit-scrollbar {
            width: 5px;
            border-radius: 6px;
            background: #231d2c;
          }
          &::-webkit-scrollbar-track {
            background: #f2f7fd;
          }
          &::-webkit-scrollbar-thumb {
            border-radius: 6px;
            background: #231d2c;
          }
        `}
      >
        <CreateChartCard
          headerDetails={props.headerDetails}
          framesArray={props.framesArray}
          storyName={props.storyName}
          onSave={props.onSave}
        />
        {chartList
          .filter((c) => c.isMappingValid)
          .map((chart, index) => (
            <ChartItem
              chartIndex={index}
              id={chart.id}
              key={chart.id}
              name={chart.name}
              vizType={chart.vizType}
              datasetId={chart.datasetId}
              createdDate={chart.createdDate}
              framesArray={props.framesArray}
              isAIAssistedChart={chart.isAIAssisted}
              elementType={
                (chart.vizType === "bigNumber"
                  ? StoryElementsType.BIG_NUMBER
                  : StoryElementsType.CHART) as "chart" | "bigNumber"
              }
            />
          ))}
      </div>
    </React.Fragment>
  );
}

function VideoFrame(props: {
  videoId: string;
  embedUrl: string;
  snippet: any;
  source: "youtube";
  thumbnail: string;
  title: string;
  description: string;
  ownerThumbnail: string;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "video",
    item: {
      type: "video",
      value: props,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [play, setPlay] = useState(false);

  return (
    <div
      css={css`
        height: 173.25px;
        position: relative;
        cursor: grab;
        ${isDragging && "cursor: grabbing;"}
        background-image: ${`url(${YoutubeGradient}),url(${props.thumbnail})`};
        background-position: top left, top left;
        background-repeat: no-repeat, no-repeat;
        background-size: contain, cover;
      `}
      ref={drag}
      onClick={() => setPlay(!play)}
      data-cy="video-frame"
    >
      {play ? (
        <>
          {" "}
          <iframe
            title="video player"
            src={props.embedUrl + "?autoplay=1"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            css={css`
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              border: none;
              box-shadow: none;
              pointer-events: none;
            `}
          ></iframe>{" "}
          <div
            css={css`
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
            `}
          ></div>
        </>
      ) : (
        <div
          css={css`
            position: absolute;
            left: 0;
            top: 0;
            display: flex;
            width: 100%;
            height: 100%;
            justify-content: center;
            align-items: center;
          `}
        >
          <div
            css={css`
              position: absolute;
              top: 7.11px;
              left: 7.11px;
              display: flex;
              column-gap: 6px;
            `}
          >
            <div
              css={css`
                width: 24px;
                height: 24px;
                border-radius: 9999px;
                overflow: hidden;
              `}
            >
              <img
                src={props.ownerThumbnail}
                alt="thumb"
                css={css`
                  height: 100%;
                  width: 100%;
                  object-fit: cover;
                `}
              />
            </div>
            <div
              css={css`
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                width: 250px;
                color: white;
                font-size: 10.662px;
                font-family: Roboto;
              `}
              dangerouslySetInnerHTML={{ __html: props.title }}
            ></div>
          </div>
          <div
            css={`
              cursor: pointer;
            `}
          >
            <YoutubeIcon />
          </div>
        </div>
      )}
    </div>
  );
}

function ImageFrame(props: {
  imageId: string;
  imageUrl: string;
  source: "shutterstock" | "unsplash";
  thumbnail: string;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "image",
    item: {
      type: "image",
      value: props,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      css={css`
        height: 173.25px;
        position: relative;
        cursor: grab;
        ${isDragging && "cursor: grabbing;"}
        background-image: ${`url(${props.thumbnail})`};
        background-position: top left;
        background-repeat: no-repeat;
        background-size: cover;
      `}
      ref={drag}
      data-cy="image-frame"
    ></div>
  );
}

function ElementItem(props: {
  leftIcon: JSX.Element;
  previewImg: string;
  elementType: string;
  name: string;
  disabled?: boolean;
  openTooltip?: boolean;
  setOpenTooltip?: React.Dispatch<React.SetStateAction<boolean>>;
  ItemDetails?: any[];
  setItemDetails?: React.Dispatch<React.SetStateAction<any[]>>;
  index?: number;
  description: string;
  draggable?: boolean;
  upgradeRequired?: boolean;
}) {
  const nullRef = React.useRef(null);

  const [dropDown, setDropDown] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const currentSourceOptions = { image: imageSources, video: videoSources };

  const [source, setSource] = React.useState(
    get(currentSourceOptions, props.elementType, [{}])[0]
  );

  const { data, loading, search } = useSearchMediaSources(
    source.value,
    props.elementType
  );

  const observerTarget = React.useRef(null);
  const { isObserved } = useInfinityScroll(observerTarget);

  // Pagination on scroll
  React.useEffect(() => {
    if (isObserved && data.length > 0) {
      search(searchValue, true);
    }
  }, [isObserved]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: props.elementType,
    item: {
      type: props.elementType,
      value: "",
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [isItemDragging, setIsItemDragging] = useRecoilState(
    isDividerOrRowFrameDraggingAtom
  );

  React.useEffect(() => {
    if (
      (props.elementType === StoryElementsType.DIVIDER ||
        props.elementType === StoryElementsType.ROWFRAME) &&
      isDragging !== isItemDragging.state
    ) {
      setIsItemDragging({
        state: isDragging,
        rowId: null,
      });
    }
  }, [isDragging]);

  const isImageElement = props.elementType === StoryElementsType.IMAGE;
  const isVideoElement = props.elementType === StoryElementsType.VIDEO;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useDebounce(
    () => {
      search(searchValue);
    },
    1000,
    [searchValue, props.elementType, source]
  );

  return (
    <div
      css={css`
        background: #dfe3e5;
        width: 90%;
        margin: 8px auto;
        border-radius: 8px;
        flex-shrink: 0;
        max-height: 70vh;
      `}
    >
      <Tooltip
        title={"Available soon"}
        placement="bottom-end"
        open={props.openTooltip}
        onClose={() => {
          if (props.ItemDetails && props.index) {
            props.setItemDetails?.((prev) => {
              const tempPrev = prev.map((item) => ({ ...item }));
              tempPrev[props.index as number].openTooltip = false;
              return [...tempPrev];
            });
          }
        }}
        onOpen={() => {
          if (props.disabled && props.ItemDetails && props.index) {
            props.setItemDetails?.((prev) => {
              const tempPrev = prev.map((item) => ({ ...item }));
              tempPrev[props.index as number].openTooltip = true;
              return [...tempPrev];
            });
          }
        }}
      >
        <div
          ref={isImageElement || isVideoElement ? nullRef : drag}
          data-cy={`story-panel-${props.elementType}-item`}
          id={props.name}
          data-testid={props.name}
          css={elementItemcss(
            props.disabled as boolean,
            isDragging,
            props.draggable,
            dropDown,
            props.upgradeRequired
          )}
          onClick={() => {
            if (props.disabled || props.upgradeRequired) return;
            setDropDown((prev) => !prev);
          }}
        >
          {props.leftIcon}
          <div>
            <b>{props.name}</b>
            <p>{props.description}</p>
          </div>
          {isImageElement || isVideoElement ? (
            <>
              <div
                css={`
                  position: absolute;
                  top: 20px;
                  right: 10px;
                  transition: transform 150ms ease-out;
                  transform: ${dropDown ? "rotate(180deg)" : "rotate(0deg)"};
                  width: 24px;
                  height: 24px;
                `}
              >
                <ArrowDropDownIcon />
              </div>
            </>
          ) : null}
        </div>
      </Tooltip>

      {isImageElement || isVideoElement ? (
        <div
          css={`
            ${dropDown ? "" : `height: 0px; overflow: hidden;`}
          `}
        >
          <div
            css={`
              padding: 0 8px 0 16px;
              margin-top: 25px;
            `}
          >
            <div
              css={css`
                display: flex;
                background-color: white;
                border-radius: 24px;
                padding-left: 16px;
                padding-right: 8.78px;
                align-items: center;
              `}
            >
              <input
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
                data-cy={`search-${props.elementType}-list`}
                css={`
                  outline: none;
                  height: 34px;
                  width: 100%;
                  border: none;
                `}
              />
              <SearchIcon htmlColor="#495057" />
            </div>

            <div
              css={css`
                margin-top: 15px;
                margin-left: auto;
                width: max-content;
              `}
            >
              <Button
                disableTouchRipple
                onClick={handleClick}
                css={`
                  width: 159px;
                  height: 35px;
                  border-radius: 24px;
                  background: #231d2c;
                  text-transform: capitalize;
                  padding: 0 16px;
                  display: flex;
                  justify-content: space-between;

                  svg {
                    margin-left: 10px;
                    transition: all 0.2s ease-in-out;
                    transform: rotate(${anchorEl ? "180" : "0"}deg);
                    > path {
                      fill: #fff;
                    }
                  }
                `}
              >
                <span
                  css={`
                    color: #fff;
                    font-size: 14px;
                    overflow: hidden;
                    font-weight: 325;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-family: "GothamNarrow-Book", "Helvetica Neue",
                      sans-serif;
                  `}
                >
                  {source.label}
                </span>
                <KeyboardArrowDownIcon />
              </Button>
              <StyledMenu
                keepMounted
                anchorEl={anchorEl}
                id="breadcrumb-menu"
                onClose={handleClose}
                open={Boolean(anchorEl)}
              >
                {get(currentSourceOptions, props.elementType, [{}]).map(
                  (option: any) => (
                    <StyledMenuItem
                      key={option.value}
                      onClick={() => {
                        setSource(option);
                        handleClose();
                      }}
                    >
                      {option.label}
                    </StyledMenuItem>
                  )
                )}
              </StyledMenu>
            </div>

            <div
              css={css`
                margin-top: 21px;
                display: grid;
                row-gap: 25.75px;
                max-height: 40vh;
                overflow-y: scroll;
                padding-bottom: 15px;
              `}
            >
              {data?.map((d, i) =>
                props.elementType === "video" ? (
                  <VideoFrame
                    embedUrl={d.embedUrl}
                    videoId={d.videoId}
                    key={d.videoId}
                    snippet={d.snippet}
                    source={d.source}
                    thumbnail={d.thumbnail}
                    title={d.title}
                    description={d.description}
                    ownerThumbnail={d.ownerThumbnail}
                  />
                ) : (
                  <ImageFrame
                    imageUrl={d.imageUrl}
                    imageId={d.imageId}
                    key={d.imageId}
                    thumbnail={d.thumbnail}
                    source={d.source}
                  />
                )
              )}
              {loading
                ? Array(4)
                    .fill(null)
                    .map((_d, index: number) => (
                      <Skeleton
                        animation="wave"
                        variant="rect"
                        width="100%"
                        height="173.25px"
                        key={`${index}-skeleton`}
                      />
                    ))
                : null}
              <div
                css={`
                  height: 1px;
                `}
                ref={observerTarget}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CreateChartCard(props: {
  storyName: string;
  headerDetails: IHeaderDetails;
  framesArray: IFramesArray[];
  onSave: (type: "create" | "edit") => Promise<void>;
}) {
  const history = useHistory();

  const setIsAiSwitchActive = useSetRecoilState(isChartAIAgentActive);

  const { page, view } = useParams<{
    page: string;
    view: string;
  }>();

  const setDataset = useStoreActions(
    (actions) => actions.charts.dataset.setValue
  );
  const setLoadedChart = useStoreActions(
    (state) => state.charts.ChartGet.setCrudData
  );
  const setCreateChartData = useStoreActions(
    (state) => state.charts.ChartCreate.setCrudData
  );

  const setChartFromStory = useRecoilState(chartFromStoryAtom)[1];

  const action = () => {
    setChartFromStory({
      state: true,
      view,
      page,
      action: "create",
      chartId: null,
    });
    setIsAiSwitchActive(true);
    setDataset(null);
    setLoadedChart(null);
    setCreateChartData(null);
    //save story before exiting
    props.onSave("edit");
    history.push("/chart/new/data");
  };
  return (
    <div>
      <div
        onClick={action}
        data-testid="create-chart-card"
        data-cy="story-panel-create-chart-card"
        css={`
          background: #f2f7fd;
          box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
          height: 125px;
          padding-left: 27px;
          display: flex;
          justify-content: flex-start;
          gap: 12px;
          align-items: center;
          position: relative;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
        `}
      >
        <div>
          <AddNewImage />
        </div>
        <div
          css={`
            border: 1px solid #231d2c;
            height: 49px;
            width: 0px;
          `}
        />

        <div
          css={`
            h1 {
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              color: #262c34;
              font-size: 18px;
              line-height: 20px;
              margin: 0;
              font-weight: bold;
            }
            p {
              font-family: "GothamNarrow", "Helvetica Neue", sans-serif;
              color: #495057;
              font-size: 10px;
              line-height: 15px;
              letter-spacing: 0.5px;
              margin: 0;
              margin-top: 4px;
            }
          `}
        >
          <h1>New chart</h1>
          <p>Create a new chart in your library</p>
        </div>
      </div>
    </div>
  );
}

function ChartItem(
  props: Readonly<{
    id: string;
    chartIndex: number;
    name: string;
    vizType: string;
    datasetId: string;
    createdDate: string;
    elementType: "chart" | "bigNumber";
    framesArray: IFramesArray[];
    isAIAssistedChart: boolean;
  }>
) {
  const nullRef = React.useRef(null);
  const [chartPreview, setChartPreview] = React.useState(false);
  const chartFromStory = useRecoilValue(chartFromStoryAtom);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: props.elementType,
    item: {
      type: props.elementType,
      value: props.id,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const getIcon = (vizType: string) => {
    const type = find(Charts, { id: vizType });
    if (type) {
      return type.icon;
    }
    return Charts[0].icon;
  };

  let added = false;
  for (let i = 0; i < props.framesArray.length; i++) {
    if (props.framesArray[i].content.includes(props.id)) {
      added = true;
    }
  }

  const setIsChartDragging = useRecoilState(isChartDraggingAtom)[1];

  React.useEffect(() => {
    if (isDragging && !added) {
      setIsChartDragging(props.elementType);
    } else {
      setIsChartDragging(null);
    }
  }, [isDragging]);

  return (
    <div
      ref={added ? nullRef : drag}
      id={`chart-${props.chartIndex}`}
      data-testid={props.chartIndex === 0 ? "chart-0" : "chart-n"}
      className={
        props.chartIndex === 0 &&
        chartFromStory.action === "create" &&
        chartFromStory.chartId === props.id
          ? "rhcpCard"
          : ""
      }
      css={`
        width: 100%;
        font-size: 12px;
        background: #fff;
        user-select: none;
        cursor: ${added ? "auto" : "grab"};

        ${!added &&
        `&:hover {
          box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.25);
        }`}

        > div {
          width: 100%;
        }
      `}
      data-cy="story-panel-chart-item"
    >
      <GridItem
        id={props.id}
        path={props.name}
        title={props.name}
        date={props.createdDate}
        viz={getIcon(props.vizType)}
        added={added}
        chartPreview={chartPreview}
        setChartPreview={setChartPreview}
        isAIAssistedChart={props.isAIAssistedChart}
        descr="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
    </div>
  );
}

function EditHeaderPanelView(props: Props) {
  const [_, setCurrentView] = useRecoilState(storyRightPanelViewAtom);
  const [displayColorsList, setDisplayColorsList] = React.useState(true);
  return (
    <div
      data-cy="edit-header-panel"
      css={`
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        background: #f1f3f5;
      `}
    >
      <div
        css={`
          width: 100%;
          height: 78px;
          padding: 0 25px;
        `}
      >
        <div
          css={`
            display: flex;

            align-items: center;
            justify-content: space-between;
            font-weight: bold;
            > svg {
              margin-right: 25px;
            }
            border-bottom: 1px solid #dfe3e5;
            width: 99%;
            height: 100%;
            margin: auto;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
              gap: 12px;
            `}
          >
            <EditHeaderIcon />
            Edit the story header
          </div>
          <span>
            <IconButton
              css={`
                color: #262c34;
              `}
              onClick={() => {
                setCurrentView("charts");
              }}
              data-cy="edit-header-panel-close"
            >
              <Close color="inherit" />
            </IconButton>
          </span>
        </div>
      </div>
      <div
        css={`
          padding: 0 25px;
          margin-top: 10px;
        `}
      >
        <div
          css={`
            padding: 16px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            svg {
              transform: rotate(${displayColorsList ? "180" : "0"}deg);
            }
          `}
        >
          Colors
          <IconButton
            css={`
              color: #262c34;
            `}
            onClick={() => {
              setDisplayColorsList(!displayColorsList);
            }}
          >
            <ArrowDropUpIcon color="inherit" />
          </IconButton>
        </div>
        {displayColorsList && (
          <div
            css={`
              > label {
                --bs-gutter-x: 0;
                padding: 12px 5px;
              }

              #inline-color-picker-popover {
                right: 0;
              }
            `}
          >
            <ChartOptionColor
              isEnabled
              error={false}
              value={props.headerDetails.backgroundColor}
              default={props.headerDetails.backgroundColor}
              onChange={(value: string) => {
                props.setHeaderDetails({
                  ...props.headerDetails,
                  backgroundColor: value,
                });
              }}
              label="Background color"
            />
            <ChartOptionColor
              isEnabled
              error={false}
              value={props.headerDetails.titleColor}
              default={props.headerDetails.titleColor}
              onChange={(value: string) => {
                props.setHeaderDetails({
                  ...props.headerDetails,
                  titleColor: value,
                });
              }}
              label="Title color"
            />
            <ChartOptionColor
              isEnabled
              error={false}
              value={props.headerDetails.descriptionColor}
              default={props.headerDetails.descriptionColor}
              onChange={(value: string) => {
                props.setHeaderDetails({
                  ...props.headerDetails,
                  descriptionColor: value,
                });
              }}
              label="Description color"
            />
          </div>
        )}
      </div>
    </div>
  );
}
