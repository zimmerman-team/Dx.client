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

export function BasicSwitch({
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
            background: ${style.background ? style.background : "#dadaf8"};
            border-radius: ${style?.radius}px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 ${style?.paddingX}px;
            gap: 8px;
            position: relative;
            width: 100%;
            height: 100%;
            ${style.overrideStyles ? style.overrideStyles : ""}
            button {
              width: 100%;
              display: flex;
              align-items: center;
              gap: 10px;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              font-size: 14px;
              border: none;
              justify-content: center;
              z-index: 1;
              cursor: pointer;
              :hover {
                opacity: 0.8;
              }
            }
          `}
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.value}
              onClick={() => onTabClick(tab.value, index)}
              data-cy={tab.testId}
              css={`
                background: transparent;
                font-weight: ${activeTab === tab.value ? "bold" : "medium"};
                color: ${activeTab === tab.value ? "white" : "#231D2C"};
              `}
            >
              {tab.icon ? tab.icon : null} {tab.label}
            </button>
          ))}

          <div
            css={`
              position: absolute;
              background: ${style.backgroundActive};
              border-radius: ${style.radius}px;
              height: calc(100% - ${style.paddingX}px);
              transform-box: fill-box;
              width: calc(100% / 2 - ${style.paddingX / 2}px);
              left: ${style.paddingX / 2}px;
              top: ${style.paddingX / 2}px;
              transform: ${activeIndex === 0
                ? "translateX(0%)"
                : "translateX(100%)"};
              transition: transform 0.3s, width 0.3s;
            `}
          />
        </div>
      )}
    </HeadlessSwitch>
  );
}
