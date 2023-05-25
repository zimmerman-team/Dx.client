import React from "react";
import get from "lodash/get";
import { useRecoilState } from "recoil";
import Toolbar from "@material-ui/core/Toolbar";
import MUIAppBar from "@material-ui/core/AppBar";
import MenuItem from "@material-ui/core/MenuItem";
import { useCMSData } from "app/hooks/useCMSData";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import { homeDisplayAtom } from "app/state/recoil/atoms";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import IconChevronLeft from "@material-ui/icons/ChevronLeft";
import {
  headercss,
  loginBtn,
  logocss,
  navLinkcss,
} from "app/components/AppBar/style";
import { MobileAppbarSearch } from "app/components/Mobile/AppBarSearch";
import { NavLink, useLocation, useHistory, Link } from "react-router-dom";
import { Grid } from "@material-ui/core";

const TextHeader = (label: string) => (
  <h2
    css={`
      font-size: 18px;
      font-weight: bold;
      font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
    `}
  >
    {label}
  </h2>
);

function MobileHeader() {
  const history = useHistory();

  return (
    <React.Fragment>
      <IconButton
        onClick={() => history.goBack()}
        css={`
          padding-left: 0;
        `}
      >
        <IconChevronLeft htmlColor="#fff" />
      </IconButton>
      <MobileAppbarSearch />
    </React.Fragment>
  );
}

export const StyledMenu = withStyles({
  paper: {
    minWidth: 220,
    borderRadius: "0 0 10px 10px",
    boxShadow: "0px 0px 10px rgba(152, 161, 170, 0.6)",
    "&::-webkit-scrollbar": {
      width: 5,
      borderRadius: 10,
      background: "#231d2c",
    },
    "&::-webkit-scrollbar-track": {
      borderRadius: 10,
      background: "#dfe3e6",
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: 10,
      background: "#231d2c",
    },
  },
  list: {
    padding: 0,
    maxHeight: 500,
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    autoFocus={false}
    {...props}
  />
));

export const StyledMenuItem = withStyles(() => ({
  root: {
    padding: 0,
    width: "100%",
    borderBottom: "1px solid #DFE3E6",
    "& a": {
      width: "100%",
      fontSize: "14px",
      color: "#231d2c",
      padding: "10px 12px",
      textDecoration: "none",
    },
  },
}))(MenuItem);

export function AppBar() {
  const location = useLocation();
  const cmsData = useCMSData({ returnData: true });
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [openSearch, setOpenSearch] = React.useState(false);
  const [display, setDisplay] = useRecoilState(homeDisplayAtom);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function getMobilePageHeader() {
    switch (location.pathname) {
      case "/about":
        return TextHeader(get(cmsData, "componentsAppBar.about", ""));
      case "/datasets":
        return (
          <React.Fragment>
            {TextHeader("Explore")}
            <MobileAppbarSearch />
          </React.Fragment>
        );
      default:
        return <MobileHeader />;
    }
  }

  React.useEffect(() => {
    if (anchorEl) {
      handleClose();
    }
    if (openSearch) {
      setOpenSearch(false);
    }
  }, [location.pathname]);

  if (location.pathname === "/" && isMobile) {
    return <React.Fragment />;
  }
  const handlePath = (path: "charts" | "reports" | "data") => {
    setDisplay(path);
  };

  return (
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
        {isMobile && getMobilePageHeader()}
        {!isMobile && (
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
                  <img
                    src="/logo.svg"
                    alt={get(cmsData, "componentsAppBar.logoAlt", "")}
                  />
                </NavLink>
              </Grid>

              <Grid
                item
                lg={9}
                md={10}
                sm={10}
                css={`
                  display: flex;
                  align-items: center;
                  justify-content: flex-end;
                  gap: 20px;
                `}
              >
                <div css={navLinkcss("")}>
                  <NavLink to="#" onClick={() => handlePath("data")}>
                    <b>Why Dx?</b>
                  </NavLink>
                </div>
                <div css={navLinkcss("")}>
                  <NavLink to="#" onClick={() => handlePath("charts")}>
                    <b>Explore Reports</b>
                  </NavLink>
                </div>
                <div css={navLinkcss("")}>
                  <Link to="#" onClick={() => handlePath("reports")}>
                    <b>About</b>
                  </Link>
                </div>
                <div css={navLinkcss("")}>
                  <Link to="#" onClick={() => handlePath("reports")}>
                    <b>Cases </b>
                  </Link>
                </div>
                <div css={navLinkcss("")}>
                  <Link to="#" onClick={() => handlePath("reports")}>
                    <b>Contact </b>
                  </Link>
                </div>

                <div css={loginBtn}>
                  <Link to="/onboarding/login">Create report</Link>
                </div>
              </Grid>
            </Grid>
          </Container>
        )}
      </Toolbar>
    </MUIAppBar>
  );
}
