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

const NavList = (props: {
  navLocation: string;
  setIsNavExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const list = [
    { name: "Explore", path: "/", cy: "nav-explore", class: "" },
    {
      name: "Why Dataxplorer",
      path: "/why-dataxplorer",
      cy: "nav-why",
      class: "why-dataxplorer",
    },
    {
      name: "About",
      path: "/about",
      cy: "nav-about",
      class: "about",
    },
    {
      name: "Partners",
      path: "/partners",
      cy: "nav-partners",
      class: "partners",
    },
    { name: "Pricing", path: "/pricing", cy: "nav-pricing", class: "pricing" },
    { name: "Contact", path: "/contact", cy: "nav-contact", class: "contact" },
  ];
  const handleNavigation = () => {
    props.setIsNavExpanded?.(false);
    document.body.style.overflow = "auto";
  };
  return (
    <>
      {list.map((item) => (
        <div
          key={item.cy}
          css={navLinkcss(item.class ?? item.path, props.navLocation)}
          onClick={handleNavigation}
        >
          <NavLink to={item.path} data-cy={item.cy}>
            <b>{item.name}</b>
          </NavLink>
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
          background: ${isNavExpanded ? "#F2F7FD" : "#fff"};
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
                  min-width: 33px;
                  height: 33px;
                  display: flex;
                  margin-left: 16px;
                  border-radius: 50%;
                  align-items: center;
                  background: #b5b5db;
                  justify-content: center;
                  border: none;
                  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
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
                to="/onboarding/login"
                css={`
                  border-radius: 24.48px;
                  background: #dadaf8;
                  display: flex;
                  width: 100%;
                  max-width: 110px;
                  height: 34px;
                  justify-content: center;
                  align-items: center;
                  gap: 8.16px;
                  color: var(--Primary-Dark, #231d2c);
                  font-family: "Inter", sans-serif;
                  font-size: 11.424px;
                  font-weight: 500;
                  text-transform: uppercase;
                  text-decoration: none;
                  white-space: nowrap;
                `}
              >
                Log in
              </Link>
            )}
          </div>
        </div>
        <div
          css={`
            padding: 16px 32px;
            border-bottom: 1px solid #e4e4e4;
            border-top: 1px solid #e4e4e4;
            display: flex;
            flex-direction: column;
            opacity: ${isNavExpanded ? 1 : 0};
            background: #f2f7fd;
            transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.3s;
            gap: 32px;
            a {
              color: #000000;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              font-size: 24px;
              text-decoration: none;
            }
          `}
        >
          <NavList
            navLocation={props.navLocation}
            setIsNavExpanded={setIsNavExpanded}
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
          color={location.pathname !== "/" ? "secondary" : "transparent"}
          css={`
            display: flex;
            background-color: #f2f7fd;
          `}
        >
          <Toolbar
            disableGutters
            variant="dense"
            css={`
              gap: 32px;
              width: 100%;
              height: 48px;
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
                  >
                    <NavLink to="/" css={logocss}>
                      <img src="/logo.svg" alt="logo" />
                    </NavLink>
                  </Grid>
                  <Grid
                    item
                    lg={9}
                    md={10}
                    sm={10}
                    css={`
                      gap: 20px;
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
            font-size: 11.424px;
            line-height: normal;
            padding: 0px;
            font-family: "Inter", sans-serif;

            :nth-child(1) {
              width: ${isAuthenticated ? "146px" : "110px"};
              height: 34px;
              border-radius: 24px;
              &:hover {
                opacity: 0.8;
              }
            }
            /* :nth-child(2) {
              width: 41px;
              height: 34px;
              border-radius: 0px 24px 24px 0px;
              background: ${openActionPopover ? "#b5b5db" : "#dadaf8"};
              &:hover {
                background: #b5b5db;
              } */
            }
            svg {
              ${openActionPopover ? "transform: rotate(180deg)" : ""}
            }
          }
        `}
      >
        <Link to={isAuthenticated ? "/dashboard" : "/onboarding/login"}>
          <button data-cy="appbar-create-report/login">
            {isAuthenticated ? "MY DASHBOARD" : "Log in"}
          </button>
        </Link>
        {/* {isAuthenticated && (
          <button
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              setActionPopoverAnchorEl(
                actionPopoverAnchorEl ? null : event.currentTarget
              );
            }}
            data-cy="create-report-dropdown"
          >
            <KeyboardArrowDownIcon />
          </button>
        )} */}
        {isAuthenticated && (
          <button
            onClick={() => history.push("/user-management/profile")}
            css={`
              min-width: 33px;
              height: 33px;
              display: flex;
              margin-left: 16px;
              border-radius: 50%;
              align-items: center;
              background: #b5b5db;
              justify-content: center;
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
                text-transform: uppercase;
                font-weight: 500;
                font-family: "Inter", sans-serif;
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
