import React, { useRef, useState } from "react";
import get from "lodash/get";
import { useDrop } from "react-dnd";
import { useDebounce } from "react-use";
import { useOnClickOutside } from "usehooks-ts";
import Tooltip from "@material-ui/core/Tooltip";
import { NumberSize, Resizable } from "re-resizable";
import { Direction } from "re-resizable/lib/resizer";
import IconButton from "@material-ui/core/IconButton";
import { EditorState } from "draft-js";
import { useStoreActions } from "app/state/store/hooks";
import { useRecoilState, useRecoilValue } from "recoil";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { RichEditor } from "app/modules/common/RichEditor";
import { StoryChartWrapper } from "app/modules/story-module/components/chart-wrapper";
import { ReactComponent as EditIcon } from "app/modules/story-module/asset/editIcon.svg";
import { ReactComponent as RedoIcon } from "app/modules/story-module/asset/redo-icon.svg";
import { ReactComponent as DeleteIcon } from "app/modules/story-module/asset/deleteIcon.svg";
import { StoryElementsType } from "app/modules/story-module/components/right-panel-create-view";
import {
  chartFromStoryAtom,
  storyContentIsResizingAtom,
  storyContentContainerWidth,
  isChartDraggingAtom,
} from "app/state/recoil/atoms";
import { IFramesArray } from "app/modules/story-module/views/create/data";
import { ToolbarPluginsType } from "app/modules/story-module/components/storySubHeaderToolbar/staticToolbar";
import { css } from "styled-components";
import { Updater } from "use-immer";
import { useMediaQuery } from "@material-ui/core";
import { rowStructureHeights } from "./data";
import { usehandleRowFrameItemResize } from "app/hooks/useHandleRowFrameItemResize";
import { TABLET_STARTPOINT } from "app/theme";

interface RowStructureDisplayProps {
  gap: string;
  height: number;
  tabletHeight: number;
  rowIndex: number;
  rowId: string;
  selectedType: string;
  framesArray: IFramesArray[];
  selectedTypeHistory: string[];
  rowContentWidths: number[];
  rowContentHeights: number[];
  updateFramesArray: Updater<IFramesArray[]>;
  deleteFrame: (id: string) => void;
  setSelectedTypeHistory: React.Dispatch<React.SetStateAction<string[]>>;
  rowStructureDetailItems: {
    rowId: string;
    width: number;
    factor: number;
    rowType: string;
  }[];
  previewItems?: (string | object)[];
  onRowBoxItemResize: (
    rowId: string,
    itemIndex: number,
    width: number,
    height: number
  ) => void;
  setPlugins: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
  onSave: (type: "create" | "edit") => Promise<void>;
  forceSelectedType: string | undefined;
  setTempRowState: React.Dispatch<React.SetStateAction<IFramesArray>>;
  rightPanelOpen: boolean;
}

