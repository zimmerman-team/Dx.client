import { EditorState, RichUtils } from "draft-js";
import React, { useEffect, useCallback } from "react";
import styled from "styled-components"; // Assuming you're using styled-components for CSS-in-JS

interface Props {
  getEditorState: () => EditorState;
  setEditorState: (value: EditorState) => void;
  theme: any;
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
  const [fontSize, setFontSize] = React.useState(14);

  // Helper to extract current font size from editor state
  const getCurrentFontSize = useCallback(() => {
    const editorState = props.getEditorState();
    const currentStyle = editorState.getCurrentInlineStyle();

    // Find any font-size style
    const fontSizeStyle = currentStyle.findLast((style: any) =>
      style.includes("font-size")
    );

    if (fontSizeStyle) {
      const size = fontSizeStyle.split("-")[2];
      return Number(size);
    }

    // Default sizes based on block type
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(editorState.getSelection().getStartKey())
      .getType();

    if (blockType === "header-one") return 28;
    if (blockType === "header-two") return 21;
    return 14;
  }, [props]);

  useEffect(() => {
    // Only update local state when editor state changes
    setFontSize(getCurrentFontSize());
  }, [props.getEditorState(), getCurrentFontSize]);

  const updateEditorStateWithFontSize = (newSize: number) => {
    if (newSize < 1 || newSize > 999) return;

    const editorState = props.getEditorState();
    const currentStyle = editorState.getCurrentInlineStyle();
    let newEditorState = editorState;

    // Remove any existing font-size styles
    currentStyle.forEach((style) => {
      if (style && style.startsWith("font-size-")) {
        newEditorState = RichUtils.toggleInlineStyle(newEditorState, style);
      }
    });

    // Apply the new font size
    props.setEditorState(
      RichUtils.toggleInlineStyle(newEditorState, `font-size-${newSize}`)
    );
  };

  const reduceFontSize = () => {
    if (fontSize <= 1) return;
    const newSize = fontSize - 1;
    updateEditorStateWithFontSize(newSize);
    setFontSize(newSize);
  };

  const increaseFontSize = () => {
    if (fontSize >= 999) return;
    const newSize = fontSize + 1;
    updateEditorStateWithFontSize(newSize);
    setFontSize(newSize);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Number validation with regex so input only accepts number characters
    if (e.target.value === "" || /^[0-9\b]+$/.test(e.target.value)) {
      if (e.target.value.length > 3) return;
      const newSize = e.target.value === "" ? 1 : Number(e.target.value);
      updateEditorStateWithFontSize(newSize);
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
        min={1}
        max={999}
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
