import React from "react";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import { ClickAwayListener } from "@material-ui/core";
import { NavLink } from "react-router-dom";

export const DropDownNav = ({
  item,
  mobile,
  handleNavigation,
}: {
  item: {
    name: React.ReactNode;
    path: string;
    dropdown: boolean;
    options: {
      name: React.ReactNode;
      path: string;
      cy?: string;
    }[];
    cy?: string;
    class?: undefined;
  };
  mobile?: boolean;
  handleNavigation?: () => void;
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <span
        data-cy={item.cy}
        css={`
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
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
        onClick={() => {
          setOpen(!open);
        }}
      >
        <b>{item.name}</b> {item.dropdown && <KeyboardArrowDown />}
        {open ? (
          mobile ? null : (
            <ClickAwayListener onClickAway={() => setOpen(false)}>
              <div
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
                <span
                  data-cy={item.cy}
                  css={`
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                    position: relative;
                    border-bottom: 1px solid #dadaf8;
                    padding-bottom: 12px;
                    padding-top: 8px;
                    ${open
                      ? `color: #6061E5;
                    path {
                    fill: #6061E5;
                    }`
                      : ""}
                  `}
                >
                  <b>{item.name}</b> {item.dropdown && <KeyboardArrowUp />}
                </span>
                <div
                  css={`
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding-top: 8px;
                  `}
                >
                  {item.options.map((option) => (
                    <NavLink
                      to={option.path}
                      data-cy={option.cy}
                      css={`
                        margin: 0px;
                        line-height: normal;
                        padding: 8px 0px;
                        cursor: pointer;
                      `}
                    >
                      <b>{option.name}</b>
                    </NavLink>
                  ))}
                </div>
              </div>
            </ClickAwayListener>
          )
        ) : null}
      </span>
      {open && mobile ? (
        <div
          css={`
            display: flex;
            flex-direction: column;
            padding-left: 40px;
            padding-top: 8px;
          `}
        >
          {item.options.map((option) => (
            <NavLink
              to={option.path}
              data-cy={option.cy}
              onClick={handleNavigation}
              css={`
                margin: 0px;
                line-height: normal;
                padding: 16px 0px;
                padding-left: 6px;
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
