import React from "react";
import Grid from "@material-ui/core/Grid";
import { useAuth0 } from "@auth0/auth0-react";
import Toolbar from "@material-ui/core/Toolbar";
import MUIAppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { NavLink, useLocation, useHistory, Link } from "react-router-dom";
import { headercss, logocss } from "@app/components/AppBar/style";
import { MobileHeader } from "./components/mobile-nav";
import { NavList } from "./components/nav-list";
import { FOCUS_VISIBLE_STYLE_LIGHT } from "@app/theme";
import Logo from "@app/assets/icons/Logo";

export function AppBar() {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 881px)");
  const [openSearch, setOpenSearch] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navLocation = location.pathname.split("/").join("");

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
          role="banner"
          position="fixed"
          id="app-bar-desktop"
          color={location.pathname !== "/" ? "secondary" : "transparent"}
          css={`
            display: flex;
            background-color: #fff;
            border-bottom: 1px solid #dadaf8;
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
            `}
          >
            {
              <Container maxWidth="lg">
                <nav aria-label="Main">
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
                      <NavLink to="/" css={logocss} aria-label="Go to homepage">
                        <Logo />
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
                </nav>
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
              :focus-visible {
                ${FOCUS_VISIBLE_STYLE_LIGHT}
              }
            `}
          >
            Sign in
          </Link>
        )}

        {isAuthenticated && (
          <button
            onClick={() => history.push("/user-management/profile")}
            aria-label={`Go to profile for ${user?.name ?? "your account"}`}
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
              :focus-visible {
                ${FOCUS_VISIBLE_STYLE_LIGHT}
              }
            `}
          >
            {user?.given_name?.slice(0, 1) ??
              user?.name?.split(" ")[0]?.slice(0, 1)}
            {user?.family_name?.slice(0, 1) ??
              user?.name?.split(" ")[1]?.slice(0, 1)}
          </button>
        )}
      </div>
    </div>
  );
};
