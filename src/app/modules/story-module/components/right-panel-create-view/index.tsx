/* third-party */
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import {
  storyRightPanelViewAtom,
  chartFromStoryAtom,
} from "app/state/recoil/atoms";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
/* project */
import { IFramesArray } from "app/modules/story-module/views/create/data";
import TextPreviewImg from "app/modules/story-module/asset/textPreview.svg";
import DividerPreviewImg from "app/modules/story-module/asset/dividerPreview.svg";
import RowFramePreviewImg from "app/modules/story-module/asset/rowframePreview.svg";
import { ReactComponent as DividerIcon } from "app/modules/story-module/asset/dividerIcon.svg";

import { ReactComponent as VideoIcon } from "app/modules/story-module/asset/video-icon.svg";
import { ReactComponent as RowframeIcon } from "app/modules/story-module/asset/rowframe-icon.svg";
import PanelLabel from "app/modules/story-module/components/right-panel-create-view/panelLabel";
import { IHeaderDetails } from "app/modules/story-module/components/right-panel/data";
import { useCheckUserPlan } from "app/hooks/useCheckUserPlan";
import ChartList from "./chartList";
import ElementItem from "./elementItem";
import EditHeaderPanelView from "./editHeaderPanelView";
import { UpgradeCard } from "./upgradeCard";
import PanelNavbar from "./panelNavbar";

export interface StoryRightPanelCreateViewProps {
  showHeaderItem: boolean;
  headerDetails: IHeaderDetails;
  setHeaderDetails: React.Dispatch<React.SetStateAction<IHeaderDetails>>;
  framesArray: IFramesArray[];
  storyName: string;
  onSave: (type: "create" | "edit") => Promise<void>;
}

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

export const sortByOptions = [
  { value: "createdDate desc", label: "Recent Descending" },
  { value: "createdDate asc", label: "Recent Ascending" },
  { value: "name desc", label: "Name Descending" },
  { value: "name asc", label: "Name Ascending" },
];

export function StoryRightPanelCreateView(
  props: Readonly<StoryRightPanelCreateViewProps>
) {
  const [currentView, setCurrentView] = useRecoilState(storyRightPanelViewAtom);
  const [_chartFromStory, setChartFromStory] =
    useRecoilState(chartFromStoryAtom);
  const { userPlan } = useCheckUserPlan();
  const [open, setOpen] = useState(true);
  const elementItemDetails = [
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
  ];

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
      <PanelNavbar currentView={currentView} setCurrentView={setCurrentView} />

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
          {elementItemDetails.map((item, index) => (
            <ElementItem
              key={`${item.elementType}-${index}`}
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
        <ChartList
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
              key={`${item.elementType}-${index}`}
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
