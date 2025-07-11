import React, { useRef, useState } from "react";
import get from "lodash/get";
import { useOnClickOutside } from "usehooks-ts";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { useRecoilState, useRecoilValue } from "recoil";
import { useLocation, useParams } from "react-router-dom";
import { ReactComponent as EditIcon } from "app/modules/story-module/asset/editIcon.svg";
import { ReactComponent as RedoIcon } from "app/modules/story-module/asset/redo-icon.svg";
import { ReactComponent as DeleteIcon } from "app/modules/story-module/asset/deleteIcon.svg";
import {
  storyContentContainerWidth,
  storyContentIsResizingAtom,
} from "app/state/recoil/atoms";
import { IFramesArray } from "app/modules/story-module/views/create/data";
import { ToolbarPluginsType } from "app/modules/story-module/components/storySubHeaderToolbar/staticToolbar";
import { Updater } from "use-immer";
import { useMediaQuery } from "@material-ui/core";
import { rowStructureHeights } from "./data";
import { calculateWidths } from ".";
import Box from "./box";
import { usehandleRowFrameItemResize } from "app/hooks/useHandleRowFrameItemResize";
import { DESKTOP_BREAKPOINT, MOBILE_BREAKPOINT } from "app/theme";
import { NumberSize, Resizable } from "re-resizable";
import { Direction } from "re-resizable/lib/resizer";
import {
  MIN_BOX_HEIGHT,
  MIN_BOX_WIDTH,
} from "app/modules/story-module/components/rowStructure/data";

interface RowStructureDisplayProps {
  gap: string;
  height: number;
  tabletHeight: number;
  rowIndex: number;
  rowId: string;
  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
  framesArray: IFramesArray[];
  rowContentWidths: number[];
  rowContentHeights: number[];
  updateFramesArray: Updater<IFramesArray[]>;
  deleteFrame: (id: string) => void;
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
  setPluginsState: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
  onSave: (type: "create" | "edit") => Promise<void>;
  forceSelectedType: string | undefined;
  setTempRowState: React.Dispatch<React.SetStateAction<IFramesArray>>;
  rightPanelOpen: boolean;
}

export default function RowstructureDisplay(
  props: Readonly<RowStructureDisplayProps>
) {
  const isTablet = useMediaQuery("(max-width: 1110px)");
  const ref = useRef(null);
  useOnClickOutside(ref, () => setHandleDisplay(false));
  const location = useLocation();
  const { page } = useParams<{ page: string }>();
  const [handleDisplay, setHandleDisplay] = React.useState(false);
  const boxHeight = isTablet ? props.tabletHeight : props.height;
  const containerWidth = useRecoilValue(storyContentContainerWidth);
  const [temporaryWidths, setTemporaryWidths] = useState<{
    [key: string]: number;
  }>({});
  const [tempHeight, setTempHeight] = useState(0);
  const [minHeight, setMinHeight] = useState(MIN_BOX_HEIGHT);
  const viewOnlyMode =
    location.pathname === `/story/${page}` ||
    location.pathname === `/story/${page}/downloaded-view`;
  const border =
    !viewOnlyMode && handleDisplay
      ? "0.722415px dashed  #ADB5BD"
      : "0.722415px dashed transparent";

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
        width: calculateWidths(1, containerWidth),
        height: getHeight("oneByOne"),
      },
      {
        type: "oneByTwo",
        width: calculateWidths(2, containerWidth),
        height: getHeight("oneByTwo"),
      },
      {
        type: "oneByThree",
        width: calculateWidths(3, containerWidth),
        height: getHeight("oneByThree"),
      },
      {
        type: "oneByFour",
        width: calculateWidths(4, containerWidth),
        height: getHeight("oneByFour"),
      },
      {
        type: "oneByFive",
        width: calculateWidths(5, containerWidth),
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

  const getNeighbourIndex = (itemIndex: number) => {
    //neighbour of the current box item
    return itemIndex < props.rowContentWidths.length - 1
      ? itemIndex + 1
      : itemIndex - 1;
  };

  const onResize = (
    _event: MouseEvent | TouchEvent,
    _direction: Direction,
    elementRef: HTMLElement,
    _delta: NumberSize
  ) => {
    setIsResizing(true);
    const newHeight = elementRef.offsetHeight;
    if (newHeight > MIN_BOX_HEIGHT) {
      setTempHeight(newHeight);
    } else {
      setTempHeight(MIN_BOX_HEIGHT);
    }
  };

  const onResizeStop = (
    _event: MouseEvent | TouchEvent,
    _direction: Direction,
    elementRef: HTMLElement,
    _delta: NumberSize
  ) => {
    let newHeight = elementRef.offsetHeight;
    if (newHeight < MIN_BOX_HEIGHT) {
      newHeight = MIN_BOX_HEIGHT;
    }
    handleRowHeightResize(props.rowId, newHeight);
    setIsResizing(false);
    setTempHeight(0);
  };

  const onResizeStart = (
    _e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
    _dir: Direction,
    _elementRef: HTMLElement
  ) => {
    const textBoxHeights: number[] = [];

    props.framesArray[props.rowIndex].contentTypes.forEach((c, index) => {
      if (c === "text") {
        const box = document.getElementById(`box-${props.rowIndex}-${index}`);
        const boxHeight = box?.offsetHeight || MIN_BOX_HEIGHT;
        textBoxHeights.push(boxHeight);
      }
    });

    //get the biggest value from the array
    const maxHeight = Math.max(...textBoxHeights);
    //if the text editor heights are not empty, get the
    if (maxHeight && maxHeight > MIN_BOX_HEIGHT) {
      setMinHeight(maxHeight);
    }
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
                    props.setTempRowState(props.framesArray[props.rowIndex]); // Set the current row state to tempRowState
                    props.setSelectedType("");
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
          onResizeStart={onResizeStart}
          size={{
            width: "100%",
            height: viewOnlyMode
              ? "100%"
              : get(props.rowContentHeights, `[${0}]`, boxHeight),
          }}
          minWidth={MIN_BOX_WIDTH}
          minHeight={minHeight}
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
              @media (max-width: ${DESKTOP_BREAKPOINT}) {
                :hover {
                  overflow-x: ${props.rightPanelOpen ? "scroll" : "hidden"};
                }
              }
              @media (max-width: ${MOBILE_BREAKPOINT}) {
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
                initialWidth={get(
                  props.rowContentWidths,
                  `[${index}]`,
                  "fit-content"
                )}
                initialHeight={get(
                  props.rowContentHeights,
                  `[${index}]`,
                  boxHeight
                )}
                last={index === props.rowStructureDetailItems.length - 1}
                itemIndex={index}
                neighbourIndex={getNeighbourIndex(index)}
                rowId={props.rowId}
                rowIndex={props.rowIndex}
                rowType={row.rowType}
                onRowBoxItemResize={props.onRowBoxItemResize}
                updateFramesArray={props.updateFramesArray}
                previewItem={get(props.previewItems, `[${index}]`, undefined)}
                rowItemsCount={props.rowStructureDetailItems.length}
                setPluginsState={props.setPluginsState}
                onSave={props.onSave}
                rowContentWidths={props.rowContentWidths}
                temporaryWidths={temporaryWidths}
                setTemporaryWidths={setTemporaryWidths}
                tempHeight={tempHeight}
              />
            ))}
          </div>
        </Resizable>
      </div>
    </div>
  );
}
