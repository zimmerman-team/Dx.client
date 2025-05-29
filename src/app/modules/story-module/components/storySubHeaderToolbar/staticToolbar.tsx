import { AnchorPlugin } from "@draft-js-plugins/anchor";
import { EditorPlugin } from "@draft-js-plugins/editor";
import { EmojiPlugin } from "@draft-js-plugins/emoji";
import { StaticToolBarPlugin } from "@draft-js-plugins/static-toolbar";
import { TextAlignmentPlugin } from "@draft-js-plugins/text-alignment";
import { UndoRedoButtonProps } from "@draft-js-plugins/undo";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import BgColorModal from "app/modules/common/RichEditor/BGColorModal";
import ColorModal from "app/modules/common/RichEditor/ColorModal";
import FontSizeController from "app/modules/common/RichEditor/fontSizeHandler";
import {
  HiglightPicker,
  BGHiglightPicker,
  CenterAlignment,
  RightAlignment,
  LeftAlignment,
  BoldButton,
  ItalicButton,
  UnderlineButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
} from "app/modules/common/RichEditor/button/basicButtons";
import { styles as commonstyles } from "app/modules/story-module/components/storySubHeaderToolbar/styles";
import { ReactComponent as MoreIcon } from "app/modules/story-module/asset/more-icon.svg";
import React from "react";
import { FontStyleHandler } from "app/modules/common/RichEditor/fontStyleHandler/fontStyleHandler";
import { FontFamilyHandler } from "app/modules/common/RichEditor/fontStyleHandler/fontFamilyHandler";
import {
  DecreaseIndentButton,
  IncreaseIndentButton,
} from "app/modules/common/RichEditor/button/indentButtons";

type UndoRedoType = {
  UndoButton: React.ComponentType<UndoRedoButtonProps>;
  RedoButton: React.ComponentType<UndoRedoButtonProps>;
};
export type ToolbarPluginsType = (
  | StaticToolBarPlugin
  | AnchorPlugin
  | (EditorPlugin & UndoRedoType)
  | TextAlignmentPlugin
  | EmojiPlugin
  | EditorPlugin
)[];

