import React from "react";
import Grid from "@material-ui/core/Grid";
import { useAuth0 } from "@auth0/auth0-react";
import Popover from "@material-ui/core/Popover";
import Toolbar from "@material-ui/core/Toolbar";
import MUIAppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { NavLink, useLocation, useHistory, Link } from "react-router-dom";
import { headercss, logocss } from "app/components/AppBar/style";
import { isChartAIAgentActive } from "app/state/recoil/atoms";
import { useRecoilState } from "recoil";
import { MobileHeader } from "./components/mobile-nav";
import { NavList } from "./components/nav-list";

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
