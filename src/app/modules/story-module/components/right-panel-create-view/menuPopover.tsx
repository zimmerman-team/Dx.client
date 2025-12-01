import React from "react";
import { Button, StyledMenu, StyledMenuItem } from "./elementItem";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { FOCUS_VISIBLE_STYLE_DARK, TABLET_STARTPOINT } from "@app/theme";
import { useMenuNavigation } from "@app/hooks/useMenuNavigation";

export default function MenuPopover(props: {
  menuItem: { value: string; label: string };
  setMenuItem: (option: { value: string; label: string }) => void;
  label: string;
  menuId: string;
  options: {
    value: string;
    label: string;
  }[];
}) {
  const {
    openState,
    setOpenState,
    triggerRef,
    itemRefs,
    handleTriggerKeyDown,
    activeIndex,
    closeMenu,
  } = useMenuNavigation({
    items: props.options,
  });

  const togglePopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenState(openState ? null : event.currentTarget);
  };
  return (
    <>
      <Button
        disableTouchRipple
        onClick={togglePopover}
        ref={triggerRef}
        onKeyDown={(e) => handleTriggerKeyDown(e, e.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={!!openState}
        aria-label="sort-button"
        css={`
          width: 159px;
          height: 35px;
          border-radius: 24px;
          background: #231d2c;
          text-transform: capitalize;
          padding-left: 16px;
          display: flex;
          svg {
            margin-left: 10px;
            transition: all 0.2s ease-in-out;
            transform: rotate(${openState ? "180" : "0"}deg);
            > path {
              fill: #fff;
            }
          }
          :focus-visible {
            ${FOCUS_VISIBLE_STYLE_DARK}
          }
          @media (max-width: ${TABLET_STARTPOINT}) {
            justify-self: flex-end;
          }
        `}
      >
        <span
          css={`
            color: #fff;
            font-size: 14px;
            overflow: hidden;
            font-weight: 325;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
          `}
        >
          {props.label}
        </span>
        <KeyboardArrowDownIcon />
      </Button>
      <StyledMenu
        keepMounted
        anchorEl={openState}
        id={props.menuId}
        onClose={togglePopover}
        open={!!openState}
      >
        {props.options.map((option, i) => (
          <StyledMenuItem
            ref={(el) => (itemRefs.current[i] = el)}
            tabIndex={activeIndex === i ? 0 : -1}
            key={option.value}
            onClick={() => {
              props.setMenuItem(option);
              closeMenu();
            }}
          >
            {option.label}
          </StyledMenuItem>
        ))}
      </StyledMenu>
    </>
  );
}
