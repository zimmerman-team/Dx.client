import React from "react";
import MenuIcon from "@material-ui/icons/Menu";
import { MOBILE_BREAKPOINT } from "app/theme";
import CloseIcon from "@material-ui/icons/CloseOutlined";
import { Link, NavLink, useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { logocss } from "app/components/AppBar/style";
import { NavList } from "app/components/AppBar/components/nav-list";

export function MobileHeader(props: { navLocation: string }) {
  const history = useHistory();
  const { user, isAuthenticated } = useAuth0();
  const [isNavExpanded, setIsNavExpanded] = React.useState(false);
  const handleNavExpand = () => {
    if (!isNavExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    setIsNavExpanded(!isNavExpanded);
  };
  return (
    <React.Fragment>
      <div
        css={`
          height: ${isNavExpanded ? "100vh" : "66px"};
          overflow: ${isNavExpanded ? "auto" : "hidden"};
          padding: 0px 16px 16px 16px;
          width: 100%;
          background: ${isNavExpanded ? "#ffffff" : "#f2f7fd"};
          transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.3s;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 101;
        `}
      >
        <div
          css={`
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 66px;
          `}
        >
          <div
            css={`
              display: flex;
              gap: 8px;
              align-items: center;
              height: 100%;
              /* width: 100%; */
            `}
          >
            <button
              onClick={handleNavExpand}
              css={`
                border: none;
                outline: none;
                background: transparent;
                display: flex;
                align-items: center;
                padding: 0px;
              `}
            >
              {isNavExpanded ? (
                <CloseIcon htmlColor="#1C1B1F" />
              ) : (
                <MenuIcon htmlColor="#1C1B1F" />
              )}
            </button>
            <NavLink to="/" css={logocss}>
              <img src="/logo.svg" alt="logo" />
              <div
                css={`
                  font-family: "Inter", sans-serif;
                  color: #e75656;
                  font-size: 11.095px;
                  font-weight: 500;
                  line-height: 11.095px;
                  padding: 2.466px 8.09px;
                  border: 0.736px solid #e75656;
                  border-radius: 15.41px;
                `}
              >
                beta
              </div>
            </NavLink>
          </div>
          <div
            css={`
              width: 100%;
              display: flex;
              justify-content: flex-end;
            `}
          >
            {isAuthenticated ? (
              <button
                onClick={() => history.push("/user-management/profile")}
                css={`
                  min-width: 35px;
                  height: 35px;
                  display: flex;
                  margin-left: 16px;
                  border-radius: 50%;
                  align-items: center;
                  color: #ffffff !important;
                  background: #6061e5 !important;
                  justify-content: center;
                  border: none;
                  font-family: "GothamNarrow-Medium", "Helvetica Neue",
                    sans-serif;
                  font-size: 14px;
                `}
              >
                {user?.given_name?.slice(0, 1) ??
                  user?.name?.split(" ")[0]?.slice(0, 1)}
                {user?.family_name?.slice(0, 1) ??
                  user?.name?.split(" ")[1]?.slice(0, 1)}
              </button>
            ) : (
              <Link
                to="/onboarding/signin"
                css={`
                  color: #ffffff !important;
                  background: #6061e5 !important;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                  font-size: 16px;
                  font-weight: 400;
                  text-decoration: none;
                  white-space: nowrap;
                  border-radius: 10px;
                  padding: 12px 24px;
                  line-height: 11px;
                  @media (max-width: ${MOBILE_BREAKPOINT}) {
                    width: 61px;
                  }
                `}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
        <div
          css={`
            border-top: 1px solid #dadaf8;
            display: flex;
            flex-direction: column;
            opacity: ${isNavExpanded ? 1 : 0};
            background: ${isNavExpanded ? "#ffffff" : "#f2f7fd"};
            transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.3s;
            a,
            span {
              color: #000000;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              font-size: 16px;
              text-decoration: none;
            }
          `}
        >
          <NavList
            navLocation={props.navLocation}
            setIsNavExpanded={setIsNavExpanded}
            mobile
          />
        </div>
      </div>
    </React.Fragment>
  );
}
