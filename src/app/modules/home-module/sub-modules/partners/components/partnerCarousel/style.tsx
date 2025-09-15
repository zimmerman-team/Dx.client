import { Tab, Tabs, withStyles } from "@material-ui/core";
import { DESKTOP_BREAKPOINT } from "app/theme";

export const StyledTab = withStyles(() => ({
  root: {
    "&.MuiButtonBase-root": {
      "&.MuiTab-root": {
        width: "fit-content",
        minWidth: "fit-content",
        padding: "0px ",
        textTransform: "none",
      },
    },

    "&.MuiTab-textColorPrimary": {
      "& .MuiTab-wrapper": {
        width: "200px",
        fontSize: "18px",
        fontWeight: 325,
        color: "#231D2C !important",
        fontFamily: `"GothamNarrow-Book", "Helvetica Neue", sans-serif`,
        [`@media (max-width: ${DESKTOP_BREAKPOINT})`]: {
          width: "155px",
        },
      },
      "&.Mui-selected": {
        "& .MuiTab-wrapper": {
          fontSize: "18px",
          fontWeight: 400,
          color: "#161616 !important",
          fontFamily: `"GothamNarrow-Bold", "Helvetica Neue", sans-serif`,
        },
      },
    },
    // ✅ Focus-visible styles
  },
}))(Tab);

export const StyledTabs = withStyles({
  root: {
    "& .MuiTabs-scroller": {
      "& .MuiTabs-flexContainer": {
        gap: "20px",
        [`@media (max-width: ${DESKTOP_BREAKPOINT})`]: {
          gap: "10px",
        },
      },
    },
  },
})(Tabs);
