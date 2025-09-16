import React from "react";
import { IconButton, Popover, Tooltip } from "@material-ui/core";
import { ReactComponent as FilterIcon } from "app/modules/home-module/assets/filter-fill.svg";

import { iconButtonCss, sortByItemCss } from "app/modules/home-module/style";
import { useMenuNavigation } from "app/hooks/useMenuNavigation";
import { FOCUS_VISIBLE_STYLE_DARK } from "app/theme";

export default function FilterPopover(
  props: Readonly<{
    setFilterValue: (
      value: "allAssets" | "myAssets" | "dataxplorerAssets"
    ) => void;
    filterValue: string;
    terminateSearch: () => void;
  }>
) {
  const filterOptions = [
    { label: "All Assets", value: "allAssets" },
    { label: "My Assets", value: "myAssets" },
    { label: "Dataxplorer Assets", value: "dataxplorerAssets" },
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
    items: filterOptions,
  });

  const handleClosePopover = () => {
    setOpenState(null);
  };
  const togglePopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenState(openState ? null : event.currentTarget);
  };
  return (
    <>
      {" "}
      <Tooltip title="Filter" placement="bottom">
        <IconButton
          ref={triggerRef}
          onClick={togglePopover}
          onKeyDown={(e) => handleTriggerKeyDown(e, e.currentTarget)}
          aria-haspopup="menu"
          aria-expanded={!!openState}
          css={iconButtonCss(!!openState)}
          aria-label="filter-button"
        >
          <FilterIcon />
        </IconButton>
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
            height: auto;
            width: 145px;
            /* max-height: 160px; */
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
            Filter
          </div>
          {filterOptions.map((option, i) => (
            <button
              ref={(el) => (itemRefs.current[i] = el)}
              role="menuitem"
              key={option.label}
              tabIndex={activeIndex === i ? 0 : -1}
              css={sortByItemCss(props.filterValue === option.value)}
              onClick={() => {
                props.terminateSearch && props.terminateSearch();
                props.setFilterValue?.(
                  option.value as "allAssets" | "myAssets" | "dataxplorerAssets"
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
