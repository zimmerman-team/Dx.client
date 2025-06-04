import React, { useRef, useState } from "react";
import { IconButton } from "@material-ui/core";
import { RichEditor } from "app/modules/common/RichEditor";
import {
  isChartDraggingAtom,
  chartFromStoryAtom,
  storyContentContainerWidth,
  storyContentIsResizingAtom,
} from "app/state/recoil/atoms";
import { EditorState } from "draft-js";
import get from "lodash/get";
import { NumberSize, Resizable } from "re-resizable";
import { useLocation, useHistory, useParams } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import { useDebounce } from "react-use";
import { Direction } from "re-resizable/lib/resizer";
import { useRecoilValue, useRecoilState } from "recoil";
import { css } from "styled-components";
import { Updater } from "use-immer";
import { useMediaQuery } from "usehooks-ts";
import { IFramesArray } from "app/modules/story-module/views/create/data";
import { StoryChartWrapper } from "app/modules/story-module/components/chart-wrapper";
import { StoryElementsType } from "app/modules/story-module/components/right-panel-create-view";
import { ToolbarPluginsType } from "app/modules/story-module/components/storySubHeaderToolbar/staticToolbar";
import { useDrop } from "react-dnd";
import { useStoreActions } from "app/state/store/hooks";
import { ReactComponent as EditIcon } from "app/modules/story-module/asset/editIcon.svg";
import { ReactComponent as DeleteIcon } from "app/modules/story-module/asset/deleteIcon.svg";
import { decorators } from "app/modules/common/RichEditor/decorators";
import { MIN_BOX_WIDTH } from "./data";

// Types
interface BoxProps {
  initialWidth: number;
  initialHeight: number;
  rowId: string;
  rowIndex: number;
  itemIndex: number;
  rowType: string;
  setPlugins?: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
  updateFramesArray: Updater<IFramesArray[]>;
  rowItemsCount: number;
  previewItem?: string | any;
  neighbourIndex: number;
  rowContentWidths: number[];
  temporaryWidths: {
    [key: string]: number;
  };
  setTemporaryWidths: React.Dispatch<
    React.SetStateAction<{
      [key: string]: number;
    }>
  >;
  onSave: (type: "create" | "edit") => Promise<void>;
  onRowBoxItemResize: (
    rowId: string,
    itemIndex: number,
    width: number,
    height: number
  ) => void;
  last?: boolean;
  tempHeight: number;
}

// Content type definition
type ContentType = "chart" | "text" | "image" | "video" | null;

