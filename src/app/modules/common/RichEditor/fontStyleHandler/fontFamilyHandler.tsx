import React, { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { EditorState, Modifier, SelectionState } from "draft-js";
import { fontFamilies, fontFamilyStyleMap } from "./data";

interface FontFamilyType {
  label: string;
  fontFamily: string;
  selected?: boolean;
}
interface Props {
  getEditorState: () => EditorState;
  setEditorState: (editorState: EditorState) => void;
}

const EDITOR_STATE_UNDEFINED_MESSAGE =
  "getEditorState function is not provided.";
export function FontFamilyHandler(props: Props) {
  const [displayModal, setDisplayModal] = React.useState(false);
  const [fontStylesState, setFontStylesState] = React.useState(fontFamilies);
  const selection = props.getEditorState
    ? props.getEditorState().getSelection()
    : null;
  const currentContent = props.getEditorState
    ? props.getEditorState().getCurrentContent()
    : null;
  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    if (displayModal) {
      setDisplayModal(false);
    }
  });
  function removeFontFamilyStyles(
    contentState: any,
    selection: SelectionState
  ) {
    let newContentState = contentState;
    Object.keys(fontFamilyStyleMap).forEach((style) => {
      newContentState = Modifier.removeInlineStyle(
        newContentState,
        selection,
        style
      );
    });

    return newContentState;
  }

  const getCurrentFontFamily = () => {
    if (!selection || !currentContent) {
      return "default";
    }
    const startKey = selection.getStartKey();
    const startOffset = selection.getStartOffset();
    const currentBlock = currentContent.getBlockForKey(startKey);
    const currentInlineStyle = currentBlock.getInlineStyleAt(startOffset);
    const fontFamilyStyle = currentInlineStyle.find((style) => {
      if (!style) return false;
      return style.startsWith("FONT_FAMILY_");
    });

    if (fontFamilyStyle) {
      return fontFamilyStyle.replace("FONT_FAMILY_", "").toLowerCase();
    }

    return "default";
  };
  const currentFontFamily =
    fontFamilies.find(
      (style) =>
        style.label.toLowerCase().replace(/\s/g, "_") === getCurrentFontFamily()
    ) || fontFamilies[fontFamilies.length - 1];

  const handleFontFamilyChange = (style: FontFamilyType) => {
    if (
      !props.getEditorState ||
      !props.setEditorState ||
      !selection ||
      !currentContent
    ) {
      return;
    }
    const editorState = props.getEditorState();
    const newfontFamilyStyle =
      "FONT_FAMILY_" + style.label.toUpperCase().replace(/\s/g, "_");

    // Remove existing font family styles
    let newContentState = removeFontFamilyStyles(currentContent, selection);

    // Apply the new font family style
    newContentState = Modifier.applyInlineStyle(
      newContentState,
      selection,
      newfontFamilyStyle
    );

    // Create new editor state
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "change-inline-style"
    );

    props.setEditorState(newEditorState);
  };

  const handleSelect = (style: FontFamilyType, display: boolean) => {
    handleFontFamilyChange(style);
    setFontStylesState((prevStyles) =>
      prevStyles.map((s) =>
        s.label === style.label
          ? { ...s, selected: display }
          : { ...s, selected: false }
      )
    );
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
            width: 100%;
            height: 28px;
            padding: 0 8px !important;
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
          {currentFontFamily.label}
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
              key={style.label}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(style, true);
              }}
              css={`
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                ${index === fontStylesState.length - 1
                  ? ""
                  : "border-bottom: 1px solid #cfd4da;"}
                width: 168px;
                cursor: pointer;
              `}
            >
              <div css={``}>
                <span
                  css={`
                    font-size: 14px;
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
                {currentFontFamily.label === style.label && (
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
