import React from "react";
import get from "lodash/get";
import { useDrop } from "react-dnd";
import { DraftHandleValue, EditorState, Modifier } from "draft-js";
import { useRecoilState } from "recoil";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import { useLocation, useParams } from "react-router-dom";
import { storyRightPanelViewAtom } from "app/state/recoil/atoms";
import { RichEditor } from "app/modules/common/RichEditor";
import { ReactComponent as EditIcon } from "app/modules/story-module/asset/editIcon.svg";
import { ReactComponent as DeleteIcon } from "app/modules/story-module/asset/deleteIcon.svg";
import { headerBlockcss } from "app/modules/story-module/components/headerBlock/style";
import { Tooltip } from "@material-ui/core";
import useDebounce from "react-use/lib/useDebounce";
import { ToolbarPluginsType } from "app/modules/story-module/components/storySubHeaderToolbar/staticToolbar";
import { IHeaderDetails } from "app/modules/story-module/components/right-panel/data";
import { getComplexSelectionLength } from "app/utils/draftjs/getComplexSelectionLength";

interface Props {
  isToolboxOpen: boolean;
  previewMode: boolean;
  hasStoryNameFocused?: boolean;
  isStoryHeadingModified?: boolean;
  sethasStoryNameFocused?: React.Dispatch<React.SetStateAction<boolean>>;
  setStoryName?: React.Dispatch<React.SetStateAction<string>>;
  storyName?: string;
  handleRightPanelOpen: () => void;
  setPlugins: React.Dispatch<React.SetStateAction<ToolbarPluginsType>>;
  headerDetails: IHeaderDetails;
  setHeaderDetails: React.Dispatch<React.SetStateAction<IHeaderDetails>>;
}

