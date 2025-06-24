import { useMemo } from "react";

import createLinkPlugin from "app/modules/common/RichEditor/anchor";
import createToolbarPlugin from "@draft-js-plugins/static-toolbar";
import createUndoPlugin from "@draft-js-plugins/undo";
import createTextAlignmentPlugin from "@draft-js-plugins/text-alignment";
import { LinkButton } from "app/modules/common/RichEditor/button/linkButton";
import { RedoIcon } from "app/assets/icons/Redo";
import { UndoIcon } from "app/assets/icons/Undo";
import Tooltip from "@material-ui/core/Tooltip";
import buttonStyles from "app/modules/common/RichEditor/style/buttonStyles.module.css";
import toolbarStyles from "app/modules/common/RichEditor/style/toolbarStyles.module.css";
import alignmentStyles from "app/modules/common/RichEditor/style/alignmentStyles.module.css";

export const useEditorPlugins = () => {
  const textAlignmentPlugin = useMemo(
    () =>
      createTextAlignmentPlugin({
        theme: {
          alignmentStyles: {
            ...alignmentStyles,
            draftCenter: alignmentStyles.draftCenter,
            draftLeft: alignmentStyles.draftLeft,
            draftRight: alignmentStyles.draftRight,
          },
        },
      }),
    [alignmentStyles]
  );

  const linkPlugin = useMemo(
    () =>
      createLinkPlugin({
        linkTarget: "_blank",
        placeholder: "Enter a URL and press enter",
        LinkButton,
      }),
    [buttonStyles, Tooltip]
  );

  const undoPlugin = useMemo(
    () =>
      createUndoPlugin({
        undoContent: <UndoIcon />,
        redoContent: <RedoIcon />,
        theme: {
          undo: buttonStyles.undoRedoButton,
          redo: buttonStyles.undoRedoButton,
        },
      }),
    [buttonStyles, UndoIcon, RedoIcon]
  );

  const plugins = useMemo(() => {
    const toolbarPlugin = createToolbarPlugin({
      theme: { buttonStyles, toolbarStyles },
    });

    return [toolbarPlugin, linkPlugin, undoPlugin, textAlignmentPlugin];
  }, [
    buttonStyles,
    toolbarStyles,
    linkPlugin,
    undoPlugin,
    textAlignmentPlugin,
  ]);

  return {
    plugins,
  };
};
