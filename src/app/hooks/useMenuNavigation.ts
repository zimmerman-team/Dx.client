/** Hook for custom menu with accessibility support */

import * as React from "react";

type UseMenuNavigationOptions<T> = {
  items: T[];
  onSelect?: (item: T, index: number) => void;
};

export function useMenuNavigation<T>({
  items,
  onSelect,
}: UseMenuNavigationOptions<T>) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [openState, setOpenState] = React.useState<any>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const itemRefs = React.useRef<(HTMLElement | null)[]>([]);

  //when opening, default focus first item
  React.useEffect(() => {
    if (openState && items.length > 0) {
      setActiveIndex(0);
    } else {
      setActiveIndex(null);
    }
  }, [openState, items.length]);

  // move focus when activeIndex changes
  React.useEffect(() => {
    if (activeIndex !== null) {
      itemRefs.current[activeIndex]?.focus();
    }
  }, [activeIndex]);

  const openMenu = (openState: any) => setOpenState(openState);
  const closeMenu = (returnFocus = true) => {
    setOpenState(null);
    if (returnFocus) triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    openState: any
  ) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      openMenu(openState);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openMenu(openState);
      setActiveIndex(items.length - 1);
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) =>
          i === null || i === items.length - 1 ? 0 : i + 1
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) =>
          i === null || i === 0 ? items.length - 1 : (i as number) - 1
        );
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(items.length - 1);
        break;
      case "Enter":
      case " ":
        if (activeIndex !== null) {
          if (onSelect) {
            e.preventDefault();
            onSelect?.(items[activeIndex], activeIndex);
            closeMenu(false); // allow routing to handle focus
          } else {
            return;
          }
        }
        break;
      case "Escape":
        e.preventDefault();
        closeMenu(true);
        break;
      case "Tab":
        closeMenu(false);
        break;
    }
  };

  return {
    activeIndex,
    triggerRef,
    itemRefs,
    setOpenState,
    openState,
    closeMenu,
    setActiveIndex,
    handleTriggerKeyDown,
    handleMenuKeyDown,
  };
}
