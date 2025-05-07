import React, { useRef } from "react";
import get from "lodash/get";
import {
  SetterOrUpdater,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
} from "recoil";
import IconButton from "@material-ui/core/IconButton";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { itemSpacing, containerGap } from "app/modules/story-module/data";
import RowstructureDisplay from "app/modules/story-module/components/rowStructure/rowStructureDisplay";
import { ReactComponent as CloseIcon } from "app/modules/story-module/asset/closeIcon.svg";
import { ReactComponent as DeleteIcon } from "app/modules/story-module/asset/deleteIcon.svg";
import {
  isDividerOrRowFrameDraggingAtom,
  storyContentContainerWidth,
  storyCreationTourStepAtom,
} from "app/state/recoil/atoms";
import {
  blockcss,
  containercss,
} from "app/modules/story-module/components/rowStructure/style";
import { IFramesArray } from "app/modules/story-module/views/create/data";
import { useOnClickOutside } from "usehooks-ts";
import { ToolbarPluginsType } from "app/modules/story-module/components/storySubHeaderToolbar/staticToolbar";
import { useDrag } from "react-dnd";
import { StoryElementsType } from "app/modules/story-module/components/right-panel-create-view";
import { usehandleRowFrameItemResize } from "app/hooks/useHandleRowFrameItemResize";
import { Updater } from "use-immer";
import { useMediaQuery } from "@material-ui/core";
import { rowStructureHeights } from "./data";

const _rowStructureDetailItems = [
  [{ rowType: "oneByOne", rowId: "oneByOne-1", width: "100%", factor: 1 }],
  [
    {
      rowType: "oneByTwo",
      rowId: "oneByTwo-1",
      width: `calc(50% - ${itemSpacing})`,
      factor: 0.5,
    },
    {
      rowType: "oneByTwo",
      rowId: "oneByTwo-2",
      width: `calc(50% - ${itemSpacing})`,
      factor: 0.5,
    },
  ],
  [
    {
      rowType: "oneByThree",
      rowId: "oneByThree-1",
      width: `calc(100% / 3 - ${itemSpacing})`,
      factor: 0.33,
    },
    {
      rowType: "oneByThree",
      rowId: "oneByThree-2",
      width: `calc(100% / 3 - ${itemSpacing})`,
      factor: 0.33,
    },
    {
      rowType: "oneByThree",
      rowId: "oneByThree-3",
      width: `calc(100% / 3 - ${itemSpacing})`,
      factor: 0.33,
    },
  ],
  [
    {
      rowType: "oneByFour",
      rowId: "oneByFour-1",
      width: `calc(100% / 4 - ${itemSpacing})`,
      factor: 0.25,
    },
    {
      rowType: "oneByFour",
      rowId: "oneByFour-2",
      width: `calc(100% / 4 - ${itemSpacing})`,
      factor: 0.25,
    },
    {
      rowType: "oneByFour",
      rowId: "oneByFour-3",
      width: `calc(100% / 4 - ${itemSpacing})`,
      factor: 0.25,
    },
    {
      rowType: "oneByFour",
      rowId: "oneByFour-4",
      width: `calc(100% / 4 - ${itemSpacing})`,
      factor: 0.25,
    },
  ],
  [
    {
      rowType: "oneByFive",
      rowId: "oneByFive-1",
      width: `calc(100% / 5 - ${itemSpacing})`,
      factor: 0.2,
    },
    {
      rowType: "oneByFive",
      rowId: "oneByFive-2",
      width: `calc(100% / 5 - ${itemSpacing})`,
      factor: 0.2,
    },
    {
      rowType: "oneByFive",
      rowId: "oneByFive-3",
      width: `calc(100% / 5 - ${itemSpacing})`,
      factor: 0.2,
    },
    {
      rowType: "oneByFive",
      rowId: "oneByFive-4",
      width: `calc(100% / 5 - ${itemSpacing})`,
      factor: 0.2,
    },
    {
      rowType: "oneByFive",
      rowId: "oneByFive-5",
      width: `calc(100% / 5 - ${itemSpacing})`,
      factor: 0.2,
    },
  ],
];

