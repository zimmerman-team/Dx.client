import React from "react";
import { v4 } from "uuid";
import IconButton from "@material-ui/core/IconButton";
import { IFramesArray } from "app/modules/story-module/views/create/data";
import { ReactComponent as PlusIcon } from "app/modules/story-module/asset/addButton.svg";
import { IRowFrameStructure } from "app/state/recoil/atoms";
import { Updater } from "use-immer";
interface Props {
  updateFramesArray: Updater<IFramesArray[]>;
  framesArray: IFramesArray[];
  rowStructureType: IRowFrameStructure;
  setRowStructureType: React.Dispatch<React.SetStateAction<IRowFrameStructure>>;
  endTour: () => void;
  rightPanelOpen: boolean;
}

export default function AddRowFrameButton(props: Props) {
  const [displayTooltip, setDisplayTooltip] = React.useState<boolean>(false);
  const handleAddrowStructureBlock = () => {
    props.endTour();
    const id = v4();
    props.updateFramesArray((draft) => {
      const newRowFrame = {
        id,
        frame: {
          rowId: id,
          rowIndex: draft.length,
          type: "rowFrame" as "rowFrame",
        },
        content: [],
        contentWidths: [],
        contentHeights: [],
        contentTypes: [],
        structure: null,
      };
      draft.push(newRowFrame);
    });
    props.setRowStructureType({
      ...props.rowStructureType,
      rowType: "",
      disableAddRowStructureButton: false,
    });
  };
  const RIGHT_PANEL_WIDTH = "36.83%"; //percentage value of 274px which is the width at 768px as per design
  return (
    <div
      css={`
        width: 100%;
        @media (min-width: 768px) and (max-width: 1080px) {
          transition: width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
          width: ${props.rightPanelOpen
            ? `calc(100% - ${RIGHT_PANEL_WIDTH})`
            : "100%"};
        }
      `}
    >
      <div
        css={`
          width: 100%;
          display: flex;
          padding: 3px 0;
          background: #fff;
          justify-content: center;
          border: 1px dashed #adb5bd;
        `}
      >
        <IconButton
          disableRipple
          onClick={handleAddrowStructureBlock}
          onMouseEnter={() => setDisplayTooltip(true)}
          onMouseLeave={() => setDisplayTooltip(false)}
          disabled={props.rowStructureType.disableAddRowStructureButton}
          css={`
            padding: 4px;
          `}
          data-cy="add-row-frame-button"
        >
          <PlusIcon />
        </IconButton>
      </div>
      {displayTooltip && (
        <div
          css={`
            background-color: #626262;
            border-radius: 4px;
            font-size: 12px;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 127px;
            height: 23px;
            margin: auto;
            color: white;
          `}
        >
          <p>Add new row frame</p>
        </div>
      )}
    </div>
  );
}
