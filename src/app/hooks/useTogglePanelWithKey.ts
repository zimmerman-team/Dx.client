import React from "react";

export default function useTogglePanelWithKey(props: {
  openToolbox: boolean;
  setToolboxOpen: (open: boolean) => void;
}) {
  const togglePanel = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable ||
      target.tagName === "SELECT"
    ) {
      return;
    }

    if (e.key === "p") {
      props.setToolboxOpen(!props.openToolbox);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", togglePanel);
    return () => {
      window.removeEventListener("keydown", togglePanel);
    };
  }, [props.openToolbox]);
}