export default function RowstructureDisplay(
  props: Readonly<RowStructureDisplayProps>
) {
  const isTablet = useMediaQuery("(max-width: 1110px)");
  const RIGHT_PANEL_WIDTH = isTablet ? "36.83%" : "400px"; //percentage value of 274px which is the width at 744px as per design
  const ref = useRef(null);
  useOnClickOutside(ref, () => setHandleDisplay(false));
  const location = useLocation();
  const { page } = useParams<{ page: string }>();
  const [handleDisplay, setHandleDisplay] = React.useState(false);
  const boxHeight = isTablet ? props.tabletHeight : props.height;
  const viewOnlyMode =
    location.pathname === `/story/${page}` ||
    location.pathname === `/story/${page}/downloaded-view`;

  const { handleRowHeightResize } = usehandleRowFrameItemResize(
    props.updateFramesArray
  );

  const [_isResizing, setIsResizing] = useRecoilState(
    storyContentIsResizingAtom
  );

  const handlers = viewOnlyMode
    ? {}
    : {
        onMouseEnter: () => {
          setHandleDisplay(true);
        },
      };

  const resetRowSizes = () => {
    const getHeight = (structure: string) => {
      const heights =
        rowStructureHeights[structure as keyof typeof rowStructureHeights];
      return isTablet ? heights.tabletHeight : heights.height;
    };

    const rowSizes = [
      {
        type: "oneByOne",
        width: [100],
        height: getHeight("oneByOne"),
      },
      {
        type: "oneByTwo",
        width: [50, 50],
        height: getHeight("oneByTwo"),
      },
      {
        type: "oneByThree",
        width: [33.33, 33.33, 33.33],
        height: getHeight("oneByThree"),
      },
      {
        type: "oneByFour",
        width: [25, 25, 25, 25],
        height: getHeight("oneByFour"),
      },
      {
        type: "oneByFive",
        width: [20, 20, 20, 20, 20],
        height: getHeight("oneByFive"),
      },
    ];
    props.updateFramesArray((draft) => {
      const rowStructure = draft[props.rowIndex].structure;
      const defaultWidths =
        rowSizes.find((row) => row.type === rowStructure)?.width ?? [];
      const defaultHeights =
        rowSizes.find((row) => row.type === rowStructure)?.height ?? [];
      draft[props.rowIndex].contentWidths = defaultWidths;
      draft[props.rowIndex].contentHeights = defaultHeights;
    });
  };

  const border =
    !viewOnlyMode && handleDisplay
      ? "0.722415px dashed  #ADB5BD"
      : "0.722415px dashed transparent";

  const onResize = () => {
    setIsResizing(true);
  };

  const onResizeStop = (
    _event: MouseEvent | TouchEvent,
    _direction: Direction,
    elementRef: HTMLElement,
    _delta: NumberSize
  ) => {
    let newHeight = elementRef.offsetHeight;
    handleRowHeightResize(props.rowId, newHeight);
    setIsResizing(false);
  };

  return (
    <div
      ref={ref}
      css={`
        width: 100%;
        height: 100%;
        position: relative;
        margin-bottom: ${!viewOnlyMode ? "0px" : "16px"};
      `}
    >
      <div
        {...handlers}
        css={`
          width: 100%;
          height: 100%;
        `}
      >
        {handleDisplay && (
          <div
            css={`
              width: 32px;
              left: -3rem;
              display: flex;
              position: absolute;
              height: calc(100% + 8px);
              @media (min-width: 760px) and (max-width: 1100px) {
                left: 12px;
                z-index: 1;
              }
            `}
          >
            <div
              css={`
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
              `}
            >
              <div
                css={`
                  background: #adb5bd;
                  border-radius: 100px;
                  height: 75px;
                  width: 22px;
                  display: flex;
                  justify-content: space-around;
                  align-items: center;
                  flex-direction: column;

                  padding-bottom: 2px;
                  button {
                    padding: 4px;
                    :hover {
                      background: transparent;
                      svg {
                        path {
                          fill: #fff;
                        }
                      }
                    }
                  }
                `}
              >
                <IconButton onClick={() => resetRowSizes()}>
                  <Tooltip
                    title="Go back to default placeholder size"
                    placement="right"
                  >
                    <RedoIcon />
                  </Tooltip>
                </IconButton>
                <IconButton
                  onClick={() => {
                    props.setSelectedTypeHistory([
                      ...props.selectedTypeHistory,
                      props.selectedType,
                      "",
                    ]);
                    props.setTempRowState(props.framesArray[props.rowIndex]);
                  }}
                  data-cy="edit-row-structure-button"
                >
                  <Tooltip title="Edit" placement="right">
                    <EditIcon />
                  </Tooltip>
                </IconButton>
                <IconButton onClick={() => props.deleteFrame(props.rowId)}>
                  <Tooltip title="Delete" placement="right">
                    <DeleteIcon />
                  </Tooltip>
                </IconButton>
              </div>
            </div>
          </div>
        )}
        <Resizable
          grid={[5, 5]}
          onResize={onResize}
          onResizeStop={onResizeStop}
          size={{
            width: "100%",
            height: get(props.rowContentHeights, `[${0}]`, boxHeight),
          }}
          minWidth={78}
          enable={{
            bottom: !viewOnlyMode,
          }}
        >
          <div
            css={`
              width: 100%;
              height: 100%;
              display: flex;
              overflow-x: hidden;
              overflow-y: hidden;
              gap: ${props.gap};
              border: ${border};
              @media (min-width: ${TABLET_STARTPOINT}) and (max-width: 1260px) {
                width: ${props.rightPanelOpen
                  ? `calc(100% - ${RIGHT_PANEL_WIDTH})`
                  : "100%"};
                :hover {
                  overflow-x: ${props.rightPanelOpen ? "scroll" : "hidden"};
                }
              }
              @media (max-width: 767px) {
                display: grid;
                grid-template-columns: ${props.forceSelectedType ===
                  "oneByFive" || props.forceSelectedType === "oneByFour"
                  ? " auto auto"
                  : "auto"};
              }
            `}
            data-cy={`row-frame-${props.rowIndex}`}
          >
            {props.rowStructureDetailItems.map((row, index) => (
              <Box
                key={row.rowId}
                width={get(props.rowContentWidths, `[${index}]`, "fit-content")}
                height={get(props.rowContentHeights, `[${index}]`, boxHeight)}
                itemIndex={index}
                rowId={props.rowId}
                rowIndex={props.rowIndex}
                rowType={row.rowType}
                onRowBoxItemResize={props.onRowBoxItemResize}
                updateFramesArray={props.updateFramesArray}
                previewItem={get(props.previewItems, `[${index}]`, undefined)}
                rowItemsCount={props.rowStructureDetailItems.length}
                setPlugins={props.setPlugins}
                onSave={props.onSave}
              />
            ))}
          </div>
        </Resizable>
      </div>
    </div>
  );
}

