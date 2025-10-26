import React from "react";

export interface Tab {
  id?: string;
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
    focusIndex: number;
    onTabClick: (value: string, index: number) => void;
    getTabProps: (
      tab: Tab,
      index: number
    ) => {
      role: "tab";
      id: string;
      "aria-selected": boolean;
      tabIndex: number;
      onClick: () => void;
      onKeyDown: (e: React.KeyboardEvent) => void;
      ref: React.RefObject<HTMLButtonElement>;
    };
  }) => React.ReactNode;
}

export function HeadlessSwitch({
  tabs,
  activeTab,
  onTabChange,
  children,
}: HeadlessSwitchProps) {
  const currentIndex = tabs.findIndex((tab) => tab.value === activeTab);
  const [focusIndex, setFocusIndex] = React.useState(currentIndex);
  const [activeIndex, setActiveIndex] = React.useState(
    currentIndex >= 0 ? currentIndex : 0
  );

  const tabRefs = React.useRef<React.RefObject<HTMLButtonElement>[]>([]);
  if (tabRefs.current.length !== tabs.length) {
    tabRefs.current = tabs.map(() => React.createRef<HTMLButtonElement>());
  }

  React.useEffect(() => {
    const idx = tabs.findIndex((t) => t.value === activeTab);
    if (idx !== -1 && idx !== activeIndex) {
      setActiveIndex(idx);
    }
  }, [activeTab, tabs, activeIndex]);

  React.useEffect(() => {
    setFocusIndex(activeIndex);
  }, [activeIndex]);

  const handleTabClick = (value: string, index: number) => {
    setActiveIndex(index);
    onTabChange(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let newIndex = focusIndex;

    if (e.key === "ArrowRight") {
      newIndex = (focusIndex + 1) % tabs.length;
      const ref = tabRefs.current[newIndex];
      if (ref?.current) {
        ref.current.focus();
      }
      setFocusIndex(newIndex);
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      newIndex = (focusIndex - 1 + tabs.length) % tabs.length;
      const ref = tabRefs.current[newIndex];
      if (ref?.current) {
        ref.current.focus();
      }
      setFocusIndex(newIndex);

      e.preventDefault();
    } else if (e.key === " " || e.key === "Enter") {
      // Activate currently focused tab
      const tab = tabs[focusIndex];
      if (tab) {
        setActiveIndex(focusIndex);
        onTabChange(tab.value);
      }
      e.preventDefault();
    }
  };

  const getTabProps = (tab: Tab, index: number) => ({
    role: "tab" as const,
    id: tab.id || `tab-${index}`,
    "aria-selected": activeIndex === index,
    tabIndex: activeIndex === index ? 0 : -1,
    onClick: () => handleTabClick(tab.value, index),
    onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e),
    ref: tabRefs.current[index],
  });

  return (
    <>
      {children({
        tabs,
        activeTab,
        activeIndex,
        focusIndex,
        onTabClick: handleTabClick,
        getTabProps,
      })}
    </>
  );
}
