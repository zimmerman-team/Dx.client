import React, { useRef } from "react";
import { EditorState, RichUtils } from "draft-js";
import { Popper } from "@material-ui/core";
import { useOnClickOutside } from "usehooks-ts";
import {
  ColorService,
  IColor,
} from "app/components/ColorPicker/services/color";
import { ColorPicker } from "app/components/ColorPicker";

interface Props {
  getEditorState: () => EditorState;
  setEditorState: (value: EditorState) => void;
  theme: any;
  id: "color-popover" | "bg-popover" | undefined;
  open: boolean;
  anchorEl: HTMLDivElement | null;
  handleClose: () => void;
  hex: string;
  setHex: (color: string) => void;
  defaultColor: string; // Optional prop for default color
  prefix: string;
}

export const colorStyleFn = (style: any) => {
  const styleNames = style.toArray();
  for (const styleName of styleNames) {
    if (styleName && styleName.startsWith("COLOR-")) {
      return { color: styleName.substring("COLOR-".length) };
    }
  }
  return {}; // Default, no custom style
};

export const bgColorStyleFn = (style: any) => {
  const styleNames = style.toArray();
  for (const styleName of styleNames) {
    if (styleName && styleName.startsWith("BG-COLOR-")) {
      return { background: styleName.substring("BG-COLOR-".length) };
    }
  }
  return {}; // Default, no custom style
};

export default function ColorModal(props: Props) {
  const applyColorEntity = React.useCallback(
    (color: IColor) => {
      if (color.hex === props.hex) {
        return;
      }
      props.setHex(color.hex);
      const editorState = props.getEditorState();
      const selection = editorState.getSelection();

      // Check if there's actually text selected
      if (selection.isCollapsed()) {
        return;
      }

      //Remove all existing color styles
      let newEditorState = editorState;
      const currentStyles = editorState.getCurrentInlineStyle();

      currentStyles.forEach((style) => {
        if (style && style.startsWith(props.prefix)) {
          newEditorState = RichUtils.toggleInlineStyle(newEditorState, style);
        }
      });

      //Apply the new color style
      const colorStyleName = `${props.prefix}${color.hex}`;
      newEditorState = RichUtils.toggleInlineStyle(
        newEditorState,
        colorStyleName
      );

      props.setEditorState(newEditorState);
    },
    [props.hex, props.getEditorState, props.setEditorState]
  );

  const getCurrentSelectionColor = (): string => {
    const editorState = props.getEditorState();
    const selection = editorState.getSelection();

    let stylesToCheck;

    if (selection.isCollapsed()) {
      // For cursor position, get the current inline style
      stylesToCheck = editorState.getCurrentInlineStyle();
    } else {
      console.log();
      // For text selection, get styles at the start of selection
      const contentState = editorState.getCurrentContent();
      const anchorKey = selection.getAnchorKey();
      const currentContentBlock = contentState.getBlockForKey(anchorKey);
      const startOffset = selection.getStartOffset();

      stylesToCheck = currentContentBlock.getInlineStyleAt(startOffset);
    }

    // Find the color style
    for (const style of stylesToCheck.toArray()) {
      if (style.startsWith(props.prefix)) {
        return style.substring(props.prefix.length);
      }
    }

    return props.defaultColor; // Default fallback
  };

  React.useEffect(() => {
    props.setHex(getCurrentSelectionColor());
  }, [getCurrentSelectionColor]);

  const ref = useRef(null);
  useOnClickOutside(ref, () => props.handleClose());

  return (
    <Popper
      id={props.id}
      open={props.open}
      anchorEl={props.anchorEl}
      placement="bottom"
      style={{ zIndex: 101 }}
      ref={ref}
    >
      <ColorPicker
        onChange={applyColorEntity}
        color={ColorService.convert("hex", props.hex)}
        onResetColor={() => {
          if (props.getEditorState().getSelection().isCollapsed()) return;
          props.setHex(props.defaultColor);
          applyColorEntity(ColorService.convert("hex", props.defaultColor));
        }}
        disabled={props.getEditorState().getSelection().isCollapsed()}
      />
    </Popper>
  );
}