const Box = (props: {
  width: number;
  height: number;
  rowId: string;
  rowIndex: number;
  itemIndex: number;
  rowType: string;
  setPlugins?: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
  updateFramesArray: Updater<IFramesArray[]>;
  rowItemsCount: number;
  previewItem?: string | any;
  onSave: (type: "create" | "edit") => Promise<void>;
  onRowBoxItemResize: (
    rowId: string,
    itemIndex: number,
    width: number,
    height: number
  ) => void;
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const location = useLocation();
  const history = useHistory();
  const { page, view } = useParams<{ page: string; view: string }>();
  const smScreen = useMediaQuery("(max-width: 767px)");
  const setDataset = useStoreActions(
    (actions) => actions.charts.dataset.setValue
  );

  const { handleRowFrameItemResize } = usehandleRowFrameItemResize(
    props.updateFramesArray
  );

  const [chartError, setChartError] = React.useState(false);
  const setLoadedChart = useStoreActions(
    (state) => state.charts.ChartGet.setCrudData
  );
  const setCreateChartData = useStoreActions(
    (state) => state.charts.ChartCreate.setCrudData
  );
  const isChartDragging = useRecoilValue(isChartDraggingAtom);
  const setChartFromStory = useRecoilState(chartFromStoryAtom)[1];
  const resetMapping = useStoreActions(
    (actions) => actions.charts.mapping.reset
  );
  const [chartId, setChartId] = React.useState<string | null>(null);

  const [displayMode, setDisplayMode] = useState<
    "chart" | "text" | "image" | "video" | null
  >(null);

  const [textContent, setTextContent] = React.useState<EditorState>(
    EditorState.createEmpty()
  );

  const [videoContent, setVideoContent] = React.useState<{
    videoId: string;
    embedUrl: string;
    snippet: any;
    source: "youtube";
  }>();

  const [imageContent, setImageContent] = React.useState<{
    imageId: string;
    imageUrl: string;
    source: "shutterstock";
    thumbnail: string;
  }>();

  const [displayBoxIcons, setDisplayBoxIcons] = React.useState(false);
  const placeholder = "Add your story...";
  const [textPlaceholderState, setTextPlaceholderState] =
    React.useState<string>(placeholder);

  const handleEditChart = () => {
    setChartFromStory({
      state: true,
      view,
      page,
      action: "edit",
      chartId: null,
    });
    setDataset(null);
    setLoadedChart(null);
    setCreateChartData(null);
    resetMapping();

    //save story before exiting
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
      if (frameId === -1) {
        return [...draft];
      }
      draft[frameId].content[itemIndex] = itemContent;
      draft[frameId].contentTypes[itemIndex] = itemContentType;
      const heights = draft[frameId].contentHeights;

      //relative to the text content, we only want to increase the height of textbox
      if (textHeight && textHeight > heights[itemIndex]) {
        heights[itemIndex] = textHeight;
      }
    });
  };
  const handleRowFrameItemRemoval = (rowId: string, itemIndex: number) => {
    props.updateFramesArray((draft) => {
      const frameId = draft.findIndex((frame) => frame.id === rowId);
      if (frameId === -1) {
        return [...draft];
      }

      draft[frameId].content[itemIndex] = null;
      draft[frameId].contentTypes[itemIndex] = null;
    });
  };

  const containerWidth = useRecoilValue(storyContentContainerWidth);
  const [_isResizing, setIsResizing] = useRecoilState(
    storyContentIsResizingAtom
  );
  const viewOnlyMode =
    location.pathname === `/story/${page}` ||
    location.pathname === `/story/${page}/downloaded-view`;

  const elementTypes = [
    StoryElementsType.TEXT,
    StoryElementsType.BIG_NUMBER,
    StoryElementsType.CHART,
    StoryElementsType.IMAGE,
    StoryElementsType.VIDEO,
  ];

  const [{ isOver }, drop] = useDrop(() => ({
    accept:
      props.rowType === "oneByFive"
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
  const textResizableRef = React.useRef<HTMLDivElement>(null);
  const editorHeight = textResizableRef.current?.clientHeight;

  const firstUpdate = useRef(true);

  const [,] = useDebounce(
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

  let width = `${props.width}%`;
  if (containerWidth) {
    width = `${
      containerWidth * (props.width / 100) -
      ((props.rowItemsCount - 1) * 11.3) / props.rowItemsCount
    }px`;
  }

  const onResizeStop = (
    _event: MouseEvent | TouchEvent,
    _direction: Direction,
    elementRef: HTMLElement,
    _delta: NumberSize
  ) => {
    let newWidth = elementRef.offsetWidth;
    let newHeight = elementRef.offsetHeight;
    handleRowFrameItemResize(props.rowId, props.itemIndex, newWidth, newHeight);
    setIsResizing(false);
  };

  const onResize = () => {
    setIsResizing(true);
  };

  const resetContent = () => {
    setDisplayMode(null);
    setChartId(null);
    setTextContent(EditorState.createEmpty());
    handleRowFrameItemRemoval(props.rowId, props.itemIndex);
  };

  const cursorDefault = "cursor: default;";

  const content = React.useMemo(() => {
    if (displayMode === "text") {
      return (
        <Resizable
          grid={[5, 5]}
          onResize={onResize}
          onResizeStop={onResizeStop}
          size={{
            width: smScreen ? "100%" : width,
            height: `${props.height}px`,
          }}
          maxWidth={!viewOnlyMode ? containerWidth : undefined}
          minWidth={78}
          enable={{
            right: !viewOnlyMode,
            bottomRight: !viewOnlyMode,
          }}
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
            {!viewOnlyMode && displayBoxIcons && (
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
                <DeleteIcon />
              </IconButton>
            )}

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
    }

    if (displayMode === "chart" && chartId) {
      return (
        <Resizable
          key={chartId}
          onResize={onResize}
          onResizeStop={onResizeStop}
          size={{
            width: smScreen ? "100%" : width,
            height: `${props.height}px`,
          }}
          maxWidth={!viewOnlyMode ? containerWidth : undefined}
          minWidth={78}
          enable={{
            right: !viewOnlyMode,
            bottomRight: !viewOnlyMode,
          }}
        >
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
            {!viewOnlyMode && displayBoxIcons && (
              <div>
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
                  <Tooltip title="Delete Chart">
                    <DeleteIcon />
                  </Tooltip>
                </IconButton>
                <IconButton
                  onClick={handleEditChart}
                  data-cy="edit-chart-button"
                  css={`
                    top: 12px;
                    z-index: 1;
                    right: 39px;
                    position: absolute;
                    visibility: ${chartError ? "hidden" : "visible"};
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
              </div>
            )}
            <StoryChartWrapper
              id={chartId}
              width={width.slice(0, -2)}
              error={chartError}
              setError={setChartError}
            />
          </div>
        </Resizable>
      );
    }

    if (displayMode === "video") {
      return (
        <Resizable
          grid={[5, 5]}
          onResize={onResize}
          onResizeStop={onResizeStop}
          size={{
            width: smScreen ? "100%" : width,
            height: `${props.height}px`,
          }}
          maxWidth={!viewOnlyMode ? containerWidth : undefined}
          minWidth={78}
          enable={{
            right: !viewOnlyMode,
            bottomRight: !viewOnlyMode,
          }}
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
            {!viewOnlyMode && displayBoxIcons && (
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
                <DeleteIcon />
              </IconButton>
            )}
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
    }

    if (displayMode === "image") {
      return (
        <Resizable
          grid={[5, 5]}
          onResize={onResize}
          onResizeStop={onResizeStop}
          size={{
            width: smScreen ? "100%" : width,
            height: `${props.height}px`,
          }}
          maxWidth={!viewOnlyMode ? containerWidth : undefined}
          minWidth={78}
          enable={{
            right: !viewOnlyMode,
            bottomRight: !viewOnlyMode,
          }}
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
            data-cy={`row-frame-image-item-${props.rowIndex}-${props.itemIndex}`}
          >
            {!viewOnlyMode && displayBoxIcons && (
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
                <DeleteIcon />
              </IconButton>
            )}
            <img
              src={imageContent?.imageUrl}
              alt={imageContent?.imageId}
              css={css`
                width: 100%;
                height: ${props.height}px;
                object-fit: cover;
              `}
              data-cy="story-image-content"
            />
          </div>
        </Resizable>
      );
    }

    return null;
  }, [
    displayMode,
    chartId,
    textContent,
    viewOnlyMode,
    displayBoxIcons,
    width,
    props.height,
    chartError,
  ]);

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

  let border = "none";
  if (isOver) {
    border = "1px solid #231d2c";
  } else if (isChartDragging === "bigNumber" && props.rowType === "oneByFive") {
    border = "1px dashed #231d2c";
  } else if (isChartDragging === "chart" && props.rowType !== "oneByFive") {
    border = "1px dashed #231d2c";
  }

  return (
    content ?? (
      <Resizable
        grid={[5, 5]}
        onResize={onResize}
        onResizeStop={onResizeStop}
        size={{ width: width, height: `${props.height}px` }}
        maxWidth={!viewOnlyMode ? containerWidth : undefined}
        minWidth={78}
        enable={{
          right: !viewOnlyMode,
          bottomRight: !viewOnlyMode,
        }}
      >
        <div
          css={`
            width: ${width};
            border: ${border};
            background: ${viewOnlyMode ? "transparent" : "#dfe3e6"};
            height: ${props.height}px;
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
    )
  );
};
