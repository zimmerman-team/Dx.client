import React from "react";
import { EditorState, RichUtils } from "draft-js";
import { Tooltip } from "@material-ui/core";

interface IndentButtonProps {
  getEditorState: () => EditorState;

  setEditorState: (state: EditorState) => void;
}

export const IncreaseIndentButton: React.FC<IndentButtonProps> = ({
  getEditorState,
  setEditorState,
}) => {
  const handleIncreaseIndent = () => {
    const editorState = getEditorState();
    const selection = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
    const currentDepth = currentBlock.getDepth();
    const blockType = currentBlock.getType();

    // Don't indent certain block types
    const nonIndentableTypes = [
      "header-one",
      "header-two",
      "header-three",
      "header-four",
      "header-five",
      "header-six",
    ];
    if (nonIndentableTypes.includes(blockType)) {
      return;
    }

    // Limit maximum depth (usually 4-6 levels)
    if (currentDepth >= 6) {
      return;
    }
    // Increase depth
    const newEditorState = RichUtils.onTab(
      { preventDefault: () => {} } as any,
      editorState,
      6 // maxDepth
    );

    if (newEditorState !== editorState) {
      setEditorState(newEditorState);
    }
  };

  return (
    <Tooltip title="Increase Indent" placement="bottom">
      <button
        onClick={handleIncreaseIndent}
        title="Increase Indent"
        css={`
          border: none;
          background: transparent;
          padding: 0;
          cursor: pointer;
          outline: none;
          width: 28px !important;
          border-radius: 8px;
          :hover {
            background: #f2f2f2;
          }
        `}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.50879 11.4998V16.4998L9.00879 13.9998L6.50879 11.4998ZM6.50879 19.8332H21.5088V18.1665H6.50879V19.8332ZM6.50879 9.83317H21.5088V8.1665H6.50879V9.83317ZM11.5088 13.1665H21.5088V11.4998H11.5088V13.1665ZM11.5088 16.4998H21.5088V14.8332H11.5088V16.4998Z"
            fill="#212529"
          />
        </svg>
      </button>
    </Tooltip>
  );
};

export const DecreaseIndentButton: React.FC<IndentButtonProps> = ({
  getEditorState,
  setEditorState,
}) => {
  const handleDecreaseIndent = () => {
    const editorState = getEditorState();
    const selection = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
    const currentDepth = currentBlock.getDepth();

    // Can't decrease if already at 0 depth
    if (currentDepth === 0) {
      return;
    }

    //Shift+Tab behavior to decrease indent
    const newEditorState = RichUtils.onTab(
      {
        preventDefault: () => {},
        shiftKey: true,
      } as any,
      editorState,
      6 // maxDepth
    );

    if (newEditorState !== editorState) {
      setEditorState(newEditorState);
    }
  };

  return (
    <Tooltip title="Decrease Indent" placement="bottom">
      <button
        onClick={handleDecreaseIndent}
        title="Decrease Indent"
        css={`
          border: none;
          background: transparent;
          padding: 0;
          cursor: pointer;
          outline: none;
          width: 28px !important;
          border-radius: 8px;

          :hover {
            background: #f2f2f2;
          }
        `}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.50879 13.9998L9.00879 16.4998V11.4998L6.50879 13.9998ZM6.50879 19.8332H21.5088V18.1665H6.50879V19.8332ZM6.50879 9.83317H21.5088V8.1665H6.50879V9.83317ZM11.5088 13.1665H21.5088V11.4998H11.5088V13.1665ZM11.5088 16.4998H21.5088V14.8332H11.5088V16.4998Z"
            fill="#212529"
          />
        </svg>
      </button>
    </Tooltip>
  );
};
