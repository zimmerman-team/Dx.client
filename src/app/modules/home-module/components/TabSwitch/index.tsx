import React from "react";
import { HeadlessSwitch, Tab } from "app/components/Switch/headless";

interface StyledSwitchProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  style: {
    paddingX: number;
    radius: number;
    backgroundActive: string;
    background?: string;
    overrideStyles?: string;
  };
}

export function MultiSwitch({
  tabs,
  activeTab,
  onTabChange,
  style,
}: StyledSwitchProps) {
  return (
    <HeadlessSwitch tabs={tabs} activeTab={activeTab} onTabChange={onTabChange}>
      {({ tabs, activeTab, activeIndex, onTabClick }) => (
        <div
          css={`
            display: flex;
            background: ${style.background ? style.background : "#F1F3F5"};
            border-radius: ${style?.radius}px;
            display: flex;
            align-items: center;
            justify-content: center;

            position: relative;
            width: 100%;
            height: 100%;
            ${style.overrideStyles ? style.overrideStyles : ""}
            button {
              display: flex;
              flex: 1;
              min-width: 0;
              align-items: center;
              gap: 10px;

              font-size: 14px;
              justify-content: center;
              z-index: 1;
              cursor: pointer;
              background: transparent;
              box-sizing: border-box;

              height: 100%;
            }
          `}
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.value}
              onClick={() => onTabClick(tab.value, index)}
              data-cy={tab.testId}
              css={`
                font-family: ${activeTab === tab.value
                    ? "GothamNarrow-Bold"
                    : "GothamNarrow-Book"},
                  "Helvetica Neue", sans-serif;

                color: ${activeTab === tab.value ? "white" : "#231D2C"};
                border: none;
                border-right: ${index !== tabs.length - 1 &&
                activeTab !== tab.value &&
                activeTab !== tabs[index + 1]?.value
                  ? "1px solid #ADB5BD"
                  : "none"};
              `}
            >
              {tab.icon ? tab.icon : null} {tab.label}
            </button>
          ))}

          <div
            css={`
              position: absolute;
              background: ${style.backgroundActive};
              height: 100%;
              transform-box: fill-box;
              width: calc(100% / ${tabs.length});
              left: ${style.paddingX / 2}px;
              top: 0px;
              transform: translateX(${activeIndex * 100}%);

              transition: transform 0.3s, width 0.3s;
              border-radius: ${activeIndex === 0
                ? "10px 0 0 10px"
                : activeIndex === tabs.length - 1
                ? "0 10px 10px 0"
                : "0"};
            `}
          />
        </div>
      )}
    </HeadlessSwitch>
  );
}
