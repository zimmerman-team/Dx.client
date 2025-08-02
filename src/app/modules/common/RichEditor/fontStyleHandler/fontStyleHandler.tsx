import React, { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import {
  ContentBlock,
  ContentState,
  EditorState,
  Modifier,
  RichUtils,
  SelectionState,
} from "draft-js";
import { fontStyles } from "./data";
import { IFramesArray } from "app/modules/story-module/views/create/data";
import { Updater } from "use-immer";

type FontStyleType = {
  key: string;
  label: string;
  style: string;
  height: string;
  fontSize: string;
  selected: boolean;
  blockType: string;
};

interface Props {
  getEditorState: () => EditorState;
  setEditorState: (editorState: EditorState) => void;
  framesArray: IFramesArray[];
  updateFramesArray: Updater<IFramesArray[]>;
}

export function FontStyleHandler(props: Props) {
  const ref = useRef(null);
  const [displayModal, setDisplayModal] = React.useState(false);
  const [fontStylesState, setFontStylesState] = React.useState(fontStyles);
  const [showDetail, setShowDetail] = React.useState<Partial<FontStyleType>>(
    {}
  );

  useOnClickOutside(ref, () => {
    if (displayModal) {
      setDisplayModal(false);
    }
  });

  const handleShowDetail = (style: FontStyleType, display: boolean) => {
    setFontStylesState((prevStyles) =>
      prevStyles.map((s) =>
        s.key === style.key
          ? { ...s, selected: display }
          : { ...s, selected: false }
      )
    );
    setShowDetail({
      ...style,
    });
  };
  const activeStyle = `
    background: #cfd0f4;
    border-bottom: 1px solid #8081e3;
    width: 100%;
    padding: 0 16px;
    cursor: pointer;
  `;

  const promptText = (active: boolean, label: string) => {
    if (label === "Normal") {
      return "Apply Normal style";
    }
    return active ? `Remove ${label} style` : `Apply ${label} style`;
  };

  // Get the current block type and inline styles from selected editor
  const getCurrentBlockStyleInfo = () => {
    if (!props.getEditorState) {
      return {
        currentBlockType: "unstyled", // Default block type if editor state is not available
        inlineStyles: [],
        hasContent: false,
      }; // Default block type if editor state is not available
    }
    const editorState = props.getEditorState();
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const currentBlock = contentState.getBlockForKey(selection.getStartKey());

    // Get block type
    const currentBlockType = currentBlock.getType();

    // Get inline styles at current selection
    const inlineStyles = editorState.getCurrentInlineStyle();

    return {
      currentBlockType,
      currentBlock,
      inlineStyles: inlineStyles.toArray(),
      hasContent: currentBlock.getText().length > 0,
    };
  };

  const { currentBlockType } = getCurrentBlockStyleInfo();
  const currentStyle =
    fontStylesState.find((style) => style.blockType === currentBlockType) ||
    fontStyles[0];

  const clearAllInlineStyles = (
    contentState: ContentState,
    selection: SelectionState
  ) => {
    let clearedContentState = contentState;

    // Get all unique styles in the selection
    const allStyles = new Set<string>();
    const startKey = selection.getStartKey();
    const endKey = selection.getEndKey();
    const startOffset = selection.getStartOffset();
    const endOffset = selection.getEndOffset();

    const block = contentState.getBlockForKey(startKey);
    const characterList = block.getCharacterList();

    for (let i = startOffset; i < endOffset; i++) {
      const char = characterList.get(i);
      if (char) {
        char.getStyle().forEach((style) => allStyles.add(style!));
      }
    }

    // Remove each style
    allStyles.forEach((style) => {
      clearedContentState = Modifier.removeInlineStyle(
        clearedContentState,
        selection,
        style
      );
    });

    return clearedContentState;
  };

  // Handle block type change
  const handleStyleChange = (style: FontStyleType) => {
    if (!props.getEditorState || !props.setEditorState) {
      return;
    }
    const newState = RichUtils.toggleBlockType(
      props.getEditorState(),
      style.blockType
    );
    props.setEditorState(newState);
    setDisplayModal(false);
  };

  const handleMatchingBlocks = (
    targetEditorState: EditorState,
    sourceBlock: ContentBlock
  ): EditorState => {
    const contentState = targetEditorState.getCurrentContent();
    const blockMap = contentState.getBlockMap();

    // Collect all inline styles from current block
    const inlineStyles = new Set<string>();
    sourceBlock.getCharacterList().forEach((charMeta) => {
      charMeta?.getStyle().forEach((style) => inlineStyles.add(style!));
    });

    if (inlineStyles.size === 0) return targetEditorState; // nothing to copy

    let newContentState = contentState;

    // Apply styles to each matching block
    blockMap
      .entrySeq()
      .toArray()
      .forEach(([blockKey, block]: any) => {
        if (block.getType() === currentBlockType) {
          const blockSelection = SelectionState.createEmpty(blockKey).merge({
            anchorOffset: 0,
            focusOffset: block.getLength(),
          }) as SelectionState;

          // Clear all existing styles
          newContentState = clearAllInlineStyles(
            newContentState,
            blockSelection
          );

          inlineStyles.forEach((style) => {
            newContentState = Modifier.applyInlineStyle(
              newContentState,
              blockSelection,
              style
            );
          });
          const updatedBlock = newContentState.getBlockForKey(blockKey);
          const appliedInlineStyles = new Set<string>();
          updatedBlock.getCharacterList().forEach((charMeta) => {
            charMeta
              ?.getStyle()
              .forEach((style) => appliedInlineStyles.add(style!));
          });
        }
      });

    const newEditorState = EditorState.push(
      targetEditorState,
      newContentState,
      "change-inline-style"
    );

    return EditorState.acceptSelection(
      newEditorState,
      targetEditorState.getSelection()
    );
  };

  const handleStylePropagation = (e: React.MouseEvent) => {
    e.stopPropagation();

    const { currentBlock: sourceBlock } = getCurrentBlockStyleInfo();

    const updatedFrames = props.framesArray.map((frame) => {
      const newContentList = frame.content.map((content) => {
        if (content instanceof EditorState && sourceBlock) {
          const newState = handleMatchingBlocks(content, sourceBlock);
          // ensure new reference even if unchanged
          return EditorState.forceSelection(newState, newState.getSelection());
        }
        return content;
      });

      return { ...frame, content: newContentList };
    });

    props.updateFramesArray(updatedFrames);
  };

  return (
    <>
      <div
        ref={ref}
        css={`
          position: relative;
        `}
      >
        <button
          onClick={() => setDisplayModal(!displayModal)}
          css={`
            width: 101px !important;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: ${displayModal ? "#6061E5" : "transparent"};
            color: ${displayModal ? "#F8F9FA" : "#212529"};
            border: none;
            border-radius: 4px;
            white-space: nowrap;
            gap: 7px !important;
            cursor: pointer;
            span {
              font-size: 14px;
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            }
          `}
        >
          {currentStyle.label}
          <span
            css={`
              display: flex;
              align-items: center;
              svg {
                transition: transform 0.3s ease-in-out;
                transform: ${displayModal ? "rotate(180deg)" : "rotate(0deg)"};
                margin-bottom: -2px;
              }
            `}
          >
            <svg
              width="11"
              height="6"
              viewBox="0 0 11 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.29199 5.9998L0.291992 0.999804L0.991992 0.299805L5.29199 4.5998L9.59199 0.299805L10.292 0.999804L5.29199 5.9998Z"
                fill={displayModal ? "#fff" : "#212529"}
              />
            </svg>
          </span>
        </button>
        <div
          css={`
            width: 200px;
            border-radius: 10px;
            box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.3);
            position: absolute;
            top: 102%;
            left: -20%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            opacity: ${displayModal ? 1 : 0};
            height: ${displayModal ? "auto" : "0px"};
            overflow: ${displayModal ? "unset" : "hidden"};
            transition: all 0.3s ease-in-out;
            background: #f1f3f5;
          `}
        >
          {fontStylesState.map((style, index) => (
            <div
              key={style.key}
              onClick={(e) => {
                e.stopPropagation();
                handleStyleChange(style);
              }}
              onMouseEnter={() => handleShowDetail(style, true)}
              onMouseLeave={() => handleShowDetail(style, false)}
              css={`
                height: ${style.height};
                display: flex;
                align-items: center;
                justify-content: space-between;
                ${index === fontStylesState.length - 1 ||
                fontStylesState[index + 1]?.selected
                  ? ""
                  : "border-bottom: 1px solid #cfd4da;"}
                width: 168px;
                position: relative;
                cursor: pointer;
                ${style.selected && activeStyle}
              `}
            >
              <div css={``}>
                <span
                  css={`
                    font-size: ${style.fontSize};
                    font-family: ${style.fontFamily};
                    text-transform: capitalize;
                  `}
                >
                  {style.label}
                </span>
              </div>
              <div
                css={`
                  display: flex;
                  gap: 16px;
                  button {
                    background: none;
                    border: none;
                    outline: none;
                    cursor: pointer;
                    padding: 0;
                    width: max-content;
                  }
                `}
              >
                {style.label === currentStyle.label && (
                  <button>
                    <svg
                      width="15"
                      height="11"
                      viewBox="0 0 15 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.292 1.5L5.04199 9.75L1.29199 6"
                        stroke="#70777E"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                )}
                {/* <button>
                  <ChevronRightIcon />
                </button> */}
              </div>
              <div
                css={`
                  display: ${style.selected ? "flex" : "none"};
                  width: 250px;
                  flex-direction: column;
                  align-items: flex-start;
                  justify-content: center;
                  border-radius: 10px;
                  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.3);
                  padding: 0px 16px;
                  background: #f1f3f5;
                  position: absolute;
                  left: 90%;
                  top: 0;
                  div {
                    width: 100%;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    font-family: "GothamNarrow-Book", "Helvetica Neue",
                      sans-serif;
                  }
                `}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStyleChange(style);
                  }}
                  css={`
                    border-bottom: 1px solid #cfd4da;
                  `}
                >
                  {promptText(style.label === currentStyle.label, style.label)}
                </div>

                <div
                  onClick={handleStylePropagation}
                  css={`
                    border-bottom: 1px solid #cfd4da;
                  `}
                >
                  Apply text to match
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
