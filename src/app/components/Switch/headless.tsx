import React from "react";
export interface Tab {
  value: string;
  label: string | React.ReactNode;
  icon?: React.ReactNode;
  testId?: string;
}

interface HeadlessSwitchProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  children: (props: {
    tabs: Tab[];
    activeTab: string;
    activeIndex: number;
    onTabClick: (value: string, index: number) => void;
  }) => React.ReactNode;
}

export function HeadlessSwitch({
  tabs,
  activeTab,
  onTabChange,
  children,
}: HeadlessSwitchProps) {
  const currentIndex = tabs.findIndex((tab) => tab.value === activeTab);
  const [activeIndex, setActiveIndex] = React.useState(currentIndex);

  const handleTabClick = (value: string, index: number) => {
    setActiveIndex(index);
    onTabChange(value);
  };

  return (
    <>
      {children({
        tabs,
        activeTab,
        activeIndex,
        onTabClick: handleTabClick,
      })}
    </>
  );
}
