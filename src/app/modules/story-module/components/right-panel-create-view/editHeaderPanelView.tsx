import React from "react";
import { useRecoilState } from "recoil";
import { StoryRightPanelCreateViewProps } from ".";
import { storyRightPanelViewAtom } from "@app/state/recoil/atoms";
import EditHeaderIcon from "@app/modules/story-module/asset/EditHeaderIcon";
import IconButton from "@material-ui/core/IconButton";
import { Close } from "@material-ui/icons";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ChartOptionColor from "@app/modules/chart-module/routes/customize/components/ChartOptionColor";
import { IColor } from "@app/components/ColorPicker/services/color";

export default function EditHeaderPanelView(
  props: StoryRightPanelCreateViewProps
) {
  const [_, setCurrentView] = useRecoilState(storyRightPanelViewAtom);
  const [displayColorsList, setDisplayColorsList] = React.useState(true);

  const titleDefaultColor = React.useMemo(() => {
    return props.headerDetails.titleColor || "#ffffff";
  }, []);
  const descriptionDefaultColor = React.useMemo(() => {
    return props.headerDetails.descriptionColor || "#ffffff";
  }, []);
  const backgroundDefaultColor = React.useMemo(() => {
    return props.headerDetails.backgroundColor || "#252c34";
  }, []);
  return (
    <div
      data-cy="edit-header-panel"
      css={`
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        background: #f1f3f5;
      `}
    >
      <div
        css={`
          width: 100%;
          height: 78px;
          padding: 0 25px;
        `}
      >
        <div
          css={`
            display: flex;

            align-items: center;
            justify-content: space-between;
            font-weight: bold;
            > svg {
              margin-right: 25px;
            }
            border-bottom: 1px solid #dfe3e5;
            width: 99%;
            height: 100%;
            margin: auto;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
              gap: 12px;
            `}
          >
            <EditHeaderIcon />
            Edit the story header
          </div>
          <span>
            <IconButton
              css={`
                color: #262c34;
              `}
              onClick={() => {
                setCurrentView("charts");
              }}
              data-cy="edit-header-panel-close"
            >
              <Close color="inherit" />
            </IconButton>
          </span>
        </div>
      </div>
      <div
        css={`
          padding: 0 25px;
          margin-top: 10px;
        `}
      >
        <div
          css={`
            padding: 16px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            svg {
              transform: rotate(${displayColorsList ? "180" : "0"}deg);
            }
          `}
        >
          Colors
          <IconButton
            css={`
              color: #262c34;
            `}
            onClick={() => {
              setDisplayColorsList(!displayColorsList);
            }}
          >
            <ArrowDropUpIcon color="inherit" />
          </IconButton>
        </div>
        {displayColorsList && (
          <div
            css={`
              > label {
                --bs-gutter-x: 0;
                padding: 12px 5px;
              }

              #inline-color-picker-popover {
                right: 0;
              }
            `}
          >
            <ChartOptionColor
              isEnabled
              value={props.headerDetails.backgroundColor}
              default={props.headerDetails.backgroundColor}
              defaultColor={backgroundDefaultColor}
              onChange={(value: IColor) => {
                props.setHeaderDetails({
                  ...props.headerDetails,
                  backgroundColor: value.hex,
                });
              }}
              label="Background color"
            />

            <ChartOptionColor
              isEnabled
              value={props.headerDetails.titleColor}
              default={props.headerDetails.titleColor}
              defaultColor={titleDefaultColor}
              onChange={(value: IColor) => {
                props.setHeaderDetails({
                  ...props.headerDetails,
                  titleColor: value.hex,
                });
              }}
              label="Title color"
            />

            <ChartOptionColor
              isEnabled
              value={props.headerDetails.descriptionColor}
              default={props.headerDetails.descriptionColor}
              defaultColor={descriptionDefaultColor}
              onChange={(value: IColor) => {
                props.setHeaderDetails({
                  ...props.headerDetails,
                  descriptionColor: value.hex,
                });
              }}
              label="Description color"
            />
          </div>
        )}
      </div>
    </div>
  );
}
