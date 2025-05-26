import React, { Component, useRef } from "react";
import { EditorState, Modifier, RichUtils } from "draft-js";
import Picker from "app/modules/common/RichEditor/ColorModal/Picker";
import { Popper } from "@material-ui/core";
import { useOnClickOutside } from "usehooks-ts";
import {
  ColorService,
  IColor,
} from "app/components/ColorPicker/services/color";
import { ColorPicker } from "app/components/ColorPicker";
import { addColorDecorator } from "app/modules/common/RichEditor/decorators";

interface Props {
  getEditorState: () => EditorState;
  setEditorState: (value: EditorState) => void;
  theme: any;
  id: "color-popover" | undefined;
  open: boolean;
  anchorEl: HTMLDivElement | null;
  handleClose: () => void;
}

export default function ColorModal(props: Props) {
  const [hex, setHex] = React.useState("#000000");

  const applyColorEntity = React.useCallback(
    (color: IColor) => {
      // Prevent unnecessary updates if color hasn't changed
      if (color.hex === hex) {
        return;
      }

      setHex(color.hex);
      const editorState = props.getEditorState();

      // Ensure decorator is added FIRST
      const editorStateWithDecorator = addColorDecorator(editorState);

      const contentState = editorStateWithDecorator.getCurrentContent();
      const selection = editorStateWithDecorator.getSelection();

      // Check if there's actually text selected
      if (selection.isCollapsed()) {
        console.log("No text selected");
        return;
      }

      console.log("Applying color entity:", color.hex);

      // Create entity with the actual color value stored as data
      const contentStateWithEntity = contentState.createEntity(
        "COLOR",
        "MUTABLE",
        { color: color.hex }
      );

      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

      // Use Modifier.applyEntity instead of RichUtils.toggleLink
      const contentStateWithAppliedEntity = Modifier.applyEntity(
        contentStateWithEntity,
        selection,
        entityKey
      );

      // Create final editor state
      const finalEditorState = EditorState.push(
        editorStateWithDecorator,
        contentStateWithAppliedEntity,
        "apply-entity"
      );

      // Force selection update to ensure decorator renders
      const finalStateWithSelection = EditorState.forceSelection(
        finalEditorState,
        selection
      );

      props.setEditorState(finalStateWithSelection);
    },
    [hex, props.getEditorState, props.setEditorState]
  );

  const getCurrentSelectionColor = (): string => {
    const editorState = props.getEditorState();
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();

    if (selection.isCollapsed()) {
      return "#000000";
    }

    const startKey = selection.getStartKey();
    const startOffset = selection.getStartOffset();
    const block = contentState.getBlockForKey(startKey);
    const entityKey = block.getEntityAt(startOffset);

    if (entityKey) {
      const entity = contentState.getEntity(entityKey);
      if (entity.getType() === "COLOR") {
        return entity.getData().color;
      }
    }

    return "#000000";
  };

  console.log("Current selection color:", getCurrentSelectionColor());

  const ref = useRef(null);
  useOnClickOutside(ref, () => props.handleClose());

  return (
    <Popper
      id={props.id}
      open={props.open}
      anchorEl={props.anchorEl}
      placement="bottom"
      ref={ref}
    >
      <ColorPicker
        onChange={applyColorEntity}
        color={ColorService.convert("hex", hex)}
      />
    </Popper>
  );
}