// eslint-disable-next-line sonarjs/cognitive-complexity
const Box = (props: BoxProps) => {
  // Hooks
  const location = useLocation();
  const history = useHistory();
  const { page, view } = useParams<{ page: string; view: string }>();
  const smScreen = useMediaQuery("(max-width: 767px)");

  // Store actions
  const setDataset = useStoreActions(
    (actions) => actions.charts.dataset.setValue
  );
  const setLoadedChart = useStoreActions(
    (state) => state.charts.ChartGet.setCrudData
  );
  const setCreateChartData = useStoreActions(
    (state) => state.charts.ChartCreate.setCrudData
  );
  const resetMapping = useStoreActions(
    (actions) => actions.charts.mapping.reset
  );

  // Recoil state
  const isChartDragging = useRecoilValue(isChartDraggingAtom);
  const [, setChartFromStory] = useRecoilState(chartFromStoryAtom);
  const containerWidth = useRecoilValue(storyContentContainerWidth);
  const [isResizing, setIsResizing] = useRecoilState(
    storyContentIsResizingAtom
  );

  // Local state
  const [chartError, setChartError] = useState(false);
  const [chartId, setChartId] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<ContentType>(null);
  const [maxWidth, setMaxWidth] = useState(props.initialWidth);
  const [textContent, setTextContent] = useState<EditorState>(
    EditorState.createEmpty(decorators())
  );
  const [displayBoxIcons, setDisplayBoxIcons] = useState(false);
  const [videoContent, setVideoContent] = useState<{
    videoId: string;
    embedUrl: string;
    snippet: any;
    source: "youtube";
  }>();
  const [imageContent, setImageContent] = useState<{
    imageId: string;
    imageUrl: string;
    source: "shutterstock";
    thumbnail: string;
  }>();

  const placeholder = "Add your story...";
  const [textPlaceholderState, setTextPlaceholderState] =
    useState<string>(placeholder);

  // Refs
  const textResizableRef = useRef<HTMLDivElement>(null);
  const firstUpdate = useRef(true);

  // Derived state
  const editorHeight = textResizableRef.current?.offsetHeight;
  const viewOnlyMode =
    location.pathname === `/story/${page}` ||
    location.pathname === `/story/${page}/downloaded-view`;

  // Element types for drag and drop
  const elementTypes = [
    StoryElementsType.TEXT,
    StoryElementsType.BIG_NUMBER,
    StoryElementsType.CHART,
    StoryElementsType.IMAGE,
    StoryElementsType.VIDEO,
  ];

  // Functions
  const handleEditChart = () => {
    setChartFromStory({
      state: true,
      view,
      page,
      action: "edit",
      chartId: null,
    });

    // Reset chart-related state
    setDataset(null);
    setLoadedChart(null);
    setCreateChartData(null);
    resetMapping();

    // Save story before exiting
    props.onSave("edit");
    history.push(`/chart/${chartId}/mapping`);
  };

  const handleRowFrameItemAddition = (
    rowId: string,
    itemIndex: number,
    itemContent: string | any,
    itemContentType: "text" | "divider" | "chart" | "image" | "video",
    textHeight?: number
  ) => {
    props.updateFramesArray((draft) => {
      const frameId = draft.findIndex((frame) => frame.id === rowId);
      if (frameId === -1) return [...draft];

      draft[frameId].content[itemIndex] = itemContent;
      draft[frameId].contentTypes[itemIndex] = itemContentType;
      draft[frameId].textEditorHeights[itemIndex] = textHeight || 0;

      // Only increase height of textbox if needed
      if (textHeight && textHeight > draft[frameId].contentHeights[itemIndex]) {
        draft[frameId].contentHeights.forEach((_, index) => {
          draft[frameId].contentHeights[index] = textHeight;
        });
      }
    });
  };

  const handleRowFrameItemRemoval = (rowId: string, itemIndex: number) => {
    props.updateFramesArray((draft) => {
      const frameId = draft.findIndex((frame) => frame.id === rowId);
      if (frameId === -1) return [...draft];

      draft[frameId].content[itemIndex] = null;
      draft[frameId].contentTypes[itemIndex] = null;
    });
  };

  const resetContent = () => {
    setDisplayMode(null);
    setChartId(null);
    setTextContent(EditorState.createEmpty(decorators()));
    handleRowFrameItemRemoval(props.rowId, props.itemIndex);
  };

  // Handle resize events
  const onResizeStart = (
    _e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
    _dir: Direction,
    _elementRef: HTMLElement
  ) => {
    const neighborWidth = props.rowContentWidths[props.neighbourIndex];
    const minWidthPercentage = (MIN_BOX_WIDTH / containerWidth) * 100;
    setMaxWidth(props.initialWidth + neighborWidth - minWidthPercentage);
  };
  const onResizeStop = (
    _event: MouseEvent | TouchEvent,
    _direction: Direction,
    elementRef: HTMLElement,
    _delta: NumberSize
  ) => {
    const newWidth = elementRef.offsetWidth;
    const newHeight = elementRef.offsetHeight;
    props.onRowBoxItemResize(props.rowId, props.itemIndex, newWidth, newHeight);
    setIsResizing(false);
    props.setTemporaryWidths({});
    setMaxWidth(newWidth);
  };

  const onResize = (
    _event: MouseEvent | TouchEvent,
    _direction: Direction,
    elementRef: HTMLElement,
    _delta: NumberSize
  ) => {
    setIsResizing(true);

    // Get current width of the element being resized
    const newWidth = elementRef.offsetWidth;

    // Get container width
    const contentContainer = document.getElementById("content-container");
    if (!contentContainer) return;
    const containerWidth = contentContainer.offsetWidth;

    // Calculate percentage and deltas
    const percentage = (newWidth / containerWidth) * 100;
    const originalWidth = props.rowContentWidths[props.itemIndex];
    const originalNeighborWidth = props.rowContentWidths[props.neighbourIndex];
    const widthDelta = percentage - originalWidth;
    const newNeighborWidth = originalNeighborWidth - widthDelta;

    // Minimum width check (MIN_BOX_WIDTHpx)
    const minWidthPercentage = (MIN_BOX_WIDTH / containerWidth) * 100;

    // Update temporary widths if both are above minimum
    if (
      percentage >= minWidthPercentage &&
      newNeighborWidth >= minWidthPercentage
    ) {
      props.setTemporaryWidths({
        [props.itemIndex]: percentage,
        [props.neighbourIndex]: newNeighborWidth,
      });
    }
  };

  // Drag and drop configuration
  const [{ isOver }, drop] = useDrop(() => ({
    accept:
      props.rowType === "oneByFive" || props.rowType === "oneByFour"
        ? elementTypes
        : elementTypes.filter((type) => type !== StoryElementsType.BIG_NUMBER),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      item: monitor.getItem(),
    }),
    drop: (item: any, monitor) => {
      if (item.type === StoryElementsType.TEXT) {
        handleRowFrameItemAddition(
          props.rowId,
          props.itemIndex,
          textContent,
          "text"
        );
        setDisplayMode("text");
      } else if (
        item.type === StoryElementsType.CHART ||
        item.type === StoryElementsType.BIG_NUMBER
      ) {
        handleRowFrameItemAddition(
          props.rowId,
          props.itemIndex,
          item.value,
          "chart"
        );
        setChartId(item.value);
        setDisplayMode("chart");
        monitor.getDropResult();
      } else if (item.type === StoryElementsType.VIDEO) {
        handleRowFrameItemAddition(
          props.rowId,
          props.itemIndex,
          item.value,
          "video"
        );
        setVideoContent(item.value);
        setDisplayMode("video");
      } else if (item.type === StoryElementsType.IMAGE) {
        handleRowFrameItemAddition(
          props.rowId,
          props.itemIndex,
          item.value,
          "image"
        );
        setImageContent(item.value);
        setDisplayMode("image");
      }
    },
  }));

  const widthNumberPercentage =
    isResizing && props.temporaryWidths[props.itemIndex] !== undefined
      ? props.temporaryWidths[props.itemIndex]
      : props.initialWidth;

  // Width calculation
  const width = `${widthNumberPercentage}%`;

  // CSS constants
  const cursorDefault = "cursor: default;";

  // Debounced text content update
  useDebounce(
    () => {
      if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }

      if (displayMode === "text") {
        handleRowFrameItemAddition(
          props.rowId,
          props.itemIndex,
          textContent,
          "text",
          editorHeight
        );
      }
    },
    300,
    [textContent, editorHeight]
  );

  // Effects
  React.useEffect(() => {
    if (displayMode === "chart" && chartId) {
      handleRowFrameItemAddition(
        props.rowId,
        props.itemIndex,
        chartId,
        "chart"
      );
    } else if (displayMode === "video") {
      handleRowFrameItemAddition(
        props.rowId,
        props.itemIndex,
        videoContent,
        "video"
      );
    } else if (displayMode === "image") {
      handleRowFrameItemAddition(
        props.rowId,
        props.itemIndex,
        imageContent,
        "image"
      );
    }
  }, [chartId, displayMode, imageContent, videoContent]);

  React.useEffect(() => {
    if (props.previewItem) {
      if (typeof props.previewItem === "string") {
        setChartId(props.previewItem);
        setDisplayMode("chart");
      } else if (get(props.previewItem, "embedUrl", null)) {
        setVideoContent(props.previewItem);
        setDisplayMode("video");
      } else if (get(props.previewItem, "imageUrl", null)) {
        setImageContent(props.previewItem);
        setDisplayMode("image");
      } else {
        setTextContent(props.previewItem);
        setDisplayMode("text");
      }
    }
  }, [props.previewItem]);

  // Determine border style based on drag state
  let border = "none";
  if (isOver) {
    border = "1px solid #231d2c";
  } else if (isChartDragging === "bigNumber" && props.rowType === "oneByFive") {
    border = "1px dashed #231d2c";
  } else if (isChartDragging === "chart" && props.rowType !== "oneByFive") {
    border = "1px dashed #231d2c";
  }

  const resolvedHeight =
    viewOnlyMode && smScreen && displayMode === "text"
      ? `${editorHeight ?? props.initialHeight}px`
      : props.tempHeight > 0
      ? `${props.tempHeight}px`
      : `${props.initialHeight}px`;

  // Common resizable props
  const getResizableProps = () => ({
    grid: [5, 5] as [number, number],
    onResizeStart,
    onResize,
    onResizeStop,
    size: {
      width: smScreen ? "100%" : width,
      height: resolvedHeight,
    },
    maxWidth: !viewOnlyMode
      ? `${
          maxWidth > widthNumberPercentage ? maxWidth : widthNumberPercentage
        }%`
      : undefined,
    minWidth: MIN_BOX_WIDTH,
    enable: {
      right: !viewOnlyMode && !props.last,
      bottomRight: !viewOnlyMode && !props.last,
      left: !!props.last && !viewOnlyMode,
    },
  });

  // Action buttons for content types
  const renderActionButtons = () => {
    if (viewOnlyMode || !displayBoxIcons) return null;

    return (
      <>
        <IconButton
          onClick={resetContent}
          css={`
            top: 12px;
            z-index: 1;
            right: 12px;
            position: absolute;
            padding: 4px;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: #adb5bd;

            :hover {
              background: #adb5bd;
              svg {
                path {
                  fill: #fff;
                }
              }
            }
          `}
          data-cy="delete-item-button"
        >
          <Tooltip title="Delete">
            <DeleteIcon />
          </Tooltip>
        </IconButton>

        {displayMode === "chart" && !chartError && (
          <IconButton
            onClick={handleEditChart}
            data-cy="edit-chart-button"
            css={`
              top: 12px;
              z-index: 1;
              right: 39px;
              position: absolute;
              padding: 4px;
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background: #adb5bd;
              :hover {
                background: #adb5bd;
                svg {
                  path {
                    fill: #fff;
                  }
                }
              }
            `}
          >
            <Tooltip title="Edit Chart">
              <EditIcon />
            </Tooltip>
          </IconButton>
        )}
      </>
    );
  };

  // Render content based on display mode
  const renderContent = () => {
    switch (displayMode) {
      case "text":
        return (
          <Resizable
            {...getResizableProps()}
            css={`
              background: #fff;
              overflow: hidden;
              position: relative;
              @media (max-width: 600px) {
                border-radius: 10px;
                box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
              }
              div {
                ${viewOnlyMode && cursorDefault}
              }
            `}
          >
            <div
              ref={textResizableRef}
              onMouseEnter={() => setDisplayBoxIcons(true)}
              onMouseLeave={() => setDisplayBoxIcons(false)}
              data-cy={`row-frame-text-item`}
            >
              {renderActionButtons()}
              <RichEditor
                fullWidth
                editMode={!viewOnlyMode}
                textContent={textContent}
                setTextContent={setTextContent}
                setPlugins={props.setPlugins}
                placeholder={placeholder}
                setPlaceholderState={setTextPlaceholderState}
                placeholderState={textPlaceholderState}
                testId="story-rich-text-editor"
              />
            </div>
          </Resizable>
        );

      case "chart":
        return chartId ? (
          <Resizable key={chartId} {...getResizableProps()}>
            <div
              css={`
                height: 100%;
                position: relative;
                padding: ${props.rowType === "oneByFive" ? "0" : "24px"};
                background: #fff;
                @media (max-width: 600px) {
                  border-radius: 10px;
                  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
                }
              `}
              onMouseEnter={() => setDisplayBoxIcons(true)}
              onMouseLeave={() => setDisplayBoxIcons(false)}
              onFocus={() => setDisplayBoxIcons(true)}
              onBlur={() => setDisplayBoxIcons(false)}
              data-cy={`row-frame-chart-item-${props.rowIndex}-${props.itemIndex}`}
            >
              {renderActionButtons()}
              <StoryChartWrapper
                id={chartId}
                width={width.slice(0, -2)}
                error={chartError}
                setError={setChartError}
              />
            </div>
          </Resizable>
        ) : null;

      case "video":
        return (
          <Resizable
            {...getResizableProps()}
            css={`
              background: #fff;
              overflow: hidden;
              position: relative;
              @media (max-width: 600px) {
                border-radius: 10px;
                box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
              }
              div {
                ${viewOnlyMode && cursorDefault}
              }
            `}
          >
            <div
              onMouseEnter={() => setDisplayBoxIcons(true)}
              onMouseLeave={() => setDisplayBoxIcons(false)}
              data-cy={`row-frame-video-item-${props.rowIndex}-${props.itemIndex}`}
            >
              {renderActionButtons()}
              <iframe
                title="Video Content"
                src={videoContent?.embedUrl}
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
                `}
                data-cy="story-video-content"
              ></iframe>
            </div>
          </Resizable>
        );

      case "image":
        return (
          <Resizable
            {...getResizableProps()}
            css={`
              background: #fff;
              overflow: hidden;
              position: relative;
              @media (max-width: 600px) {
                border-radius: 10px;
                box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
              }
              div {
                ${viewOnlyMode && cursorDefault}
                height: 100%;
              }
            `}
          >
            <div
              onMouseEnter={() => setDisplayBoxIcons(true)}
              onMouseLeave={() => setDisplayBoxIcons(false)}
              data-cy={`row-frame-image-item-${props.rowIndex}-${props.itemIndex}`}
            >
              {renderActionButtons()}
              <img
                src={imageContent?.imageUrl}
                alt={imageContent?.imageId}
                css={css`
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                `}
                data-cy="story-image-content"
              />
            </div>
          </Resizable>
        );

      default:
        return (
          <Resizable {...getResizableProps()}>
            <div
              css={`
                width: 100%;
                border: ${border};
                background: ${viewOnlyMode ? "transparent" : "#dfe3e6"};
                height: 100%;
              `}
              ref={drop}
              data-cy={`row-frame-item-drop-zone-${props.rowIndex}-${props.itemIndex}`}
            >
              <p
                css={`
                  margin: 0;
                  width: 100%;
                  height: 100%;
                  padding: 24px;
                  color: #495057;
                  font-size: 14px;
                  font-weight: 400;
                  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                  text-align: center;
                  align-items: center;
                  justify-content: center;
                  display: ${viewOnlyMode ? "none" : "flex"};
                `}
              >
                {isOver ? "Release to drop" : "Drag and drop content here"}
              </p>
            </div>
          </Resizable>
        );
    }
  };

  return renderContent();
};

export default Box;