export const calculateWidths = (count: number, containerWidth: number) => {
  if (count <= 0) return [];

  // Total gap space = gap size * (number of items - 1)
  const totalGapWidth = containerGap * (count - 1);
  // Available space for content after gap
  const availableWidth = containerWidth - totalGapWidth;
  // Calculate each item's width
  const itemWidth = availableWidth / count;
  // Convert to percentage
  const itemWidthPercent = (itemWidth / containerWidth) * 100;

  return Array(count).fill(itemWidthPercent);
};
interface RowFrameProps {
  rowIndex: number;
  rowId: string;
  forceSelectedType?: string;
  updateFramesArray: Updater<IFramesArray[]>;
  framesArray: IFramesArray[];
  type: "rowFrame" | "divider";
  view: "initial" | "edit" | "create" | "preview" | "ai-template";
  previewItems?: (string | object)[];
  rowContentHeights: number[];
  rowContentWidths: number[];
  setPlugins: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
  endStoryTour: () => void;
  onSave: (type: "create" | "edit") => Promise<void>;
  rightPanelOpen: boolean;
}

interface IRowStructureType {
  handleRowFrameStructureTypeSelection: (
    structure:
      | "oneByOne"
      | "oneByTwo"
      | "oneByThree"
      | "oneByFour"
      | "oneByFive"
  ) => void;
  tourStep: number;
  setTourStep: SetterOrUpdater<number>;
  endStoryTour: () => void;
}

