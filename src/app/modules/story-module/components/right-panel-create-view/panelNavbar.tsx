import IconButton from "@material-ui/core/IconButton";
import ActiveElementsIcon from "@app/modules/story-module/asset/active-elements-icon.svg?react";
import ActiveChartIcon from "@app/modules/story-module/asset/active-chart-icon.svg?react";
import ActiveMediaIcon from "@app/modules/story-module/asset/active-media-icon.svg?react";
import ChartIcon from "@app/modules/story-module/asset/chart-icon.svg?react";
import MediaIcon from "@app/modules/story-module/asset/media-icon.svg?react";
import ElementsIcon from "@app/modules/story-module/asset/elements-icon.svg?react";
import { HeadlessSwitch } from "@app/components/Switch/headless";

type ViewType = "elements" | "charts" | "media" | "editHeader";
interface PanelNavbarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}
export default function PanelNavbar(props: PanelNavbarProps) {
  const { currentView, setCurrentView } = props;
  const whiteBackgroundOnly = "background-color: #fff;";
  const whiteBackgroundRoundedBottomRight =
    whiteBackgroundOnly + " border-radius: 0px 0px 8px 0px;";
  const whiteBackgroundRoundedBottomLeft =
    whiteBackgroundOnly + " border-radius: 0px 0px 0px 8px;";
  const whiteBackgroundNotRounded =
    whiteBackgroundOnly + " border-radius: 0px 0px 0px 0px;";

  const elementsStyle = (currentView: ViewType) => {
    if (currentView === "elements") {
      return "background: transparent;";
    } else if (currentView === "charts") {
      return whiteBackgroundRoundedBottomRight;
    } else if (currentView === "media") {
      return whiteBackgroundNotRounded;
    } else {
      return "";
    }
  };

  const chartssStyle = (currentView: ViewType) => {
    if (currentView === "elements") {
      return whiteBackgroundRoundedBottomLeft;
    } else if (currentView === "charts") {
      return "background-color: transparent;";
    } else if (currentView === "media") {
      return whiteBackgroundRoundedBottomRight;
    } else {
      return "";
    }
  };

  const mediaStyle = (currentView: ViewType) => {
    if (currentView === "elements") {
      return whiteBackgroundNotRounded;
    } else if (currentView === "charts") {
      return whiteBackgroundRoundedBottomLeft;
    } else if (currentView === "media") {
      return "background: transparent;";
    } else {
      return "";
    }
  };

  const handleTabSwitch = (tab: ViewType) => {
    setCurrentView(tab);
  };

  const navTabs = [
    {
      label: "Elements",
      value: "elements",
      icon:
        currentView === "elements" ? (
          <ActiveElementsIcon role="presentation" />
        ) : (
          <ElementsIcon role="presentation" />
        ),
      ariaControls: "elements-panel",
      ariaSelected: currentView === "elements",
      ariaLabel: "Elements Tab",
      dataTestId: "elements-button",
      dataCy: "story-panel-elements-tab",
      onClick: () => setCurrentView("elements"),
      css: elementsStyle(currentView),
    },
    {
      label: "Charts",
      value: "charts",
      icon:
        currentView === "charts" ? (
          <ActiveChartIcon role="presentation" />
        ) : (
          <ChartIcon role="presentation" />
        ),
      ariaControls: "charts-panel",
      ariaSelected: currentView === "charts",
      ariaLabel: "Charts Tab",
      dataTestId: "charts-button",
      dataCy: "story-panel-chart-tab",
      onClick: () => setCurrentView("charts"),
      css: chartssStyle(currentView),
    },
    {
      label: "Media",
      value: "media",
      icon:
        currentView === "media" ? (
          <ActiveMediaIcon role="presentation" />
        ) : (
          <MediaIcon role="presentation" />
        ),
      ariaControls: "media-panel",
      ariaSelected: currentView === "media",
      ariaLabel: "Media Tab",
      dataTestId: "media-button",
      dataCy: "story-panel-media-tab",
      onClick: () => setCurrentView("media"),
      css: mediaStyle(currentView),
    },
  ];
  return (
    <HeadlessSwitch
      tabs={navTabs}
      activeTab={currentView}
      onTabChange={handleTabSwitch}
    >
      {({ focusIndex, getTabProps }) => {
        console.log(focusIndex, "focusIndex");
        return (
          <div
            role="tablist"
            aria-label="Story Panel Navigation"
            css={`
              width: 100%;
              display: ${currentView === "editHeader" ? "none" : "flex"};
              height: 67px;
              background: #f1f3f5;
              align-items: center;
              button {
                padding: 20px;
                height: 100%;
                border-radius: 0px;
                :hover {
                  background: transparent;
                  border-radius: none;
                }
              }
            `}
          >
            {navTabs.map((tab, index) => (
              <IconButton
                disableRipple
                data-testid={tab.dataTestId}
                data-cy={tab.dataCy}
                aria-controls={tab.ariaControls}
                {...getTabProps(tab, index)}
                aria-label={tab.ariaLabel}
                css={`
                  ${tab.css}
                  ${focusIndex === index &&
                  `
                  :focus-visible {
                     border: 2px solid #231D2C;
                  }
                  `}
                `}
              >
                {tab.icon}
              </IconButton>
            ))}

            <div
              css={`
                ${(() => {
                  if (currentView === "elements") {
                    return whiteBackgroundOnly;
                  } else if (currentView === "charts") {
                    return whiteBackgroundOnly;
                  } else if (currentView === "media") {
                    return whiteBackgroundRoundedBottomLeft;
                  } else {
                    return "";
                  }
                })()}
                width: 100%;
                height: 100%;
              `}
            ></div>
          </div>
        );
      }}
    </HeadlessSwitch>
  );
}
