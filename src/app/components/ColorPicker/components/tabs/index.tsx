import React from "react";

interface Props {
  tabs: {
    value: string;
    label: string;
    icon?: React.ReactNode;
    testId?: string;
  }[];
  handleSwitch: (key: any) => void;
  activeTab: string;
}
export default function Tabs(props: Props) {
  const currentIndex = props.tabs.findIndex(
    (tab) => tab.value === props.activeTab
  );
  const [activeIndex, setActiveIndex] = React.useState(currentIndex);
  const handleTabSwitch = (key: string, index: number) => {
    setActiveIndex(index);
    props.handleSwitch(key);
  };

  return (
    <div
      css={`
        display: flex;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 2px;
        gap: 8px;
        position: relative;
        width: 100%;
        height: 24px;
        border-radius: 10px;
        background: #f1f3f5;
        box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.25) inset;
        button {
          width: 100%;
          display: flex;
          align-items: center;
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          font-size: 12px;
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
      {props.tabs.map((tab, index) => (
        <button
          key={tab.value}
          onClick={() => handleTabSwitch(tab.value, index)}
          data-cy={tab.testId}
          css={`
            background: transparent;
            font-weight: ${props.activeTab === tab.value ? "bold" : "medium"};
            color: ${props.activeTab === tab.value ? "white" : "#231D2C"};
          `}
        >
          {tab.icon ? tab.icon : null} {tab.label}
        </button>
      ))}

      <div
        css={`
          position: absolute;
          background: #231d2c;
          border-radius: 10px;
          height: calc(100% - 4px);
          transform-box: fill-box;
          width: calc(100% / 2 - 2px);
          left: 2px;
          top: 2px;
          transform: ${activeIndex === 0
            ? "translateX(0%)"
            : "translateX(100%)"};
          transition: transform 0.3s, width 0.3s;
        `}
      ></div>
    </div>
  );
}
