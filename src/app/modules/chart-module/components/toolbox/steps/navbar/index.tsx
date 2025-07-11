import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { stepcss } from "app/modules/chart-module/components/toolbox/steps/navbar/style";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import {
  ToolboxNavType,
  toolboxNavContent,
} from "app/modules/chart-module/components/toolbox/data";

export default function ToolboxNav(
  props: Readonly<{
    stepPaths: { name: string; path: string }[];
    onNavBtnClick: (name: ToolboxNavType, path: string) => void;
    isClickable: boolean;
    setIsClickable: React.Dispatch<React.SetStateAction<boolean>>;
    onMouseOverNavBtn: (name: ToolboxNavType) => void;
  }>
) {
  const { page } = useParams<{ page: string }>();
  const location = useLocation();
  const activePanelStep = useStoreState(
    (state) => state.charts.activePanels.value
  );
  const resetActivePanels = useStoreActions(
    (actions) => actions.charts.activePanels.reset
  );

  const setActivePanelStep = useStoreActions(
    (state) => state.charts.activePanels.setValue
  );
  const whiteBackgroundOnly = "background-color: #fff;";
  const whiteBackgroundRoundedBottomRight =
    whiteBackgroundOnly + " border-radius: 0px 0px 8px 0px;";
  const whiteBackgroundRoundedBottomLeft =
    whiteBackgroundOnly + " border-radius: 0px 0px 0px 8px;";
  const whiteBackgroundNotRounded =
    whiteBackgroundOnly + " border-radius: 0px 0px 0px 0px";

  React.useEffect(() => {
    //on first render, set activestep based on url
    if (page !== "new" && location.pathname !== `/chart/${page}/preview`) {
      const step = props.stepPaths.find(
        (s) => s.path === location.pathname
      )?.name;
      setActivePanelStep(step as ToolboxNavType);
    }
    return () => {
      resetActivePanels();
    };
  }, []);

  const [navContentState, setNavContentState] = React.useState(
    toolboxNavContent(page)
  );
  const activePanelStepIndex =
    activePanelStep === "selectDataset"
      ? 0
      : navContentState.findIndex((nav) => nav.name === activePanelStep);

  return (
    <div
      css={`
        background: #f5f5f7;
        display: flex;
        height: 67px;
        @media (min-width: 768px) {
          @media (max-width: 881px) {
            height: 50px;
          }
        }
      `}
    >
      {navContentState.map((item, index) => (
        <button
          css={`
            ${stepcss(
              item.name === activePanelStep || index === activePanelStepIndex
            )}
            ${(() => {
              if (index === activePanelStepIndex - 1) {
                return whiteBackgroundRoundedBottomRight;
              } else if (index === activePanelStepIndex) {
                return "background: transparent;";
              } else if (index === activePanelStepIndex + 1) {
                return whiteBackgroundRoundedBottomLeft;
              } else {
                return whiteBackgroundNotRounded;
              }
            })()};
          `}
          aria-label={item.name}
          disabled={!props.isClickable}
          key={item.name}
          name={item.name}
          onClick={() => {
            props.onNavBtnClick(item.name, item.path);
          }}
          onMouseOver={() => {
            props.onMouseOverNavBtn(item.name);
            setNavContentState((prev) => {
              const tempPrev = [...prev];
              tempPrev[index].displayTooltip = true;
              return tempPrev;
            });
          }}
          onMouseOut={() => {
            props.setIsClickable(false);
            setNavContentState((prev) => {
              const tempPrev = [...prev];
              tempPrev[index].displayTooltip = false;
              return tempPrev;
            });
          }}
          data-cy={`chart-toolbox-${item.name}-tab`}
        >
          {item.icon}
          <span
            css={`
              position: absolute;
              top: 50px;
              right: ${index === 4 ? "0%" : index === 0 ? "-84px" : "-30%"};
              font-size: 12px;
              white-space: nowrap;
              background: #626262;
              padding: 4px 8px;
              color: #ffffff;
              border-radius: 4px;
              display: ${item.displayTooltip ? "block" : "none"};
              z-index: 1;
            `}
          >
            {item.tooltip}
          </span>
        </button>
      ))}
    </div>
  );
}