export default function HeaderBlock(props: Props) {
  const location = useLocation();
  const { page } = useParams<{ page: string }>();
  const [currentView, setCurrentView] = useRecoilState(storyRightPanelViewAtom);
  const [handleDisplay, setHandleDisplay] = React.useState(false);
  const descriptionPlaceholder = "Add a header description";
  const headingPlaceholder = "Add a header title";
  const [headingPlaceholderState, setHeadingPlaceholderState] =
    React.useState<string>(headingPlaceholder);
  const [charCount, setCharCount] = React.useState<null | number>(null);
  const [maxCharCount, setMaxCharCount] = React.useState(50);
  const [isHeadingFocused, setIsHeadingFocused] = React.useState(true);
  const [isDescriptionFocused, setIsDescriptionFocused] = React.useState(false);
  const [updateCharCount, setUpdateCharCount] = React.useState(false);
  const [descriptionPlaceholderState, setDescriptionPlaceholderState] =
    React.useState<string>(descriptionPlaceholder);

  const viewOnlyMode =
    page !== "new" && get(location.pathname.split("/"), "[3]", "") !== "edit";
  const handlers = viewOnlyMode
    ? {}
    : {
        onMouseEnter: () => setHandleDisplay(true),
        onMouseLeave: () => setHandleDisplay(false),
      };

  React.useEffect(() => {
    const plainText = getPlainTextFromEditorState(props.headerDetails.heading);
    if (charCount === null && props.headerDetails.isUpdated) {
      setCharCount(plainText.length);
      setUpdateCharCount(true);
      setMaxCharCount(50);
    }
  }, [props.headerDetails.isUpdated]);

  //handles story name state
  const [,] = useDebounce(
    () => {
      // checks when headerDetails.heading is empty and story heading has not been focused
      if (!props.hasStoryNameFocused && props.isStoryHeadingModified) {
        props.setStoryName?.(
          props.headerDetails.heading.getCurrentContent().getPlainText()
        );
      }
    },
    500,
    [props.headerDetails.heading]
  );

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "header",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      item: monitor.getItem(),
    }),
    drop: () => {
      props.setHeaderDetails({
        ...props.headerDetails,
        showHeader: true,
      });
    },
  }));
  const getPlainTextFromEditorState = (text: EditorState) => {
    return text.getCurrentContent().getPlainText();
  };

  const setTextContent = (
    newEditorState: EditorState,
    type: "heading" | "description"
  ) => {
    const max = type === "heading" ? 50 : 250;
    const plainText = getPlainTextFromEditorState(newEditorState);
    const currentLength = plainText.length;

    // Update character count regardless of whether we update the state
    setCharCount(Math.min(currentLength, max));

    // Only update header details if within character limit
    if (currentLength <= max) {
      if (type === "heading") {
        props.setHeaderDetails({
          ...props.headerDetails,
          heading: newEditorState,
        });
      } else {
        props.setHeaderDetails({
          ...props.headerDetails,
          description: newEditorState,
        });
      }
    } else {
      // If text exceeds limit, maintain the previous valid state
      // This prevents showing text that exceeds the limit temporarily
      // No need to update state here as we're keeping the previous valid state
    }
  };

  const handleBeforeInput = (
    chars: string,
    editorState: EditorState,
    type: "heading" | "description"
  ): DraftHandleValue => {
    const max = type === "heading" ? 50 : 250;
    const plainText = getPlainTextFromEditorState(editorState);
    const selection = editorState.getSelection();

    // If selection is not collapsed, those characters will be replaced
    if (!selection.isCollapsed()) {
      // Calculate net length after replacement
      const startKey = selection.getStartKey();
      const endKey = selection.getEndKey();
      const startOffset = selection.getStartOffset();
      const endOffset = selection.getEndOffset();
      const selectedTextLength =
        startKey === endKey
          ? endOffset - startOffset
          : getComplexSelectionLength(editorState);

      // Check if new length would be within limit
      if (plainText.length - selectedTextLength + chars.length <= max) {
        return "not-handled"; // Allow input
      } else {
        return "handled"; // Prevent input
      }
    }

    // Simple case - no selection, just check if adding chars would exceed limit
    if (plainText.length + chars.length > max) {
      return "handled"; // Prevent input
    }

    return "not-handled"; // Allow input
  };

  const getCurrentFontSizeFromEditorState = (editorState: EditorState) => {
    const DEFAULT_FONT_SIZE = 14;
    const HEADER_ONE_SIZE = 28;
    const HEADER_TWO_SIZE = 21;
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
  };

  const handlePastedText = (
    text: string,
    html: string | undefined,
    editorState: EditorState,
    type: "heading" | "description"
  ): DraftHandleValue => {
    const max = type === "heading" ? 50 : 250;
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const currentText = currentContent.getPlainText();

    const currentFontSize = getCurrentFontSizeFromEditorState(editorState);
    const fontSizeStyle = `font-size-${currentFontSize}`;

    // Calculate available space considering selection
    let availableSpace = max;

    if (selection.isCollapsed()) {
      // No text selected, just calculate remaining space
      availableSpace = max - currentText.length;
    } else {
      // Text is selected, it will be replaced by pasted text
      const selectedTextLength =
        selection.getStartKey() === selection.getEndKey()
          ? selection.getEndOffset() - selection.getStartOffset()
          : getComplexSelectionLength(editorState);

      availableSpace = max - (currentText.length - selectedTextLength);
    }

    // If no space available, don't paste anything
    if (availableSpace <= 0) {
      return "handled";
    }

    // Limit the pasted text to available space
    const limitedText = text.substring(0, availableSpace);

    // Create a new content state with the limited text
    let newContentState = Modifier.replaceText(
      currentContent,
      selection,
      limitedText
    );

    // Apply the current font size to the pasted text
    // We need to create a selection that spans just the newly pasted content
    const pasteStart = selection.getStartOffset();
    const pasteEnd = pasteStart + limitedText.length;
    const pasteSelection = selection.merge({
      anchorOffset: pasteStart,
      focusOffset: pasteEnd,
    });

    // Apply the font size style to the pasted text
    newContentState = Modifier.applyInlineStyle(
      newContentState,
      pasteSelection,
      fontSizeStyle
    );

    // Create a new editor state with the modified content
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "insert-characters"
    );

    // Update the state
    if (type === "heading") {
      props.setHeaderDetails({
        ...props.headerDetails,
        heading: newEditorState,
      });
    } else {
      props.setHeaderDetails({
        ...props.headerDetails,
        description: newEditorState,
      });
    }

    // Update char count directly
    setCharCount(getPlainTextFromEditorState(newEditorState).length);

    return "handled";
  };

  const onEdit = () => {
    setCurrentView("editHeader");
    props.handleRightPanelOpen();
  };

  const onRemove = () => {
    props.setHeaderDetails({
      ...props.headerDetails,
      showHeader: false,
    });
  };

  if (!props.headerDetails.showHeader) {
    return (
      <div
        ref={drop}
        data-testid="drop-area"
        data-cy="header-drop-area"
        css={`
          z-index: 1;
          width: 100%;
          height: 50px;
          position: absolute;
          background-color: ${isOver ? " #262C34;" : "transparent"};
        `}
      />
    );
  }

  return (
    <div
      css={headerBlockcss.container(
        props.headerDetails.backgroundColor,
        props.isToolboxOpen
      )}
      {...handlers}
      data-cy="story-header-block"
      data-testid="header-block"
    >
      <div
        css={`
          position: absolute;
          right: ${props.isToolboxOpen ? "404px" : "4px"};
          top: 4px;
          color: #ffffff;
          display: ${props.previewMode ||
          (!isDescriptionFocused && !isHeadingFocused)
            ? "none"
            : "block"};
        `}
      >
        {charCount} / {maxCharCount}
      </div>
      {(handleDisplay || currentView === "editHeader") && (
        <div
          css={`
            top: 0;
            left: 0;
            height: 100%;
            display: flex;
            gap: 4px;
            z-index: 99;
            position: absolute;
          `}
        >
          <div
            css={`
              background: #adb5bd;
              height: 100%;
              width: 23px;
              border-radius: 3.45px;
            `}
          />
          <div
            css={`
              width: 22px;
              height: 53px;
              margin: auto;
              display: ${currentView === "editHeader" ? "none" : "flex"};
              margin-left: 10px;
              align-items: center;
              background: #adb5bd;
              border-radius: 100px;
              flex-direction: column;
              justify-content: center;

              button {
                padding: 4px;
                :hover {
                  background: transparent;
                  svg {
                    path {
                      fill: #fff;
                    }
                    circle {
                      stroke: #fff;
                    }
                  }
                }
              }
            `}
          >
            <IconButton
              onClick={onEdit}
              id="edit-header-icon"
              data-testid="edit-header-button"
              data-cy="edit-header-button"
            >
              <Tooltip title="Edit" placement="right">
                <EditIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              onClick={onRemove}
              id="delete-header-icon"
              data-testid="delete-header-button"
              data-cy="delete-header-button"
            >
              <Tooltip title="Remove header" placement="right">
                <DeleteIcon />
              </Tooltip>
            </IconButton>
          </div>
        </div>
      )}
      <Container maxWidth="lg">
        <div css={headerBlockcss.innerContainer}>
          <div
            css={`
              width: 60%;
              color: ${props.headerDetails.titleColor} !important;
              /* font-size: 24px; */
              min-width: 600px;
              line-height: 16.8px;
              background: inherit;
              position: relative;
              letter-spacing: 0.692603px;
              ${props.previewMode && "pointer-events: none;"}

              ::placeholder {
                color: ${props.headerDetails.titleColor};
              }

              > div {
                padding: 0;
                .public-DraftEditorPlaceholder-inner {
                  position: absolute;
                  color: ${props.headerDetails.titleColor};
                  opacity: 0.5;
                  /* font-size: 14px; !important; */
                }

                > div {
                  > div {
                    > div {
                      min-height: 32px !important;
                    }
                  }
                }
              }
            `}
          >
            <RichEditor
              invertColors
              editMode={!props.previewMode}
              elementId="headerTitle"
              setTextContent={(text) => setTextContent(text, "heading")}
              handlePastedText={(text, html, editorState) =>
                handlePastedText(text, html, editorState, "heading")
              }
              handleBeforeInput={(chars, editorState) =>
                handleBeforeInput(chars, editorState, "heading")
              }
              placeholder={headingPlaceholder}
              placeholderState={headingPlaceholderState}
              setPlaceholderState={setHeadingPlaceholderState}
              textContent={props.headerDetails.heading}
              setPlugins={props.setPlugins}
              focusOnMount
              onBlur={() => {
                setIsHeadingFocused(false);
                if (!props.isStoryHeadingModified && props.storyName === "") {
                  props.setStoryName?.("Untitled Story");
                }
              }}
              onFocus={() => {
                setIsHeadingFocused(true);
                setMaxCharCount(50);
              }}
              testId="heading-rich-text-editor"
            />
          </div>

          <Box height={17} />
          <div
            css={`
              width: 60%;
              color: ${props.headerDetails.descriptionColor} !important;
              font-weight: 400;
              min-width: 600px;
              line-height: 16.8px;
              background: inherit;
              position: relative;
              letter-spacing: 0.692603px;
              ${props.previewMode && "pointer-events: none;"}

              ::placeholder {
                color: ${props.headerDetails.descriptionColor};
              }

              > div {
                padding: 0;
                .public-DraftEditorPlaceholder-inner {
                  position: absolute;
                  color: #ffffff;

                  font-weight: 325;
                }
                > div {
                  > div {
                    > div {
                      min-height: 90px !important;
                    }
                  }
                }
              }
              @media (max-width: 1024px) {
                width: 100%;
              }
              @media (max-width: 600px) {
                max-height: 100%;
                display: -webkit-box;
                width: 100%;
                min-width: unset;
                -webkit-line-clamp: 6;
                -webkit-box-orient: vertical;
              }
            `}
          >
            <RichEditor
              invertColors
              editMode={true}
              setTextContent={(text) => setTextContent(text, "description")}
              handlePastedText={(text, html, editorState) =>
                handlePastedText(text, html, editorState, "description")
              }
              handleBeforeInput={(chars, editorState) =>
                handleBeforeInput(chars, editorState, "description")
              }
              placeholder={descriptionPlaceholder}
              placeholderState={descriptionPlaceholderState}
              setPlaceholderState={setDescriptionPlaceholderState}
              textContent={props.headerDetails.description}
              setPlugins={props.setPlugins}
              onBlur={() => {
                setIsDescriptionFocused(false);
              }}
              onFocus={() => {
                setIsDescriptionFocused(true);
                setMaxCharCount(250);
              }}
              testId="description-rich-text-editor"
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
