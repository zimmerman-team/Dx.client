import React from "react";
import InlineLogo from "app/modules/home-module/assets/inline-logo";
import { navLinkcss } from "app/components/AppBar/style";
import { DropDownNav } from "app/components/AppBar/components/drop-down-nav";
import { NavLink } from "react-router-dom";

export const NavList = (props: {
  navLocation: string;
  setIsNavExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
  mobile?: boolean;
}) => {
  const list = [
    { name: "Dashboard", path: "/", cy: "nav-explore", class: "" },
    {
      name: (
        <b
          css={`
            display: flex;
            align-items: center;
            gap: 6px;
          `}
        >
          About <InlineLogo width={103} />
        </b>
      ),
      path: ".",
      dropdown: true,
      options: [
        {
          name: "Who We Are",
          path: "/about",
          cy: "nav-about",
        },
        {
          name: (
            <b
              css={`
                display: flex;
                align-items: center;
                gap: 6px;
              `}
            >
              Why <InlineLogo width={103} />
            </b>
          ),
          path: "/why-dataxplorer",
          cy: "nav-why-dataxplorer",
        },
        {
          name: "Our Partners",
          path: "/partners",
          cy: "nav-partners",
        },
      ],
    },
    { name: "Pricing", path: "/pricing", cy: "nav-pricing", class: "pricing" },
    { name: "Contact", path: "/contact", cy: "nav-contact", class: "contact" },
  ];
  const handleNavigation = () => {
    props.setIsNavExpanded?.(false);
  };
  return (
    <>
      {list.map((item) => (
        <div
          key={item.cy}
          css={`
            ${navLinkcss(item.class ?? item.path, props.navLocation)}
            ${props.mobile
              ? `padding: 16px 0px 16px 20px;
            border-bottom: 1px solid #dadaf8;`
              : ""}
          `}
          onClick={item.dropdown ? undefined : handleNavigation}
        >
          {item.dropdown ? (
            <DropDownNav
              item={item}
              handleNavigation={handleNavigation}
              mobile={props.mobile}
            />
          ) : (
            <NavLink to={item.path} data-cy={item.cy}>
              <b>{item.name}</b>
            </NavLink>
          )}
        </div>
      ))}
    </>
  );
};
