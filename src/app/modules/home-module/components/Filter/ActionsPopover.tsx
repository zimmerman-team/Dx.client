import Popover from "@material-ui/core/Popover";
import DeleteIcon from "@app/modules/home-module/assets/delete.svg?react";
import { useCheckUserPlan } from "@app/hooks/useCheckUserPlan";
import { useMenuNavigation } from "@app/hooks/useMenuNavigation";
import {
  FOCUS_VISIBLE_STYLE_DARK,
  FOCUS_VISIBLE_STYLE_LIGHT,
  MOBILE_BREAKPOINT,
} from "@app/theme";
import React from "react";
import { useHistory } from "react-router-dom";
import MenuIcon from "@app/modules/home-module/assets/menu.svg?react";

interface Props {
  deleteActive: boolean;
  deleteAction: () => void;
}

export default function ActionPopover(props: Props) {
  const history = useHistory();

  const items = [
    {
      label: "Delete asset(s)",
      action: () => {},
    },
  ];
  const {
    openState,
    setOpenState,
    triggerRef,
    itemRefs,
    handleTriggerKeyDown,
    handleMenuKeyDown,
    activeIndex,
  } = useMenuNavigation({
    items,
    onSelect: (item) => item.action(),
  });

  const handleClosePopover = () => {
    setOpenState(null);
  };
  const togglePopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenState(openState ? null : event.currentTarget);
  };

  return (
    <>
      <button
        ref={triggerRef}
        data-cy="home-actions-button"
        onClick={togglePopover}
        onKeyDown={(e) => handleTriggerKeyDown(e, e.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={!!openState}
        css={`
          display: flex;
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: 10px;
          background: ${props.deleteActive ? "#002D9C" : "#F2F7FD"};
          border: ${props.deleteActive
            ? "0.5px solid #002D9C"
            : "0.5px solid #6061E5"};
          cursor: pointer;
          svg {
            path {
              fill: ${props.deleteActive ? "#FFFFFF" : "#231D2C"};
            }
          }
          :focus-visible {
            ${FOCUS_VISIBLE_STYLE_DARK}
          }
        `}
        aria-label="Add new asset"
      >
        <MenuIcon role="presentation" />
      </button>

      <Popover
        open={!!openState}
        anchorEl={openState}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        anchorPosition={{
          top: 50,
          left: 0,
        }}
        css={`
          .MuiPaper-root {
            border-radius: 12px;
          }
        `}
      >
        <div
          role="menu"
          onKeyDown={handleMenuKeyDown}
          css={`
            display: flex;
            width: 164px;
            flex-direction: column;
            align-items: center;
            border-radius: 10px;
            background: #f1f3f5;
            box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.6);

            button {
              outline: none;
              width: 90%;
              height: 40px;
              display: flex;
              align-items: center;
              gap: 8px;
              font-family: "GothamNarrow-Book", sans-serif;
              font-size: 14px;
              color: #231d2c;
              background: transparent;
              cursor: pointer;
              &:focus-visible {
                ${FOCUS_VISIBLE_STYLE_LIGHT}
                margin: 4px 3px;
                width: calc(100% - 6px);
              }
            }
          `}
        >
          <button
            type="button"
            data-cy={"delete-assets-button"}
            onClick={() => {
              handleClosePopover();
              props.deleteAction();
            }}
            css={`
              border-radius: 10px;
              border: none;

              &:hover {
                background: #dfe3e5;
                width: 100%;
                padding: 0 14px;
              }
            `}
            ref={(el) => (itemRefs.current[0] = el)}
            role="menuitem"
            tabIndex={0}
          >
            <DeleteIcon /> Delete asset(s)
          </button>
        </div>
      </Popover>
    </>
  );
}
