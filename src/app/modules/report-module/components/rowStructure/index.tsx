import React, { useRef } from "react";
import get from "lodash/get";
import { SetterOrUpdater, useRecoilState, useResetRecoilState } from "recoil";
import { useUpdateEffect } from "react-use";
import IconButton from "@material-ui/core/IconButton";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { itemSpacing, containerGap } from "app/modules/report-module/data";
import RowstructureDisplay from "app/modules/report-module/components/rowStructure/rowStructureDisplay";
import { ReactComponent as CloseIcon } from "app/modules/report-module/asset/closeIcon.svg";
import { ReactComponent as DeleteIcon } from "app/modules/report-module/asset/deleteIcon.svg";
import {
  isDividerOrRowFrameDraggingAtom,
  reportCreationTourStepAtom,
} from "app/state/recoil/atoms";
import {
  blockcss,
  containercss,
} from "app/modules/report-module/components/rowStructure/style";
import { IFramesArray } from "app/modules/report-module/views/create/data";
import { useOnClickOutside } from "usehooks-ts";
import { ToolbarPluginsType } from "app/modules/report-module/components/reportSubHeaderToolbar/staticToolbar";
import { useDrag } from "react-dnd";
import { ReportElementsType } from "app/modules/report-module/components/right-panel-create-view";
import { usehandleRowFrameItemResize } from "app/hooks/useHandleRowFrameItemResize";
import { Updater } from "use-immer";

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
  endReportTour: () => void;
  onSave: (type: "create" | "edit") => Promise<void>;
}

interface IRowStructureType {
  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
  tourStep: number;
  setTourStep: SetterOrUpdater<number>;
  endReportTour: () => void;
}

