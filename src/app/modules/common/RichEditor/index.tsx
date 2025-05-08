import React, { ReactElement, useMemo, useRef } from "react";
import picker from "app/modules/common/RichEditor/ColorModal/Picker";
import bgPicker from "app/modules/common/RichEditor/BGColorModal/Picker";
import { ToolbarPluginsType } from "app/modules/story-module/components/storySubHeaderToolbar/staticToolbar";

/*plugins */
import {
  DraftHandleValue,
  EditorState,
  RichUtils,
  SelectionState,
} from "draft-js";
import Editor from "@draft-js-plugins/editor";
import createLinkPlugin from "@draft-js-plugins/anchor";
import createEmojiPlugin from "@draft-js-plugins/emoji";
import createToolbarPlugin from "@draft-js-plugins/static-toolbar";
import createUndoPlugin from "@draft-js-plugins/undo";
import createTextAlignmentPlugin from "@draft-js-plugins/text-alignment";
import { RedoIcon } from "app/assets/icons/Redo";
import { UndoIcon } from "app/assets/icons/Undo";
import { EmojiButton } from "app/modules/common/RichEditor/buttons";

/* stylesheets */
import "@draft-js-plugins/anchor/lib/plugin.css";
import editorStyles from "./editorStyles.module.css";
import buttonStyles from "./buttonStyles.module.css";
import toolbarStyles from "./toolbarStyles.module.css";
import alignmentStyles from "./alignmentStyles.module.css";
import "@draft-js-plugins/inline-toolbar/lib/plugin.css";
import "@draft-js-plugins/static-toolbar/lib/plugin.css";
import "@draft-js-plugins/emoji/lib/plugin.css";
import fontSizeStyleMap from "app/modules/common/RichEditor/FontSizeController/styleMap";
import { styles } from "app/modules/story-module/components/storySubHeaderToolbar/styles";

export const RichEditor = (props: {
  editMode: boolean;
  fullWidth?: boolean;
  placeholderState: string;
  invertColors?: boolean;
  textContent: EditorState;
  setTextContent: (value: EditorState) => void;
  setPlugins?: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
  focusOnMount?: boolean;
  setPlaceholderState: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  onBlur?: () => void;
  onFocus?: () => void;
  testId?: string;
}): ReactElement => {
  const editor = useRef<Editor | null>(null);

  const focus = (): void => {
    editor.current?.focus();
  };
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

  const emojiPlugin = createEmojiPlugin({
    selectButtonContent: (
      <div css={styles.highlightPicker(false)}>{EmojiButton}</div>
    ),
  });
  const textAlignmentPlugin = createTextAlignmentPlugin({
    theme: {
      alignmentStyles: {
        ...alignmentStyles,
        draftCenter: alignmentStyles.draftCenter,
        draftLeft: alignmentStyles.draftLeft,
        draftRight: alignmentStyles.draftRight,
      },
    },
  });
  const linkPlugin = createLinkPlugin({
    linkTarget: "_blank",
    placeholder: "Enter a URL and press enter",
  });

  const undoPlugin = createUndoPlugin({
    undoContent: <UndoIcon />,
    redoContent: <RedoIcon />,
    theme: {
      undo: buttonStyles.undoRedoButton,
      redo: buttonStyles.undoRedoButton,
    },
  });

  const plugins = useMemo(() => {
    const toolbarPlugin = createToolbarPlugin({
      theme: { buttonStyles, toolbarStyles },
    });

    return [
      toolbarPlugin,
      linkPlugin,
      undoPlugin,
      textAlignmentPlugin,
      emojiPlugin,
    ];
  }, []);

  React.useEffect(() => {
    if (props.focusOnMount && props.editMode) {
      focus();
      props.setPlugins?.(plugins);
    }
  }, []);

  return (
    <div
      className={editorStyles.editor}
      onClick={focus}
      css={`
        ${!props.fullWidth && "max-width: 800px !important;"}

        font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
        line-height: normal;
        font-weight: 12px;
        h1,
        h2 {
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          * {
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          }
        }

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
          font-size: 14px;
          font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
        }
      `}
      data-cy={`${props.testId}-container`}
      data-testid={`${props.testId}-container`}
    >
      <Editor
        plugins={plugins}
        customStyleMap={{
          ...bgPicker.bgColorStyleMap,
          ...picker.colorStyleMap,
          ...fontSizeStyleMap,
          BOLD: {
            fontFamily: "GothamNarrow-Bold",
            fontWeight: "bold",
            lineHeight: "normal",
          },
        }}
        editorKey="RichEditor"
        readOnly={!props.editMode}
        editorState={props.textContent}
        onChange={props.setTextContent}
        handleKeyCommand={handleKeyCommand}
        onBlur={() => {
          props.onBlur?.();
          if (props.textContent.getCurrentContent().getPlainText().length === 0)
            props.setPlaceholderState(props.placeholder);
        }}
        onFocus={() => {
          props.onFocus?.();
          props.setPlugins?.(plugins);
          props.setPlaceholderState("");
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
