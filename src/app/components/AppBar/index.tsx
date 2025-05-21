import React from "react";
import Grid from "@material-ui/core/Grid";
import { useAuth0 } from "@auth0/auth0-react";
import Popover from "@material-ui/core/Popover";
import Toolbar from "@material-ui/core/Toolbar";
import MUIAppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CloseIcon from "@material-ui/icons/CloseOutlined";
import { NavLink, useLocation, useHistory, Link } from "react-router-dom";
import { headercss, logocss, navLinkcss } from "app/components/AppBar/style";
import { isChartAIAgentActive } from "app/state/recoil/atoms";
import { useRecoilState } from "recoil";
import MenuIcon from "@material-ui/icons/Menu";
import InlineLogo from "app/modules/home-module/assets/inline-logo";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import { ClickAwayListener } from "@material-ui/core";

const DropDownNav = ({
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

const NavList = (props: {
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

function MobileHeader(props: { navLocation: string }) {
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

export function AppBar() {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 881px)");
  const [openSearch, setOpenSearch] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navLocation = location.pathname.split("/").join("");

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  React.useEffect(() => {
    if (anchorEl) {
      handleClose();
    }
    if (openSearch) {
      setOpenSearch(false);
    }
  }, [location.pathname]);

  return (
    <>
      {isMobile && <MobileHeader navLocation={navLocation} />}
      {!isMobile && (
        <MUIAppBar
          elevation={0}
          position="fixed"
          id="app-bar-desktop"
          color={location.pathname !== "/" ? "secondary" : "transparent"}
          css={`
            display: flex;
            background-color: #f2f7fd;
          `}
          data-cy="app-bar"
        >
          <Toolbar
            disableGutters
            variant="dense"
            css={`
              gap: 32px;
              width: 100%;
              height: 50px;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              @media (min-width: 768px) {
                #search-container {
                  padding: 3px 20px;
                  align-items: center;
                }

                #search-results-container {
                  top: 40px;
                  box-shadow: 0px 0px 10px rgba(152, 161, 170, 0.6);
                }
              }
            `}
          >
            {
              <Container maxWidth="lg">
                <Grid
                  container
                  css={headercss}
                  alignContent="space-between"
                  alignItems="center"
                >
                  <Grid
                    item
                    lg={3}
                    md={2}
                    sm={2}
                    css={`
                      gap: 180px;
                      display: flex;
                      align-items: center;
                    `}
                    data-cy="header-logo"
                  >
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
                  </Grid>
                  <Grid
                    item
                    lg={9}
                    md={10}
                    sm={10}
                    css={`
                      gap: 44px;
                      display: flex;
                      align-items: center;
                      justify-content: flex-end;
                    `}
                  >
                    {" "}
                    <NavList navLocation={navLocation} />
                    <ActionMenu />
                  </Grid>
                </Grid>
              </Container>
            }
          </Toolbar>
        </MUIAppBar>
      )}
    </>
  );
}

const ActionMenu = () => {
  const history = useHistory();
  const { user, isAuthenticated } = useAuth0();
  const setIsAiSwitchActive = useRecoilState(isChartAIAgentActive)[1];
  const [actionPopoverAnchorEl, setActionPopoverAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);

  const openActionPopover = Boolean(actionPopoverAnchorEl);

  const handleCloseActionPopover = () => {
    setActionPopoverAnchorEl(null);
  };
  const handleCreateChartAction = () => {
    setActionPopoverAnchorEl(null);
    setIsAiSwitchActive(true);
  };

  return (
    <div>
      <div
        css={`
          display: flex;
          position: relative;

          button {
            outline: none;
            border: none;
            background: #dadaf8;
            color: #231d2c;
            font-size: 16px;
            line-height: normal;
            padding: 0px;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          }
          svg {
            ${openActionPopover ? "transform: rotate(180deg)" : ""}
          }
        `}
      >
        {!isAuthenticated && (
          <Link
            to="/onboarding/signin"
            data-cy="appbar-create-story/login"
            css={`
              background: #6061e5;
              color: #ffffff !important;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 10px;
              padding: 10px 16px;
              line-height: normal;
            `}
          >
            Sign in
          </Link>
        )}

        {isAuthenticated && (
          <button
            onClick={() => history.push("/user-management/profile")}
            data-cy="navbar-profile-btn"
            css={`
              min-width: 35px;
              height: 35px;
              display: flex;
              border-radius: 50%;
              align-items: center;
              color: #ffffff !important;
              background: #6061e5 !important;
              font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
              justify-content: center;
              font-weight: 350;
            `}
          >
            {user?.given_name?.slice(0, 1) ??
              user?.name?.split(" ")[0]?.slice(0, 1)}
            {user?.family_name?.slice(0, 1) ??
              user?.name?.split(" ")[1]?.slice(0, 1)}
          </button>
        )}
      </div>
      <Popover
        open={openActionPopover}
        anchorEl={actionPopoverAnchorEl}
        onClose={handleCloseActionPopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        css={`
          .MuiPaper-root {
            border-radius: 8px;
            margin-top: 4px;
          }
        `}
      >
        <div
          css={`
            width: 188px;
            height: 76px;
            background: #ffffff;
            color: #262c34;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: flex-start;
            font-family: "GothamNarrow-Light", "Helvetica Neue", sans-serif;

            a {
              display: flex;
              gap: 8px;
              align-items: center;
              padding-left: 8px;
              width: 100%;
              height: 100%;
              text-decoration: none;

              button {
                padding: 0px;
                width: 100%;
                border: none;
                outline: none;
                background: transparent;
                cursor: pointer;
                display: flex;
                gap: 8px;
                align-items: center;
                font-weight: 500;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              }

              &:hover,
              &:active {
                cursor: pointer;
                background: #6061e5;

                button {
                  color: #fff;
                }
              }
            }
          `}
        >
          <Link to="/dataset/new/upload" onClick={handleCloseActionPopover}>
            <button data-cy="appbar-connect-data">Connect Data</button>
          </Link>

          <Link to="/chart/new/data" onClick={handleCreateChartAction}>
            <button data-cy="appbar-create-chart">Create Chart</button>
          </Link>
        </div>
      </Popover>
    </div>
  );
};