export default function RowFrame(props: RowFrameProps) {
  const history = useHistory();
  const isTablet = useMediaQuery("(max-width: 1110px)");

  const { handleRowFrameItemResize } = usehandleRowFrameItemResize(
    props.updateFramesArray
  );
  const [selectedType, setSelectedType] = React.useState<string>(
    props.forceSelectedType ?? ""
  );
  const [storyCreationTourStep, setStoryCreationTourStep] = useRecoilState(
    storyCreationTourStepAtom
  );

  const clearStoryCreationTourStep = useResetRecoilState(
    storyCreationTourStepAtom
  );

  const [tempRowState, setTempRowState] = React.useState<IFramesArray>(
    {} as IFramesArray
  );
  const containerWidth = useRecoilValue(storyContentContainerWidth);

  const [selectedTypeHistory, setSelectedTypeHistory] = React.useState<
    string[]
  >([""]);

  const [rowStructureDetailItems, setRowStructureDetailItems] = React.useState<
    {
      rowId: string;
      width: number;
      rowType: string;
      factor: number;
    }[][]
  >([]);

  const contentContainerId = "content-container";

  const onContentContainerResize = () => {
    const contentContainer = document.getElementById(contentContainerId);
    if (contentContainer) {
      const contentContainerWidth = contentContainer.offsetWidth;
      const newItems = _rowStructureDetailItems.map((item) => {
        return item.map((subitem) => ({
          ...subitem,
          width: contentContainerWidth * subitem.factor,
        }));
      });
      setRowStructureDetailItems(newItems);
    }
  };

  const onlyView = React.useMemo(() => {
    return (
      !history.location.pathname.includes("/edit") &&
      !history.location.pathname.includes("/new") &&
      !history.location.pathname.includes("/preview")
    );
  }, [history.location.pathname]);

  const onRowBoxItemResize = (
    rowId: string,
    itemIndex: number,
    width: number,
    height: number
  ) => {
    handleRowFrameItemResize(rowId, itemIndex, width, height);
  };

  const deleteFrame = (id: string) => {
    props.updateFramesArray((draft) => {
      const frameId = draft.findIndex((frame) => frame.id === id);
      draft.splice(frameId, 1);
    });
  };
  const rowIndex = React.useMemo(() => {
    return props.framesArray.findIndex((item) => item.id === props.rowId);
  }, [props.framesArray]);

  const handleRowFrameStructureTypeSelection = (
    structure:
      | "oneByOne"
      | "oneByTwo"
      | "oneByThree"
      | "oneByFour"
      | "oneByFive"
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    let content: (string | object | null)[] = [];
    let contentTypes: ("text" | "divider" | "chart" | null)[] = [];
    let contentWidths: number[] = [];
    let contentHeights: number[] = [];
    const tabletHeight =
      rowStructureHeights[structure as keyof typeof rowStructureHeights]
        .tabletHeight;
    const desktopHeight =
      rowStructureHeights[structure as keyof typeof rowStructureHeights].height;

    setSelectedType(structure);
    switch (structure) {
      case "oneByOne":
        content = [null];
        contentTypes = [null];
        contentWidths = calculateWidths(1, containerWidth);
        contentHeights = isTablet ? tabletHeight : desktopHeight;
        break;
      case "oneByTwo":
        content = [null, null];
        contentTypes = [null, null];
        contentWidths = calculateWidths(2, containerWidth);
        contentHeights = isTablet ? tabletHeight : desktopHeight;
        break;
      case "oneByThree":
        content = [null, null, null];
        contentTypes = [null, null, null];
        contentWidths = calculateWidths(3, containerWidth);
        contentHeights = isTablet ? tabletHeight : desktopHeight;
        break;
      case "oneByFour":
        content = [null, null, null, null];
        contentTypes = [null, null, null, null];
        contentWidths = calculateWidths(4, containerWidth);
        contentHeights = isTablet ? tabletHeight : desktopHeight;
        break;
      case "oneByFive":
        content = [null, null, null, null, null];
        contentTypes = [null, null, null, null, null];
        contentWidths = calculateWidths(5, containerWidth);
        contentHeights = isTablet ? tabletHeight : desktopHeight;
        break;

      default:
        break;
    }
    props.updateFramesArray((draft) => {
      //the first time you select a row structure, framesArray is set to default values
      if (selectedTypeHistory.length === 1) {
        draft[rowIndex] = {
          ...draft[rowIndex],
          content,
          contentTypes,
          contentWidths,
          contentHeights,
          structure,
          frame: {
            ...draft[rowIndex].frame,
            previewItems: [],
          },
        };
      } else {
        //if you change the row structure, the content array is updated to match the
        //new structure while retaining the previous content
        let draftContent = draft[rowIndex].content;
        let draftContentTypes = draft[rowIndex].contentTypes;
        if (tempRowState.id === draft[rowIndex].id) {
          if (content.length < tempRowState.content.length) {
            draftContent = tempRowState.content.slice(0, content.length);
            draftContentTypes = tempRowState.contentTypes.slice(
              0,
              contentTypes.length
            );
          } else if (content.length > tempRowState.content.length) {
            draftContent = [
              ...tempRowState.content,
              ...Array(content.length - tempRowState.content.length).fill(null),
            ];
            draftContentTypes = [
              ...tempRowState.contentTypes,
              ...Array(
                contentTypes.length - tempRowState.contentTypes.length
              ).fill(null),
            ];
          }
        }
        draft[rowIndex] = {
          ...draft[rowIndex],
          contentTypes: draftContentTypes,
          content: draftContent,
          contentWidths,
          contentHeights,
          structure,
          frame: {
            ...draft[rowIndex].frame,
            previewItems: draftContent as (string | object)[],
          },
        };
      }
    });
  };

  React.useEffect(() => {
    setSelectedType(selectedTypeHistory[selectedTypeHistory.length - 1]);
  }, [selectedTypeHistory]);

  React.useEffect(() => {
    const contentContainer = document.getElementById(contentContainerId);
    if (contentContainer) {
      onContentContainerResize();
      contentContainer.addEventListener("resize", onContentContainerResize);
    }
    return () => {
      if (contentContainer) {
        contentContainer.removeEventListener(
          "resize",
          onContentContainerResize
        );
      }
    };
  }, []);

  React.useEffect(() => {
    // Add event listener for page exit or component unmount
    const handlePageExit = () => {
      clearStoryCreationTourStep();
    };

    window.addEventListener("beforeunload", handlePageExit);

    return () => {
      window.removeEventListener("beforeunload", handlePageExit);
      clearStoryCreationTourStep(); // Reset state when component unmounts
    };
  }, []);

  React.useEffect(() => {
    if (props.forceSelectedType) {
      setSelectedType(props.forceSelectedType);
    }
  }, [props.forceSelectedType]);

  const contentContainer = document.getElementById(contentContainerId);
  if (!contentContainer || rowStructureDetailItems.length === 0)
    return <div>loading</div>;

  const desktopHeight =
    rowStructureHeights[selectedType as keyof typeof rowStructureHeights]
      .height[0];
  const tabletHeight =
    rowStructureHeights[selectedType as keyof typeof rowStructureHeights]
      .tabletHeight[0];
  const checkSelectedType = {
    oneByOne: (
      <RowstructureDisplay
        gap={containerGap + "px"}
        height={desktopHeight}
        tabletHeight={tabletHeight}
        rowId={props.rowId}
        rowIndex={props.rowIndex}
        selectedType={selectedType}
        updateFramesArray={props.updateFramesArray}
        framesArray={props.framesArray}
        rowContentHeights={props.rowContentHeights}
        rowContentWidths={props.rowContentWidths}
        deleteFrame={deleteFrame}
        selectedTypeHistory={selectedTypeHistory}
        setSelectedTypeHistory={setSelectedTypeHistory}
        rowStructureDetailItems={rowStructureDetailItems[0]}
        previewItems={props.previewItems}
        onRowBoxItemResize={onRowBoxItemResize}
        setPlugins={props.setPlugins}
        onSave={props.onSave}
        forceSelectedType={props.forceSelectedType}
        setTempRowState={setTempRowState}
        rightPanelOpen={props.rightPanelOpen}
      />
    ),
    oneByTwo: (
      <RowstructureDisplay
        gap={containerGap + "px"}
        height={desktopHeight}
        tabletHeight={tabletHeight}
        rowIndex={props.rowIndex}
        rowId={props.rowId}
        selectedType={selectedType}
        updateFramesArray={props.updateFramesArray}
        framesArray={props.framesArray}
        rowContentHeights={props.rowContentHeights}
        rowContentWidths={props.rowContentWidths}
        deleteFrame={deleteFrame}
        selectedTypeHistory={selectedTypeHistory}
        setSelectedTypeHistory={setSelectedTypeHistory}
        rowStructureDetailItems={rowStructureDetailItems[1]}
        previewItems={props.previewItems}
        onRowBoxItemResize={onRowBoxItemResize}
        setPlugins={props.setPlugins}
        onSave={props.onSave}
        forceSelectedType={props.forceSelectedType}
        setTempRowState={setTempRowState}
        rightPanelOpen={props.rightPanelOpen}
      />
    ),
    oneByThree: (
      <RowstructureDisplay
        gap={containerGap + "px"}
        height={desktopHeight}
        tabletHeight={tabletHeight}
        rowId={props.rowId}
        rowIndex={props.rowIndex}
        selectedType={selectedType}
        updateFramesArray={props.updateFramesArray}
        framesArray={props.framesArray}
        rowContentHeights={props.rowContentHeights}
        rowContentWidths={props.rowContentWidths}
        deleteFrame={deleteFrame}
        selectedTypeHistory={selectedTypeHistory}
        setSelectedTypeHistory={setSelectedTypeHistory}
        rowStructureDetailItems={rowStructureDetailItems[2]}
        previewItems={props.previewItems}
        onRowBoxItemResize={onRowBoxItemResize}
        setPlugins={props.setPlugins}
        onSave={props.onSave}
        forceSelectedType={props.forceSelectedType}
        setTempRowState={setTempRowState}
        rightPanelOpen={props.rightPanelOpen}
      />
    ),
    oneByFour: (
      <RowstructureDisplay
        gap={containerGap + "px"}
        height={desktopHeight}
        tabletHeight={tabletHeight}
        selectedType={selectedType}
        selectedTypeHistory={selectedTypeHistory}
        setSelectedTypeHistory={setSelectedTypeHistory}
        rowStructureDetailItems={rowStructureDetailItems[3]}
        onRowBoxItemResize={onRowBoxItemResize}
        rowId={props.rowId}
        rowIndex={props.rowIndex}
        updateFramesArray={props.updateFramesArray}
        framesArray={props.framesArray}
        rowContentHeights={props.rowContentHeights}
        rowContentWidths={props.rowContentWidths}
        deleteFrame={deleteFrame}
        setPlugins={props.setPlugins}
        onSave={props.onSave}
        previewItems={props.previewItems}
        forceSelectedType={props.forceSelectedType}
        setTempRowState={setTempRowState}
        rightPanelOpen={props.rightPanelOpen}
      />
    ),
    oneByFive: (
      <RowstructureDisplay
        gap={containerGap + "px"}
        height={desktopHeight}
        tabletHeight={tabletHeight}
        rowId={props.rowId}
        rowIndex={props.rowIndex}
        selectedType={selectedType}
        updateFramesArray={props.updateFramesArray}
        framesArray={props.framesArray}
        rowContentHeights={props.rowContentHeights}
        rowContentWidths={props.rowContentWidths}
        deleteFrame={deleteFrame}
        selectedTypeHistory={selectedTypeHistory}
        setSelectedTypeHistory={setSelectedTypeHistory}
        rowStructureDetailItems={rowStructureDetailItems[4]}
        previewItems={props.previewItems}
        onRowBoxItemResize={onRowBoxItemResize}
        setPlugins={props.setPlugins}
        onSave={props.onSave}
        forceSelectedType={props.forceSelectedType}
        setTempRowState={setTempRowState}
        rightPanelOpen={props.rightPanelOpen}
      />
    ),
  };

  if (onlyView && !selectedType) {
    return <div></div>;
  }

  return (
    <>
      {props.type === "rowFrame" ? (
        <>
          {selectedType ? (
            <>
              {
                checkSelectedType[
                  selectedType as keyof typeof checkSelectedType
                ]
              }
            </>
          ) : (
            <div css={containercss} data-cy="empty-row-frame">
              <p
                css={`
                  margin-bottom: 0;
                  color: #000;
                  font-family: "GothamNarrow-bold", "Helvetica Neue", sans-serif;
                `}
              >
                Select your row structure
              </p>
              <IconButton
                css={`
                  top: -5px;
                  right: -5px;
                  position: absolute;
                `}
                onClick={() => {
                  if (
                    storyCreationTourStep !== 0 &&
                    storyCreationTourStep !== 3
                  ) {
                    props.endStoryTour();
                  }
                  deleteFrame(props.rowId);
                }}
              >
                <CloseIcon />
              </IconButton>
              <div
                css={`
                  width: 92%;
                  margin: auto;
                  display: flex;
                  flex-wrap: wrap;
                  column-gap: 55px;
                  align-items: center;
                  justify-content: center;
                `}
              >
                <OneByOne
                  handleRowFrameStructureTypeSelection={
                    handleRowFrameStructureTypeSelection
                  }
                  tourStep={storyCreationTourStep}
                  setTourStep={setStoryCreationTourStep}
                  endStoryTour={props.endStoryTour}
                />
                <OneByTwo
                  handleRowFrameStructureTypeSelection={
                    handleRowFrameStructureTypeSelection
                  }
                  tourStep={storyCreationTourStep}
                  setTourStep={setStoryCreationTourStep}
                  endStoryTour={props.endStoryTour}
                />
                <OneByThree
                  handleRowFrameStructureTypeSelection={
                    handleRowFrameStructureTypeSelection
                  }
                  tourStep={storyCreationTourStep}
                  setTourStep={setStoryCreationTourStep}
                  endStoryTour={props.endStoryTour}
                />
                <OneByFour
                  handleRowFrameStructureTypeSelection={
                    handleRowFrameStructureTypeSelection
                  }
                  tourStep={storyCreationTourStep}
                  setTourStep={setStoryCreationTourStep}
                  endStoryTour={props.endStoryTour}
                />
                <OneByFive
                  handleRowFrameStructureTypeSelection={
                    handleRowFrameStructureTypeSelection
                  }
                  tourStep={storyCreationTourStep}
                  setTourStep={setStoryCreationTourStep}
                  endStoryTour={props.endStoryTour}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <Divider
          delete={deleteFrame}
          dividerId={props.rowId}
          rowIndex={props.rowIndex}
        />
      )}
    </>
  );
}

const OneByOne = (props: IRowStructureType) => {
  const handleClick = () => {
    if (props.tourStep === 2) {
      props.setTourStep(3);
    } else {
      props.endStoryTour();
      props.handleRowFrameStructureTypeSelection("oneByOne");
    }
  };
  return (
    <div css={blockcss} onClick={handleClick} data-cy="one-by-one-type">
      <p>1/1</p>
      <div>
        <div
          css={`
            background: #dfe3e6;
            height: 56px;
            width: 94px;
          `}
        />
      </div>
    </div>
  );
};

const OneByTwo = (props: IRowStructureType) => {
  const handleClick = () => {
    if (props.tourStep === 2) {
      props.setTourStep(3);
    } else {
      props.endStoryTour();
    }
    props.handleRowFrameStructureTypeSelection("oneByTwo");
  };
  return (
    <div css={blockcss} onClick={handleClick} data-cy="one-by-two-type">
      <p>1/2</p>
      <div
        css={`
          display: grid;
          grid-template-columns: auto auto;
          gap: 15px;
          width: 103px;
          div {
            background: #dfe3e6;
            height: 56px;
          }
        `}
      >
        <div />
        <div />
      </div>
    </div>
  );
};

const OneByThree = (props: IRowStructureType) => {
  const handleClick = () => {
    if (props.tourStep === 2) {
      props.setTourStep(3);
    } else {
      props.endStoryTour();
      props.handleRowFrameStructureTypeSelection("oneByThree");
    }
  };
  return (
    <div css={blockcss} onClick={handleClick}>
      <p>1/3</p>
      <div
        css={`
          display: grid;
          grid-template-columns: 29.4% auto auto;
          gap: 6.3px;
          width: 109px;
          div {
            background: #dfe3e6;
            height: 56px;
          }
        `}
      >
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

const OneByFour = (props: IRowStructureType) => {
  const handleClick = () => {
    if (props.tourStep === 2) {
      props.setTourStep(3);
    } else {
      props.endStoryTour();
      props.handleRowFrameStructureTypeSelection("oneByFour");
    }
  };
  return (
    <div css={blockcss} onClick={handleClick}>
      <p>1/4</p>
      <div
        css={`
          display: grid;
          grid-template-columns: 25px 23px 23px 23px;
          gap: 8px;
          width: 116px;
          div {
            background: #dfe3e6;
            height: 56px;
          }
        `}
      >
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

const OneByFive = (props: IRowStructureType) => {
  const handleClick = () => {
    if (props.tourStep === 2) {
      props.setTourStep(3);
    } else {
      props.endStoryTour();
      props.handleRowFrameStructureTypeSelection("oneByFive");
    }
  };
  return (
    <div css={blockcss} onClick={handleClick}>
      <p>1/5</p>
      <div
        css={`
          display: grid;
          grid-template-columns: 19px 18px 18px 18px 18px;
          gap: 5px;
          width: 116px;
          div {
            background: #dfe3e6;
            height: 56px;
          }
        `}
      >
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

function Divider(props: {
  dividerId: string;
  delete: (id: string) => void;
  rowIndex?: number;
}) {
  const location = useLocation();
  const { page } = useParams<{ page: string }>();
  const dividerRef = useRef(null);

  const [handleDisplay, setHandleDisplay] = React.useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: StoryElementsType.ROW,
    item: () => {
      return {
        id: props.dividerId,
        index: props.rowIndex,
        type: StoryElementsType.ROW,
      };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [isItemDragging, setIsItemDragging] = useRecoilState(
    isDividerOrRowFrameDraggingAtom
  );

  React.useEffect(() => {
    if (isDragging !== isItemDragging.state) {
      setIsItemDragging({
        state: isDragging,
        rowId: props.dividerId,
      });
    }
  }, [isDragging]);

  const viewOnlyMode =
    page !== "new" && get(location.pathname.split("/"), "[3]", "") !== "edit";

  const handlers = viewOnlyMode
    ? {}
    : {
        onMouseEnter: () => {
          setHandleDisplay(true);
        },
      };

  useOnClickOutside(dividerRef, () => setHandleDisplay(false));

  return (
    <div
      {...handlers}
      css={`
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        position: relative;
      `}
    >
      {handleDisplay && (
        <div
          ref={dividerRef}
          css={`
            left: -3rem;
            display: flex;
            position: absolute;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
              flex-direction: column;
              justify-content: center;
              background: #adb5bd;
              border-radius: 50px;
              width: 22.154px;
              height: 22.154px;
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
            <IconButton onClick={() => props.delete(props.dividerId)}>
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      )}
      <div
        ref={drag}
        css={`
          height: 2px;
          width: 100%;
          background: #cfd4da;
          cursor: grab;
        `}
      />
    </div>
  );
}
