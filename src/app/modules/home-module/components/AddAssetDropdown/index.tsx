import Popover from "@material-ui/core/Popover";
import AddIcon from "@material-ui/icons/Add";
import { PrimaryButton } from "app/components/Styled/button";
import { useCheckUserPlan } from "app/hooks/useCheckUserPlan";
import { MOBILE_BREAKPOINT } from "app/theme";
import React from "react";
import { useHistory } from "react-router-dom";

export default function AddAssetDropdown() {
  const history = useHistory();
  const [sortPopoverAnchorEl, setSortPopoverAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  const handleCloseSortPopover = () => {
    setSortPopoverAnchorEl(null);
  };
  const togglePopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortPopoverAnchorEl(sortPopoverAnchorEl ? null : event.currentTarget);
  };
  const openSortPopover = Boolean(sortPopoverAnchorEl);
  const { handleClick } = useCheckUserPlan();

  return (
    <>
      <button
        data-cy="home-asset-dropdown-button"
        onClick={togglePopover}
        css={`
          width: 173px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          gap: 8px;
          background: ${openSortPopover ? "#6061E5" : "#231d2c"};
          color: #fff;
          height: 48px;
          outline: none;
          border: none;
          font-family: "GothamNarrow-Bold", sans-serif;
          padding: "0 24px";
          font-size: 14px;
          text-transform: capitalize;
          cursor: pointer;
          @media (max-width: ${MOBILE_BREAKPOINT}) {
            display: none;
          }
        `}
        aria-label="sort-button"
      >
        Add an Asset <AddIcon />
      </button>
      <Popover
        open={openSortPopover}
        anchorEl={sortPopoverAnchorEl}
        onClose={handleCloseSortPopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        css={`
          .MuiPaper-root {
            border-radius: 12px;
          }
        `}
      >
        <div
          css={`
            display: flex;
            width: 175px;
            padding: 4px;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            border-radius: 12px;
            background: #f4f4f4;
            box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.6);
            button {
              width: 100%;
            }
          `}
        >
          <PrimaryButton
            size="big"
            bg="dark"
            type="button"
            data-cy="home-connect-dataset-button"
            onClick={() =>
              handleClick("dataset", () =>
                history.push(
                  `/dataset/new/upload${
                    window.location.pathname === "/" ? "?fromHome=true" : ""
                  }`
                )
              )
            }
          >
            Connect Dataset
          </PrimaryButton>
          <PrimaryButton
            size="big"
            bg="dark"
            type="button"
            data-cy="home-create-chart-button"
            onClick={() =>
              handleClick("chart", () => history.push("/chart/new/data"))
            }
          >
            Create Chart
          </PrimaryButton>
          <PrimaryButton
            size="big"
            bg="dark"
            type="button"
            data-cy="home-create-story-button"
            onClick={() =>
              handleClick("story", () => history.push("/story/new/initial"))
            }
          >
            Create Story
          </PrimaryButton>
        </div>
      </Popover>
    </>
  );
}