export default function StaticToolbar(props: { plugins: ToolbarPluginsType }) {
  const isDesktop = useMediaQuery("(min-width: 1118px)");
  //control modals for color and background color pickers
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [activeColorModal, setActiveColorModal] = React.useState<
    "bg" | "color" | null
  >(null);
  const [displayRestIcons, setDisplayRestIcons] = React.useState(false);
  const handleClick = (
    event: React.MouseEvent<HTMLDivElement>,
    modalType: "bg" | "color"
  ) => {
    setActiveColorModal(modalType);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const bgOpen = activeColorModal === "bg" && Boolean(anchorEl);
  const colorOpen = activeColorModal === "color" && Boolean(anchorEl);

  const bgId = bgOpen ? "bg-popover" : undefined;
  const colorId = colorOpen ? "color-popover" : undefined;
  //end of control modals for color and background color pickers

  const Toolbar = (props.plugins[0] as StaticToolBarPlugin)?.Toolbar;
  const LinkButton = (props.plugins[1] as AnchorPlugin)?.LinkButton;
  const UndoButton = (props.plugins[2] as EditorPlugin & UndoRedoType)
    ?.UndoButton;
  const RedoButton = (props.plugins[2] as EditorPlugin & UndoRedoType)
    ?.RedoButton;

  const linkInputComponent = document.querySelector(
    "input[placeholder='Enter a URL and press enter']"
  );

  const divider = (
    <div
      css={`
        width: 1px;
        height: 28px;
        border: 1px solid #b4b4b4;
      `}
    />
  );

  return (
    <div>
      {props.plugins.length > 0 && (
        <Toolbar>
          {
            // may be use React.Fragment instead of div to improve perfomance after React 16
            (externalProps) => {
              const currentStyle = externalProps
                .getEditorState()
                .getCurrentInlineStyle();
              const textColour = currentStyle.findLast((style: any) =>
                style.includes("color-")
              );
              const textBgColour = currentStyle.findLast((style: any) =>
                style.includes("bg-")
              );
              const restIcons = (
                <>
                  <div onMouseDown={(e) => e.preventDefault()}>
                    <UndoButton {...externalProps} />
                  </div>
                  <div onMouseDown={(e) => e.preventDefault()}>
                    <RedoButton {...externalProps} />
                  </div>
                  {divider}
                  <FontStyleHandler {...externalProps} />

                  {divider}
                  <FontFamilyHandler {...externalProps} />
                  {divider}
                  <div>
                    <FontSizeController {...externalProps} />
                  </div>
                  {divider}
                </>
              );
              return (
                <React.Fragment>
                  {isDesktop && restIcons}

                  <BoldButton {...externalProps} />
                  <ItalicButton {...externalProps} />
                  <UnderlineButton {...externalProps} />
                  <div
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => handleClick(e, "color")}
                    id={colorId}
                    tabIndex={0} // Add tabIndex attribute to make the div focusable
                    css={commonstyles.highlightPicker(!!textColour)}
                  >
                    {HiglightPicker}
                  </div>

                  <div
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => handleClick(e, "bg")}
                    id={bgId}
                    tabIndex={0} // Add tabIndex attribute to make the div focusable
                    css={commonstyles.highlightPicker(!!textBgColour)}
                  >
                    {BGHiglightPicker}
                  </div>

                  <div onMouseDown={(e) => e.preventDefault()}>
                    <ColorModal
                      {...externalProps}
                      anchorEl={anchorEl}
                      handleClose={handleClose}
                      id={colorId}
                      open={colorOpen}
                    />
                  </div>

                  <div onMouseDown={(e) => e.preventDefault()}>
                    <BgColorModal
                      {...externalProps}
                      anchorEl={anchorEl}
                      handleClose={handleClose}
                      id={bgId}
                      open={bgOpen}
                    />
                  </div>

                  {divider}

                  {/* <HeaderOneButton {...externalProps} />
                  <HeaderTwoButton {...externalProps} /> */}
                  <LeftAlignment {...externalProps} />
                  <CenterAlignment {...externalProps} />
                  <RightAlignment {...externalProps} />
                  <UnorderedListButton {...externalProps} />
                  <OrderedListButton {...externalProps} />
                  <DecreaseIndentButton {...externalProps} />
                  <IncreaseIndentButton {...externalProps} />
                  <BlockquoteButton {...externalProps} />
                  {divider}
                  <div
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    css={`
                      margin-bottom: -4px;
                    `}
                  >
                    <LinkButton {...externalProps} />
                  </div>
                  <div
                    css={`
                      position: relative;
                      display: none;
                      @media (max-width: 1117px) {
                        display: block;
                      }
                    `}
                  >
                    <button
                      onClick={() => setDisplayRestIcons(!displayRestIcons)}
                      css={`
                        width: 40px;
                        height: 35px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border: none;
                        outline: none;
                        background: none;
                        cursor: pointer;
                        ${displayRestIcons &&
                        "background:#F2F2F2; border-radius: 8px;"}
                        :hover {
                          background: #f2f2f2;
                          border-radius: 8px;
                        }
                      `}
                    >
                      <MoreIcon />
                    </button>
                    <div
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      css={`
                        margin-bottom: -4px;
                      `}
                    >
                      <LinkButton {...externalProps} />
                    </div>
                    <div
                      css={`
                        width: max-content;
                        height: 44px;
                        display: ${displayRestIcons ? "flex" : "none"};
                        align-items: center;
                        justify-content: space-around;
                        border-radius: 8px;
                        background: #fff;
                        position: absolute;
                        bottom: -48px;
                        right: 0;
                        padding: 10px 10px;

                        box-shadow: 0px 9px 27px 0px rgba(0, 0, 0, 0.07),
                          0px 3.76px 11.28px 0px rgba(0, 0, 0, 0.05),
                          0px 2.01px 6.031px 0px rgba(0, 0, 0, 0.04),
                          0px 1.127px 3.381px 0px rgba(0, 0, 0, 0.04),
                          0px 0.599px 1.796px 0px rgba(0, 0, 0, 0.03),
                          0px 0.249px 0.747px 0px rgba(0, 0, 0, 0.02);
                      `}
                    >
                      {displayRestIcons && restIcons}
                    </div>
                  </div>
                </React.Fragment>
              );
            }
          }
        </Toolbar>
      )}
    </div>
  );
}
