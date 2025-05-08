import { EditorState, RichUtils } from "draft-js";
import React, { useEffect, useCallback } from "react";
import styled from "styled-components";
import debounce from "lodash/debounce";

// Define constants for better readability and maintainability
const DEFAULT_FONT_SIZE = 14;
const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 999;
const HEADER_ONE_SIZE = 28;
const HEADER_TWO_SIZE = 21;
const fontFamily = '"GothamNarrow-Bold", "Helvetica Neue", sans-serif';
interface Props {
  getEditorState: () => EditorState;
  setEditorState: (editorState: EditorState) => void;
}

const FontSizeContainer = styled.div`
  width: 57px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border-radius: 8px;
  background: #f4f4f4;
`;

const SizeButton = styled.span`
  font-size: 14px;
  color: #70777e;
  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
  cursor: pointer;
  user-select: none;
`;

const SizeInput = styled.input`
  width: 32px;
  height: 100%;
  text-align: center;
  background: transparent;
  border: none;
  font-size: 14px;
  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
  color: #70777e;
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
    if (selection.isCollapsed()) {
      const currentContent = editorState.getCurrentContent();
      const blockType = currentContent
        .getBlockForKey(selection.getStartKey())
        .getType();

      if (blockType === "header-one") return HEADER_ONE_SIZE;
      if (blockType === "header-two") return HEADER_TWO_SIZE;
    }
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

    // Create a function to update font size from editor state
    const syncFontSize = () => {
      const newSize = getCurrentFontSize();
      setFontSize(newSize);
    };

    // Initial sync
    syncFontSize();

    // Setup listeners for selection and content changes
    const currentSelection = editorState.getSelection();
    let prevSelection = currentSelection;

    const checkForChanges = () => {
      const newEditorState = props.getEditorState();
      const newSelection = newEditorState.getSelection();

      // Check if selection changed
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
        -
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
        +
      </SizeButton>
    </FontSizeContainer>
  );
}