export default function RowFrame(props: RowFrameProps) {
  const history = useHistory();
  const { handleRowFrameItemResize } = usehandleRowFrameItemResize(
    props.updateFramesArray
  );
  const [selectedType, setSelectedType] = React.useState<string>(
    props.forceSelectedType ?? ""
  );
  const [reportCreationTourStep, setReportCreationTourStep] = useRecoilState(
    reportCreationTourStepAtom
  );

  const clearReportCreationTourStep = useResetRecoilState(
    reportCreationTourStepAtom
  );

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

  const onContentContainerResize = () => {
    const contentContainer = document.getElementById("content-container");
    if (contentContainer) {
      const contentContainerWidth = contentContainer.offsetWidth;
      const newItems = _rowStructureDetailItems.map((item) => {
        const items = item.map((subitem) => ({
          ...subitem,
          width: contentContainerWidth * subitem.factor,
        }));
        return items;
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
      | null
      | "oneByOne"
      | "oneByTwo"
      | "oneByThree"
      | "oneByFour"
      | "oneByFive"
  ) => {
    let content: (string | object | null)[] = [];
    let contentTypes: ("text" | "divider" | "chart" | null)[] = [];
    let contentWidths: number[] = [];
    let contentHeights: number[] = [];
    switch (structure) {
      case "oneByOne":
        content = [null];
        contentTypes = [null];
        contentWidths = [100];
        contentHeights = [400];
        break;
      case "oneByTwo":
        content = [null, null];
        contentTypes = [null, null];
        contentWidths = [50, 50];
        contentHeights = [420, 420];
        break;
      case "oneByThree":
        content = [null, null, null];
        contentTypes = [null, null, null];
        contentWidths = [33, 33, 33];
        contentHeights = [460, 460, 460];
        break;
      case "oneByFour":
        content = [null, null, null, null];
        contentTypes = [null, null, null, null];
        contentWidths = [25, 25, 25, 25];
        contentHeights = [142, 142, 142, 142];
        break;
      case "oneByFive":
        content = [null, null, null, null, null];
        contentTypes = [null, null, null, null, null];
        contentWidths = [20, 20, 20, 20, 20];
        contentHeights = [142, 142, 142, 142, 142];
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
        if (content.length < draftContent.length) {
          draftContent = draftContent.slice(
            -(draftContent.length - content.length)
          );
          draftContentTypes = draftContentTypes.slice(
            -(contentTypes.length - draftContentTypes.length)
          );
        } else if (content.length > draftContent.length) {
          draftContent = [
            ...draftContent,
            ...Array(content.length - draftContent.length).fill(null),
          ];
          draftContentTypes = [
            ...draftContentTypes,
            ...Array(contentTypes.length - draftContentTypes.length).fill(null),
          ];
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
      // return tempPrev;
    });
  };

  React.useEffect(() => {
    setSelectedType(selectedTypeHistory[selectedTypeHistory.length - 1]);
  }, [selectedTypeHistory]);

  React.useEffect(() => {
    const contentContainer = document.getElementById("content-container");
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
      clearReportCreationTourStep();
    };

    window.addEventListener("beforeunload", handlePageExit);

    return () => {
      window.removeEventListener("beforeunload", handlePageExit);
      clearReportCreationTourStep(); // Reset state when component unmounts
    };
  }, []);

  React.useEffect(() => {
    if (props.forceSelectedType) {
      setSelectedType(props.forceSelectedType);
    }
  }, [props.forceSelectedType]);

  useUpdateEffect(() => {
    handleRowFrameStructureTypeSelection(
      selectedType as
        | "oneByOne"
        | "oneByTwo"
        | "oneByThree"
        | "oneByFour"
        | "oneByFive"
    );
  }, [selectedType]);

  const contentContainer = document.getElementById("content-container");
  if (!contentContainer || rowStructureDetailItems.length === 0)
    return <div>loading</div>;

  const checkSelectedType = {
    oneByOne: (
      <RowstructureDisplay
        gap={containerGap}
        height={400}
        rowId={props.rowId}
        rowIndex={props.rowIndex}
        selectedType={selectedType}
        updateFramesArray={props.updateFramesArray}
        framesArray={props.framesArray}
        rowContentHeights={props.rowContentHeights}
        rowContentWidths={props.rowContentWidths}
        deleteFrame={deleteFrame}
        setSelectedType={setSelectedType}
        selectedTypeHistory={selectedTypeHistory}
        setSelectedTypeHistory={setSelectedTypeHistory}
        rowStructureDetailItems={rowStructureDetailItems[0]}
        previewItems={props.previewItems}
        onRowBoxItemResize={onRowBoxItemResize}
        setPlugins={props.setPlugins}
        onSave={props.onSave}
        forceSelectedType={props.forceSelectedType}
      />
    ),
    oneByTwo: (
      <RowstructureDisplay
        gap={containerGap}
        height={420}
        rowIndex={props.rowIndex}
        rowId={props.rowId}
        selectedType={selectedType}
        updateFramesArray={props.updateFramesArray}
        framesArray={props.framesArray}
        rowContentHeights={props.rowContentHeights}
        rowContentWidths={props.rowContentWidths}
        deleteFrame={deleteFrame}
        setSelectedType={setSelectedType}
        selectedTypeHistory={selectedTypeHistory}
        setSelectedTypeHistory={setSelectedTypeHistory}
        rowStructureDetailItems={rowStructureDetailItems[1]}
        previewItems={props.previewItems}
        onRowBoxItemResize={onRowBoxItemResize}
        setPlugins={props.setPlugins}
        onSave={props.onSave}
        forceSelectedType={props.forceSelectedType}
      />
    ),
    oneByThree: (
      <RowstructureDisplay
        gap={containerGap}
        height={460}
        rowId={props.rowId}
        rowIndex={props.rowIndex}
        selectedType={selectedType}
        updateFramesArray={props.updateFramesArray}
        framesArray={props.framesArray}
        rowContentHeights={props.rowContentHeights}
        rowContentWidths={props.rowContentWidths}
        deleteFrame={deleteFrame}
        setSelectedType={setSelectedType}
        selectedTypeHistory={selectedTypeHistory}
        setSelectedTypeHistory={setSelectedTypeHistory}
        rowStructureDetailItems={rowStructureDetailItems[2]}
        previewItems={props.previewItems}
        onRowBoxItemResize={onRowBoxItemResize}
        setPlugins={props.setPlugins}
        onSave={props.onSave}
        forceSelectedType={props.forceSelectedType}
      />
    ),
    oneByFour: (
      <RowstructureDisplay
        gap={containerGap}
        height={142}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
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
      />
    ),
    oneByFive: (
      <RowstructureDisplay
        gap={containerGap}
        height={142}
        rowId={props.rowId}
        rowIndex={props.rowIndex}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
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
                    reportCreationTourStep !== 0 &&
                    reportCreationTourStep !== 3
                  ) {
                    props.endReportTour();
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
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  tourStep={reportCreationTourStep}
                  setTourStep={setReportCreationTourStep}
                  endReportTour={props.endReportTour}
                />
                <OneByTwo
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  tourStep={reportCreationTourStep}
                  setTourStep={setReportCreationTourStep}
                  endReportTour={props.endReportTour}
                />
                <OneByThree
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  tourStep={reportCreationTourStep}
                  setTourStep={setReportCreationTourStep}
                  endReportTour={props.endReportTour}
                />
                <OneByFour
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  tourStep={reportCreationTourStep}
                  setTourStep={setReportCreationTourStep}
                  endReportTour={props.endReportTour}
                />
                <OneByFive
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  tourStep={reportCreationTourStep}
                  setTourStep={setReportCreationTourStep}
                  endReportTour={props.endReportTour}
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
      props.endReportTour();
      props.setSelectedType("oneByOne");
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
      props.endReportTour();
    }
    props.setSelectedType("oneByTwo");
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
      props.endReportTour();
      props.setSelectedType("oneByThree");
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
      props.endReportTour();
      props.setSelectedType("oneByFour");
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
      props.endReportTour();
      props.setSelectedType("oneByFive");
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
    type: ReportElementsType.ROW,
    item: () => {
      return {
        id: props.dividerId,
        index: props.rowIndex,
        type: ReportElementsType.ROW,
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
