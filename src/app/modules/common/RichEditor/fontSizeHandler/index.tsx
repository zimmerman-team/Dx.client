import React, { useEffect, useCallback } from "react";
import { EditorState, RichUtils } from "draft-js";
import styled from "styled-components";
import debounce from "lodash/debounce";

// Define constants for better readability and maintainability
const DEFAULT_FONT_SIZE = 14;
const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 999;
const HEADER_ONE_SIZE = 24;
const HEADER_TWO_SIZE = 21;
const TITLE_FONT_SIZE = 28; // Assuming a title font size for consistency
const fontFamily = '"GothamNarrow-Bold", "Helvetica Neue", sans-serif';
interface Props {
  getEditorState: () => EditorState;
  setEditorState: (editorState: EditorState) => void;
}

const FontSizeContainer = styled.div`
  width: 105px;
  height: 28px;
  padding: 0 7px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  border: 1px solid #cfd4da;
  background: #fff;
  box-shadow: 0px 1px 2px 0px rgba(26, 26, 26, 0.08);
`;

const SizeButton = styled.button`
  font-size: 14px;
  /* color: #70777e; */
  font-family: ${fontFamily};
  cursor: pointer;
  border: none;
  background: transparent;
  outline: none;
  user-select: none;
  width: auto !important;
`;

const SizeInput = styled.input`
  width: 32px;
  height: 100%;
  text-align: center;
  background: transparent;
  border: none;
  font-size: 14px;
  font-family: ${fontFamily};
  color: #231d2c;
  outline: none;
`;

export default function FontSizeController(props: Props) {
  const [fontSize, setFontSize] = React.useState(DEFAULT_FONT_SIZE);

  // Helper to extract current font size from editor state
  const getCurrentFontSize = useCallback(() => {
    const editorState = props.getEditorState();
    if (!editorState) return DEFAULT_FONT_SIZE;
    const currentStyle = editorState.getCurrentInlineStyle();

    // Find any font-size style
    const fontSizeStyle = currentStyle.findLast((style: any) =>
      style.includes("font-size")
    );

    if (fontSizeStyle) {
      const size = parseInt(fontSizeStyle.split("-")[2], 10);
      return isNaN(size) ? DEFAULT_FONT_SIZE : size;
    }

    // If no inline font style, check block type
    const selection = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();
    const blockType = currentContent
      .getBlockForKey(selection.getStartKey())
      .getType();

    if (blockType === "header-one") return HEADER_ONE_SIZE;
    if (blockType === "header-two") return HEADER_TWO_SIZE;
    if (blockType === "title") return TITLE_FONT_SIZE;
    return DEFAULT_FONT_SIZE;
  }, [props]);

  useEffect(() => {
    // Only update local state when editor state changes
    setFontSize(getCurrentFontSize());
  }, [props.getEditorState(), getCurrentFontSize]);

  // Update the editor state with new font size
  const updateEditorStateWithFontSize = useCallback(
    (newFontSize: number) => {
      const editorState = props.getEditorState();
      const currentStyle = editorState.getCurrentInlineStyle();
      let nextEditorState = editorState;

      // First, remove any existing font-size styles
      currentStyle.forEach((style) => {
        if (style?.startsWith("font-size-")) {
          nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, style);
        }
      });

      // Then add the new font-size style
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        `font-size-${newFontSize}`
      );

      props.setEditorState(nextEditorState);
    },
    [props]
  );

  // Debounced version of the update function to prevent excessive updates
  const debouncedUpdateFontSize = useCallback(
    debounce((size: number) => {
      updateEditorStateWithFontSize(size);
    }, 50),
    [updateEditorStateWithFontSize]
  );

  // Sync font size with editor state on selection or content changes
  useEffect(() => {
    const editorState = props.getEditorState();

    const syncFontSize = () => {
      const newSize = getCurrentFontSize();
      setFontSize(newSize);
    };

    syncFontSize();

    const currentSelection = editorState.getSelection();
    let prevSelection = currentSelection;

    const checkForChanges = () => {
      const newEditorState = props.getEditorState();
      const newSelection = newEditorState.getSelection();

      if (
        newSelection.getStartKey() !== prevSelection.getStartKey() ||
        newSelection.getStartOffset() !== prevSelection.getStartOffset() ||
        newSelection.getEndKey() !== prevSelection.getEndKey() ||
        newSelection.getEndOffset() !== prevSelection.getEndOffset()
      ) {
        syncFontSize();
        prevSelection = newSelection;
      }
    };

    // Set an interval to check for selection changes
    // This helps catch selection changes that might not trigger component re-renders
    const interval = setInterval(checkForChanges, 100);

    return () => {
      clearInterval(interval);
    };
  }, [props.getEditorState, getCurrentFontSize]);

  const reduceFontSize = () => {
    if (fontSize <= MIN_FONT_SIZE) return;
    const newSize = fontSize - 1;
    debouncedUpdateFontSize(newSize);
    setFontSize(newSize);
  };

  const increaseFontSize = () => {
    if (fontSize >= MAX_FONT_SIZE) return;
    const newSize = fontSize + 1;
    debouncedUpdateFontSize(newSize);
    setFontSize(newSize);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Number validation with regex so input only accepts number characters
    if (e.target.value === "" || /^[0-9\b]+$/.test(e.target.value)) {
      if (e.target.value.length > 3) return;
      const newSize = e.target.value === "" ? 1 : Number(e.target.value);
      debouncedUpdateFontSize(newSize);
      setFontSize(newSize);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      increaseFontSize();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      reduceFontSize();
    }
  };

  return (
    <FontSizeContainer>
      <SizeButton
        onClick={reduceFontSize}
        onMouseDown={(e) => e.preventDefault()}
        role="button"
        aria-label="Decrease font size"
        tabIndex={0}
      >
        <svg
          width="14"
          height="2"
          viewBox="0 0 14 2"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.95862 0.262207H13.1209C13.5281 0.262207 13.8583 0.592381 13.8583 0.999671C13.8583 1.40696 13.5281 1.73713 13.1209 1.73713H7.95862H6.48369H1.32145C0.914158 1.73713 0.583984 1.40696 0.583984 0.99967C0.583984 0.592381 0.914158 0.262207 1.32145 0.262207H6.48369H7.95862Z"
            fill="#231D2C"
          />
        </svg>
      </SizeButton>
      <SizeInput
        type="text"
        aria-label="Font size"
        value={fontSize}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        min={MIN_FONT_SIZE}
        max={MAX_FONT_SIZE}
      />
      <SizeButton
        onClick={increaseFontSize}
        onMouseDown={(e) => e.preventDefault()}
        role="button"
        aria-label="Increase font size"
        tabIndex={0}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.07955 0.362793C7.48684 0.362793 7.81701 0.692966 7.81701 1.10026V6.2625H12.9793C13.3865 6.2625 13.7167 6.59267 13.7167 6.99996C13.7167 7.40725 13.3865 7.73742 12.9793 7.73742H7.81701V12.8997C7.81701 13.307 7.48684 13.6371 7.07955 13.6371C6.67226 13.6371 6.34209 13.307 6.34209 12.8997V7.73742H1.17985C0.772556 7.73742 0.442383 7.40725 0.442383 6.99996C0.442383 6.59267 0.772556 6.2625 1.17985 6.2625L6.34209 6.2625V1.10026C6.34209 0.692966 6.67226 0.362793 7.07955 0.362793Z"
            fill="#231D2C"
          />
        </svg>
      </SizeButton>
    </FontSizeContainer>
  );
}
