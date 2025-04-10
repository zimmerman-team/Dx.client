import React from "react";
import Slide from "@material-ui/core/Slide";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { TriangleXSIcon } from "app/assets/icons/TriangleXS";
import { styles } from "app/modules/story-module/components/right-panel/styles";
import { StoryRightPanelProps } from "app/modules/story-module/components/right-panel/data";
import { StoryRightPanelCreateView } from "app/modules/story-module/components/right-panel-create-view";
import useTogglePanelWithKey from "app/hooks/useTogglePanelWithKey";
import { MOBILE_BREAKPOINT } from "app/theme";

export function StoryRightPanel(props: StoryRightPanelProps) {
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT})`);
  useTogglePanelWithKey({
    openToolbox: props.open,
    setToolboxOpen: props.setOpen,
  });
  return (
    <Slide direction="left" in={props.open} style={{ visibility: "visible" }}>
      <div css={styles.container}>
        {!isMobile && (
          <div
            role="button"
            tabIndex={-1}
            css={`
              top: calc((100% - 98px) / 2);

              left: -16px;
              color: #fff;
              width: 16px;
              height: 133px;
              display: flex;
              cursor: pointer;
              position: absolute;
              background: #231d2c;
              align-items: center;
              flex-direction: column;
              justify-content: center;
              border-radius: 10px 0px 0px 10px;
              transition: background 0.2s ease-in-out;

              &:hover {
                background: #13183f;
              }

              > svg {
                transform: rotate(${!props.open ? "-" : ""}90deg);
                > path {
                  fill: #fff;
                }
              }
            `}
            onClick={() => {
              props.setOpen(!props.open);
            }}
          >
            <TriangleXSIcon />
          </div>
        )}
        {props.currentView === "initial" && (
          <section css={styles.initial}>
            No options available in this step yet. Options will automatically
            appear, don’t worry.
          </section>
        )}
        {(props.currentView === "create" || props.currentView === "edit") && (
          <StoryRightPanelCreateView
            showHeaderItem={props.showHeaderItem}
            headerDetails={props.headerDetails}
            setHeaderDetails={props.setHeaderDetails}
            framesArray={props.framesArray}
            storyName={props.storyName}
            onSave={props.onSave}
          />
        )}
      </div>
    </Slide>
  );
}
