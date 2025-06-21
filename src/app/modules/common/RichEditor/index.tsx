/* Other imports*/
import React, { ReactElement, useRef } from "react";
import { ToolbarPluginsType } from "app/modules/story-module/components/storySubHeaderToolbar/staticToolbar";
import { useRecoilState } from "recoil";
import {
  textEditorElementIdAtom,
  textEditorElementIdAtomType,
} from "app/state/recoil/atoms";
import fontSizeStyleMap from "app/modules/common/RichEditor/fontSizeHandler/styleMap";
import { blockStyleFn, fontFamilyStyleMap } from "./fontStyleHandler/data";
import { colorStyleFn, bgColorStyleFn, gothamBoldFn } from "./ColorModal";
import { useEditorPlugins } from "app/hooks/useEditorPlugins";
/*plugins */
import { DraftHandleValue, EditorState, RichUtils } from "draft-js";
import Editor from "@draft-js-plugins/editor";
import "@draft-js-plugins/anchor/lib/plugin.css";
import "@draft-js-plugins/inline-toolbar/lib/plugin.css";
import "@draft-js-plugins/static-toolbar/lib/plugin.css";
import "@draft-js-plugins/emoji/lib/plugin.css";
/* stylesheets */
import "./style/indent.css";
import editorStyles from "./style/editorStyles.module.css";
import "./fontStyleHandler/style.css";

export const RichEditor = (props: {
  editMode: boolean;
  fullWidth?: boolean;
  placeholderState: string;
  invertColors?: boolean;
  textContent: EditorState;
  setTextContent: (value: EditorState) => void;
  setPluginsState: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
  focusOnMount?: boolean;
  setPlaceholderState: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  onBlur?: () => void;
  onFocus?: () => void;
  elementId?: textEditorElementIdAtomType;
  handleBeforeInput?:
    | ((
        chars: string,
        editorState: EditorState,
        eventTimeStamp: number
      ) => DraftHandleValue)
    | undefined;
  handlePastedText?:
    | ((
        text: string,
        html: string | undefined,
        editorState: EditorState
      ) => DraftHandleValue)
    | undefined;
  testId?: string;
}): ReactElement => {
  const editor = useRef<Editor | null>(null);
  const [_elementId, setElementId] = useRecoilState(textEditorElementIdAtom);
  const { plugins: localPlugins } = useEditorPlugins();

  const focus = (): void => {
    setElementId(props.elementId as textEditorElementIdAtomType);
    editor.current?.focus();
  };

  React.useEffect(() => {
    if (props.focusOnMount && props.editMode) {
      focus();
      props.setPluginsState?.(localPlugins);
    }
  }, []);

  const handleKeyCommand = (
    command: string,
    editorState: EditorState
  ): DraftHandleValue => {
    // Handle key commands like Cmd+B (or Ctrl+B) and Cmd+U (or Ctrl+U)
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      props.setTextContent(newState);
      return "handled";
    }

    return "not-handled";
  };

  const currentFontSize = React.useMemo(() => {
    const DEFAULT_FONT_SIZE = 14;
    const HEADER_ONE_SIZE = 24;
    const HEADER_TWO_SIZE = 21;
    const TITLE_FONT_SIZE = 28; // Assuming a title font size for consistency
    const editorState = props.textContent;
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

  return (
    <div
      className={editorStyles.editor}
      onClick={focus}
      css={`
        ${!props.fullWidth && "max-width: 800px !important;"}

        font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
        line-height: normal;
        blockquote {
          padding-left: 11px;
          margin-inline-start: 0px;
          border-left: 4px solid #262c34;
        }

        .public-DraftEditorPlaceholder-hasFocus {
          .public-DraftEditorPlaceholder-inner {
            opacity: 0.5;
          }
        }

        .public-DraftEditorPlaceholder-inner {
          position: absolute;
          color: #adb5bd;
          font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
          font-size: ${currentFontSize ?? 14}px;
        }
      `}
      data-cy={`${props.testId}-container`}
      data-testid={`${props.testId}-container`}
    >
      <Editor
        plugins={localPlugins}
        customStyleFn={(style) => {
          return {
            ...colorStyleFn(style),
            ...bgColorStyleFn(style),
            ...gothamBoldFn(style),
          };
        }}
        blockStyleFn={blockStyleFn}
        customStyleMap={{
          ...fontSizeStyleMap,
          ...fontFamilyStyleMap,
          BOLD: {
            fontWeight: "bold",
            lineHeight: "normal",
          },
        }}
        editorKey="RichEditor"
        readOnly={!props.editMode}
        editorState={props.textContent}
        onChange={props.setTextContent}
        handlePastedText={props.handlePastedText}
        handleBeforeInput={props.handleBeforeInput}
        handleKeyCommand={handleKeyCommand}
        onBlur={() => {
          props.onBlur?.();
          setElementId(null);
          if (props.textContent.getCurrentContent().getPlainText().length === 0)
            props.setPlaceholderState(props.placeholder);
        }}
        onFocus={() => {
          props.onFocus?.();
          props.setPluginsState(localPlugins);
        }}
        placeholder={props.placeholderState}
        ref={(element) => {
          editor.current = element;
        }}
        webDriverTestID={props.testId}
      />
    </div>
  );
};
