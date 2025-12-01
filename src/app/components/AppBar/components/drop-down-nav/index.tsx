import React from "react";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import { ClickAwayListener } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { FOCUS_VISIBLE_STYLE_LIGHT } from "@app/theme";
import { useMenuNavigation } from "@app/hooks/useMenuNavigation";

type Props = {
  item: {
    name: React.ReactNode;
    path: string;
    dropdown: boolean;
    options: { name: React.ReactNode; path: string; cy?: string }[];
    cy?: string;
    class?: undefined;
  };
  mobile?: boolean;
  handleNavigation?: () => void;
};

export const DropDownNav = ({ item, mobile, handleNavigation }: Props) => {
  const menuRef = React.useRef<HTMLDivElement>(null);

  const {
    openState,
    triggerRef,
    itemRefs,
    activeIndex,
    setOpenState,
    handleTriggerKeyDown,
    handleMenuKeyDown,
    closeMenu,
  } = useMenuNavigation({
    items: item.options,
  });

  const handleClosePopover = () => {
    setOpenState(false);
  };
  const handleTriggerClick = () => {
    setOpenState(!openState);
  };

  return (
    <>
      <span
        data-cy={item.cy}
        css={`
          display: flex;
          align-items: center;
          gap: 6px;
          position: relative;
          color: #231d2c;
          :hover {
            color: #6061e5;
            path {
              fill: #6061e5;
            }
          }
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
        `}
      >
        <button
          ref={triggerRef}
          aria-haspopup="menu"
          aria-expanded={openState}
          onClick={handleTriggerClick}
          onKeyDown={(e) => handleTriggerKeyDown(e, true)}
          css={`
            border: none;
            background: none;
            outline: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            :focus-visible {
              ${FOCUS_VISIBLE_STYLE_LIGHT}
            }
          `}
        >
          <b>{item.name}</b>{" "}
          {item.dropdown &&
            (openState ? <KeyboardArrowUp /> : <KeyboardArrowDown />)}
        </button>

        {openState && !mobile ? (
          <ClickAwayListener onClickAway={handleClosePopover}>
            <div
              role="menu"
              ref={menuRef}
              onKeyDown={handleMenuKeyDown}
              css={`
                border-radius: 10px;
                background: #ffffff;
                padding: 0 10px 10px 10px;
                position: absolute;
                top: -8px;
                left: -10px;
                width: calc(100% + 20px);
                box-shadow: 0px 3px 3px 0px rgba(152, 161, 170, 0.3);
              `}
            >
              <button
                tabIndex={-1}
                aria-hidden="true"
                data-cy={item.cy}
                css={`
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  position: relative;
                  border-bottom: 1px solid #dadaf8;
                  padding-bottom: 12px;
                  padding-top: 8px;
                  border: none;
                  background: none;
                  outline: none;
                  ${openState
                    ? `color: #6061E5;
                       path { fill: #6061E5; }`
                    : ""}
                `}
              >
                <b>{item.name}</b> {item.dropdown && <KeyboardArrowUp />}
              </button>

              <div
                css={`
                  display: flex;
                  flex-direction: column;
                  gap: 8px;
                  padding-top: 8px;
                `}
              >
                {item.options.map((option, index) => (
                  <NavLink
                    ref={(el) => (itemRefs.current[index] = el)}
                    onClick={() => {
                      closeMenu();
                    }}
                    to={option.path}
                    data-cy={option.cy}
                    key={option.cy ?? String(index)}
                    role="menuitem"
                    tabIndex={activeIndex === index ? 0 : -1}
                    css={`
                      margin: 0px;
                      line-height: normal;
                      padding: 8px 0px;
                      cursor: pointer;
                      :focus-visible {
                        ${FOCUS_VISIBLE_STYLE_LIGHT}
                      }
                    `}
                  >
                    <b>{option.name}</b>
                  </NavLink>
                ))}
              </div>
            </div>
          </ClickAwayListener>
        ) : null}
      </span>

      {openState && mobile ? (
        <div
          css={`
            display: flex;
            flex-direction: column;
            padding-left: 40px;
            padding-top: 8px;
          `}
        >
          {item.options.map((option, i) => (
            <NavLink
              to={option.path}
              data-cy={option.cy}
              key={option.cy ?? String(i)}
              onClick={handleNavigation}
              css={`
                margin: 0px;
                line-height: normal;
                padding: 16px 0px 16px 6px;
                border-bottom: 1px solid #dadaf8;
                :last-of-type {
                  padding-bottom: 0px;
                  border-bottom: none;
                }
                cursor: pointer;
              `}
            >
              <b>{option.name}</b>
            </NavLink>
          ))}
        </div>
      ) : null}
    </>
  );
};
