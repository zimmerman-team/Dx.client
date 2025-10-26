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
import { fontFamilies, fontStyles } from "./data";
import { IFramesArray } from "app/modules/story-module/views/create/data";
import { Updater } from "use-immer";
import { IUniformBlockTypeStyle } from "app/modules/story-module/data";
import { setBlockData } from "app/utils/draftjs/setBlockData";
import { registerDynamicStyle } from "app/utils/draftjs/getStyleEl";

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
  uniformBlockTypeStyle: IUniformBlockTypeStyle;
  setUniformBlockTypeStyle: React.Dispatch<
    React.SetStateAction<IUniformBlockTypeStyle>
  >;
}

export function FontStyleHandler(props: Props) {
  const ref = useRef(null);
  const [displayModal, setDisplayModal] = React.useState(false);
  const [fontStylesState, setFontStylesState] = React.useState(fontStyles);

  const editorChangeType = "change-inline-style";

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
  };
  const activeStyle = `
    background: #cfd0f4;
    border-bottom: 1px solid #8081e3;
   
    padding: 0 16px;
    cursor: pointer;
  `;

  const promptText = (active: boolean, label: string) => {
    if (label === "Normal") {
      return "Apply Normal style";
    }
    return active ? `Remove ${label} style` : `Apply ${label} style`;
  };

  const getEditorStateProperties = (editorState: EditorState) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const blockKey = selection.getStartKey();
    const block = contentState.getBlockForKey(blockKey);
    const blockType = block.getType();
    const inlineStyles = editorState.getCurrentInlineStyle();
    return {
      selection,
      contentState,
      blockKey,
      block,
      blockType,
      inlineStyles,
    };
  };

  function mapInlineStyleToCss(style: string): {
    field: string;
    value: string;
    className: string;
    cssRule: string;
  } | null {
    if (style.startsWith("COLOR-#")) {
      const hex = style.replace("COLOR-", "");
      return {
        field: "color",
        value: `${hex}`,
        className: `COLOR-${hex}`,
        cssRule: `color: ${hex};`,
      };
    }

    if (style === "BOLD") {
      return {
        field: "fontWeight",
        value: "bold",
        className: "BOLD",
        cssRule: "font-weight: bold;",
      };
    }

    if (style === "ITALIC") {
      return {
        field: "italic",
        value: "italic",
        className: "ITALIC",
        cssRule: "font-style: italic;",
      };
    }

    if (style.startsWith("FONT_FAMILY_")) {
      const font = style.replace("FONT_FAMILY_", "");
      return {
        field: "fontFamily",
        value: font,
        className: style,
        cssRule: `font-family: ${font};`,
      };
    }

    return null;
  }

  const isNormalBlockType = (sourceBT: string, targetBT: string) => {
    if (
      sourceBT !== "unstyled" &&
      sourceBT !== "ordered-list-item" &&
      sourceBT !== "unordered-list-item" &&
      sourceBT !== "blockquote"
    ) {
      return false;
    }
    return (
      targetBT === "unstyled" ||
      targetBT === "ordered-list-item" ||
      targetBT === "unordered-list-item" ||
      targetBT === "blockquote"
    );
  };

  // Get the current block type and inline styles from selected editor
  const getCurrentBlockStyleInfo = () => {
    if (!props.getEditorState) {
      return {
        currentBlockType: "unstyled", // Default block type if editor state is not available
        inlineStyles: [],
        hasContent: false,
      };
    }
    const editorState = props.getEditorState();
    const { block, blockType, inlineStyles } =
      getEditorStateProperties(editorState);

    return {
      currentBlockType: blockType,
      currentBlock: block,
      inlineStyles: inlineStyles.toArray(),
      hasContent: block.getText().length > 0,
    };
  };

  const { currentBlockType } = getCurrentBlockStyleInfo();
  const currentBlockStyle =
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
    try {
      let editorState = props.getEditorState();

      // Apply block type change first
      editorState = RichUtils.toggleBlockType(editorState, style.blockType);
      // Get fresh selection and content after block type change
      const { block, blockKey, contentState, selection } =
        getEditorStateProperties(editorState);

      const inlineStylesToApply =
        props.uniformBlockTypeStyle[
          style.blockType as keyof typeof props.uniformBlockTypeStyle
        ]?.inlineStyles;

      if (inlineStylesToApply) {
        const clearedContentState = clearAllInlineStyles(
          contentState,
          selection
        );
        let newContent = clearedContentState;
        // Create selection for entire block
        const blockSelection = SelectionState.createEmpty(blockKey).merge({
          anchorOffset: 0,
          focusOffset: block.getLength(),
        }) as SelectionState;

        inlineStylesToApply.forEach((inlineStyle) => {
          newContent = Modifier.applyInlineStyle(
            newContent,
            blockSelection,
            inlineStyle
          );
        });
        editorState = EditorState.push(
          editorState,
          newContent,
          editorChangeType
        );
      } else {
        // If no inline styles, clear all inline styles in the block
        const clearedContentState = clearAllInlineStyles(
          contentState,
          selection
        );
        editorState = EditorState.push(
          editorState,
          clearedContentState,
          editorChangeType
        );
      }
      props.setEditorState(editorState);
      setDisplayModal(false);
    } catch (e) {
      console.error("Error in handleStyleChange:", e);
      return null;
    }
  };

  const updateBlockStyleLabelCss = (
    stylesArray: string[],
    blockType: string
  ) => {
    const css: string[] = [];

    const keywordMap: Record<string, string> = {
      UNDERLINE: "text-decoration: underline",
      ITALIC: "font-style: italic",
      BOLD: "font-weight: bold",
      center: "text-align: center",
    };

    const maxFontSize = blockType === "title" ? 40 : 28;

    const getFontFamilyCss = (value: string) => {
      const label = value
        .replace("FONT_FAMILY_", "")
        .toLowerCase()
        .replace(/_/g, " ");
      const fontObj = fontFamilies.find((f) => f.label.toLowerCase() === label);
      return fontObj ? `font-family: ${fontObj.fontFamily}` : null;
    };

    for (const value of stylesArray) {
      if (value.startsWith("font-size-")) {
        const size = parseInt(value.split("font-size-")[1]);
        css.push(`font-size: ${Math.min(size, maxFontSize)}px`);
      } else if (value.startsWith("COLOR-")) {
        css.push(`color: ${value.split("COLOR-")[1]}`);
      } else if (value.startsWith("BG-COLOR-")) {
        css.push(`background-color: ${value.split("BG-COLOR-")[1]}`);
      } else if (value.startsWith("FONT_FAMILY_")) {
        const fontCss = getFontFamilyCss(value);
        if (fontCss) css.push(fontCss);
      } else if (keywordMap[value]) {
        css.push(keywordMap[value]);
      }
    }

    const cssString = css.join("; ") + ";";
    console.log(cssString, "css");
    return cssString;
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
    let newEditorState;
    const normalBlockTypes = {
      unstyled: "unstyled",
      "ordered-list-item": "unstyled",
      "unordered-list-item": "unstyled",
      blockquote: "unstyled",
    };
    const sourceBlockType =
      normalBlockTypes[
        sourceBlock.getType() as keyof typeof normalBlockTypes
      ] ?? sourceBlock.getType();
    props.setUniformBlockTypeStyle((prev) => ({
      ...prev,
      [sourceBlockType]: {
        css: updateBlockStyleLabelCss(
          Array.from(inlineStyles),
          sourceBlock.getType()
        ),
        inlineStyles: Array.from(inlineStyles),
      },
    }));

    // Apply styles to each matching block
    blockMap
      .entrySeq()
      .toArray()
      .forEach(([blockKey, block]: any) => {
        // Only apply to blocks of the same
        if (
          block.getType() === currentBlockType ||
          isNormalBlockType(currentBlockType, block.getType())
        ) {
          const blockSelection = SelectionState.createEmpty(blockKey).merge({
            anchorOffset: 0,
            focusOffset: block.getLength(),
          }) as SelectionState;

          // Clear all existing styles
          newContentState = clearAllInlineStyles(
            newContentState,
            blockSelection
          );
          // Apply each inline style
          inlineStyles.forEach((style) => {
            newContentState = Modifier.applyInlineStyle(
              newContentState,
              blockSelection,
              style
            );
            // Map inline style to CSS and apply block data
            const mapped = mapInlineStyleToCss(style);
            if (mapped) {
              const updatedBlock = newContentState.getBlockForKey(blockKey);
              const blockData = updatedBlock
                .getData()
                .set(mapped.field, mapped.value);

              const newBlock = updatedBlock.merge({
                data: blockData,
              }) as ContentBlock;

              newContentState = newContentState.merge({
                blockMap: newContentState.getBlockMap().set(blockKey, newBlock),
              }) as typeof newContentState;

              registerDynamicStyle(mapped.className, mapped.cssRule);
            }
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

    newEditorState = EditorState.push(
      targetEditorState,
      newContentState,
      editorChangeType
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
    setDisplayModal(false);
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
          {currentBlockStyle.label}
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
            min-width: 200px;

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
                min-height: ${style.height};
                display: flex;
                align-items: center;
                ${index === fontStylesState.length - 1 ||
                fontStylesState[index + 1]?.selected
                  ? ""
                  : "border-bottom: 1px solid #cfd4da;"}

                width: 100%;
                padding: 0 10px;

                position: relative;
                cursor: pointer;
                ${style.selected && activeStyle}
              `}
            >
              <div
                css={`
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  /* width: 90%; */
                  gap: 8px;
                `}
              >
                <span
                  css={`
                    font-size: ${style.fontSize};
                    font-family: ${style.fontFamily};
                    text-transform: capitalize;
                    white-space: nowrap;
                    ${props.uniformBlockTypeStyle
                      ? props.uniformBlockTypeStyle[
                          style.blockType as keyof typeof props.uniformBlockTypeStyle
                        ]?.css
                      : ""}
                  `}
                >
                  {style.label}
                </span>

                <div
                  css={`
                    display: flex;
                    gap: 16px;
                    flex-shrink: 0;
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
                  {style.label === currentBlockStyle.label && (
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
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
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
                  {promptText(
                    style.label === currentBlockStyle.label,
                    style.label
                  )}
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
