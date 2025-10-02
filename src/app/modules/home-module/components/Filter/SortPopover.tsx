import { Popover, Tooltip } from "@material-ui/core";
import { ReactComponent as SortIcon } from "app/modules/home-module/assets/sort-fill.svg";

import { iconButtonCss, sortByItemCss } from "app/modules/home-module/style";
import { useMenuNavigation } from "app/hooks/useMenuNavigation";
import { FOCUS_VISIBLE_STYLE_DARK } from "app/theme";
import React from "react";

export default function SortPopover(
  props: Readonly<{
    setSortValue: (value: "updatedDate" | "createdDate" | "name") => void;
    sortValue: string;
    terminateSearch: () => void;
  }>
) {
  const sortOptions = [
    { label: "Last updated", value: "updatedDate" },
    { label: "Created date", value: "createdDate" },
    { label: "Name", value: "name" },
  ];
  const {
    openState,
    setOpenState,
    triggerRef,
    itemRefs,
    handleTriggerKeyDown,
    handleMenuKeyDown,
    activeIndex,
    closeMenu,
  } = useMenuNavigation({
    items: sortOptions,
  });
  const handleClosePopover = () => {
    setOpenState(null);
  };
  const togglePopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenState(openState ? null : event.currentTarget);
  };
  return (
    <>
      <Tooltip title="Sort By" placement="bottom">
        <button
          ref={triggerRef}
          onClick={togglePopover}
          onKeyDown={(e) => handleTriggerKeyDown(e, e.currentTarget)}
          aria-haspopup="menu"
          aria-expanded={!!openState}
          css={iconButtonCss(!!openState)}
          aria-label="sort-button"
        >
          <SortIcon role="presentation" />
        </button>
      </Tooltip>
      <Popover
        open={!!openState}
        anchorEl={openState}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        css={`
          .MuiPaper-root {
            border-radius: 16px;
            width: 145px;
          }
        `}
      >
        <div
          role="menu"
          onKeyDown={handleMenuKeyDown}
          css={`
            display: flex;
            flex-direction: column;

            button {
              border: none;
              outline: none;
              text-align: left;
              line-height: 20px;

              &:focus-visible {
                /* ${FOCUS_VISIBLE_STYLE_DARK} */
                border: 2px solid #00b5d8;
                :nth-of-type(3) {
                  border-bottom-left-radius: 16px;
                  border-bottom-right-radius: 16px;
                }
              }
            }
          `}
        >
          <div
            css={`
              color: #fff;
              font-size: 12px;
              padding: 8px 22px;
              background: #231d2c;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            `}
          >
            Sort by
          </div>
          {sortOptions.map((option, i) => (
            <button
              ref={(el) => (itemRefs.current[i] = el)}
              role="menuitem"
              tabIndex={activeIndex === i ? 0 : -1}
              key={option.label}
              css={sortByItemCss(props.sortValue === option.value)}
              onClick={() => {
                props.terminateSearch && props.terminateSearch();
                props.setSortValue(
                  option.value as "name" | "createdDate" | "updatedDate"
                );
                closeMenu();
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Popover>
    </>
  );
}
