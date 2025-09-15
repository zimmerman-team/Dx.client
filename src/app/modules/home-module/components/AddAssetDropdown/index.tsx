import Popover from "@material-ui/core/Popover";
import AddIcon from "@material-ui/icons/Add";
import { PrimaryButton } from "app/components/Styled/button";
import { useCheckUserPlan } from "app/hooks/useCheckUserPlan";
import { useMenuNavigation } from "app/hooks/useMenuNavigation";
import { FOCUS_VISIBLE_STYLE_DARK, MOBILE_BREAKPOINT } from "app/theme";
import React from "react";
import { useHistory } from "react-router-dom";

export default function AddAssetDropdown() {
  const history = useHistory();
  const items = [
    {
      label: "Connect Dataset",
      action: () =>
        handleClick("dataset", () =>
          history.push(
            `/dataset/new/upload${
              window.location.pathname === "/" ? "?fromHome=true" : ""
            }`
          )
        ),
    },
    {
      label: "Create Chart",
      action: () => handleClick("chart", () => history.push("/chart/new/data")),
    },
    {
      label: "Create Story",
      action: () =>
        handleClick("story", () => history.push("/story/new/initial")),
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
  const { handleClick } = useCheckUserPlan();

  return (
    <>
      <button
        ref={triggerRef}
        data-cy="home-asset-dropdown-button"
        onClick={togglePopover}
        onKeyDown={(e) => handleTriggerKeyDown(e, e.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={!!openState}
        css={`
          width: 173px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          gap: 8px;
          background: ${openState ? "#6061E5" : "#231d2c"};
          color: #fff;
          height: 48px;
          outline: none;
          border: none;
          font-family: "GothamNarrow-Bold", sans-serif;
          padding: "0 24px";
          font-size: 14px;
          text-transform: capitalize;
          cursor: pointer;
          :focus-visible {
            ${FOCUS_VISIBLE_STYLE_DARK}
          }
          @media (max-width: ${MOBILE_BREAKPOINT}) {
            display: none;
          }
        `}
        aria-label="sort-button"
      >
        Add an Asset <AddIcon />
      </button>

      <Popover
        open={!!openState}
        anchorEl={openState}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
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
            width: 175px;
            padding: 4px;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            border-radius: 12px;
            background: #f4f4f4;
            box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.6);

            button {
              width: 100%;
              &:focus-visible {
                ${FOCUS_VISIBLE_STYLE_DARK}
                margin: 4px 3px;
                width: calc(100% - 6px);
              }
            }
          `}
        >
          {items.map((item, i) => (
            <PrimaryButton
              size="big"
              bg="dark"
              type="button"
              key={item.label}
              ref={(el) => (itemRefs.current[i] = el)}
              role="menuitem"
              tabIndex={activeIndex === i ? 0 : -1}
              onClick={item.action}
            >
              {item.label}
            </PrimaryButton>
          ))}
        </div>
      </Popover>
    </>
  );
}
