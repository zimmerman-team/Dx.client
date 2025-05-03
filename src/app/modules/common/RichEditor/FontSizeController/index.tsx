import React, { useEffect, useState, useCallback } from "react";
import { RichUtils, EditorState } from "draft-js";
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
  onFontSizeChange?: (fontSize: number) => void;
}

export default function FontSizeController(props: Props) {
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

  // Get current font size from editor state
  const getFontSizeFromEditorState = useCallback(() => {
    const editorState = props.getEditorState();
    if (!editorState) return DEFAULT_FONT_SIZE;

    const currentStyle = editorState.getCurrentInlineStyle();

    // More efficient way to find font size styles
    for (const style of currentStyle.toArray()) {
      if (style.startsWith("font-size-")) {
        const size = parseInt(style.split("-")[2], 10);
        return isNaN(size) ? DEFAULT_FONT_SIZE : size;
      }
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

      // Call optional callback
      if (props.onFontSizeChange) {
        props.onFontSizeChange(newFontSize);
      }
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

  // Handle font size decrease
  const reduceFontSize = () => {
    if (fontSize <= MIN_FONT_SIZE) return;
    const newSize = fontSize - 1;
    setFontSize(newSize);
    debouncedUpdateFontSize(newSize);
  };

  // Handle font size increase
  const increaseFontSize = () => {
    if (fontSize >= MAX_FONT_SIZE) return;
    const newSize = fontSize + 1;
    setFontSize(newSize);
    debouncedUpdateFontSize(newSize);
  };

  // Handle direct input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only accept numerical values
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      if (value.length > 3) return;

      const newSize = value === "" ? DEFAULT_FONT_SIZE : parseInt(value, 10);
      setFontSize(newSize);
      debouncedUpdateFontSize(newSize);
    }
  };

  // Sync font size with editor state on selection or content changes
  useEffect(() => {
    const editorState = props.getEditorState();

    // Create a function to update font size from editor state
    const syncFontSize = () => {
      const newSize = getFontSizeFromEditorState();
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
  }, [props.getEditorState, getFontSizeFromEditorState]);

  return (
    <div
      className="font-size-controller"
      style={{
        width: "57px",
        height: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        borderRadius: "8px",
        background: "#f4f4f4",
      }}
    >
      <span
        onClick={reduceFontSize}
        onMouseDown={(e) => e.preventDefault()}
        style={{
          fontSize: "14px",
          color: "#70777e",
          fontFamily: fontFamily,
          cursor: "pointer",
        }}
      >
        -
      </span>
      <input
        type="text"
        name="font-size"
        onChange={handleInputChange}
        value={fontSize}
        min={MIN_FONT_SIZE}
        style={{
          width: "32px",
          height: "100%",
          textAlign: "center",
          background: "transparent",
          border: "none",
          fontSize: "14px",
          fontFamily: fontFamily,
          color: "#70777e",
          outline: "none",
        }}
      />
      <span
        onClick={increaseFontSize}
        onMouseDown={(e) => e.preventDefault()}
        style={{
          fontSize: "14px",
          color: "#70777e",
          fontFamily: fontFamily,
          cursor: "pointer",
        }}
      >
        +
      </span>
    </div>
  );
}
