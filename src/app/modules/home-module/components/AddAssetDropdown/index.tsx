import Popover from "@material-ui/core/Popover";
import { useCheckUserPlan } from "app/hooks/useCheckUserPlan";
import { MOBILE_BREAKPOINT } from "app/theme";
import React from "react";
import { useHistory } from "react-router-dom";

const AddIcon = (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.25 6.75H0.75V5.25H5.25V0.75H6.75V5.25H11.25V6.75H6.75V11.25H5.25V6.75Z"
      fill="#231D2C"
    />
  </svg>
);

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
  const chartPath = "/chart/new/data";
  const storyPath = "/story/new/initial";
  const ctaCards = [
    {
      title: "Add Dataset",
      link: "/dataset/new/upload",
      cypressId: "home-create-dataset-button",
      action: () =>
        handleClick("dataset", () =>
          history.push(
            `/dataset/new/upload${
              window.location.pathname === "/" ? "?fromHome=true" : ""
            }`
          )
        ),
    },
    {
      title: " Create a Chart",
      link: chartPath,
      cypressId: "home-create-chart-button",
      action: () => handleClick("chart", () => history.push(chartPath)),
    },
    {
      title: "Build a Story",
      link: storyPath,
      cypressId: "home-create-story-button",
      action: () => handleClick("story", () => history.push(storyPath)),
    },
  ];
  return (
    <>
      <button
        data-cy="home-asset-dropdown-button"
        onClick={togglePopover}
        css={`
          width: 145px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 12px;
          padding: 0 16px;
          background: ${openSortPopover ? "#002D9C" : "#6061E5"};
          color: #fff;
          height: 40px;
          outline: none;
          border: none;
          font-family: "GothamNarrow-Bold", sans-serif;
          padding: "0 24px";
          font-size: 14px;
          text-transform: capitalize;
          cursor: pointer;
          svg {
            path {
              fill: #fff;
            }
          }
          @media (max-width: ${MOBILE_BREAKPOINT}) {
            display: none;
          }
        `}
        aria-label="sort-button"
      >
        Add New {AddIcon}
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
            width: 164px;
            flex-direction: column;
            align-items: center;
            border-radius: 10px;
            background: #f1f3f5;
            box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.6);
            button {
              outline: none;
              width: 90%;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-family: "GothamNarrow-Book", sans-serif;
              font-size: 14px;
              color: #231d2c;
              background: transparent;
              cursor: pointer;
            }
          `}
        >
          {ctaCards.map((card, index) => (
            <button
              key={card.title}
              type="button"
              data-cy={card.cypressId}
              onClick={card.action}
              css={`
                border-radius: ${index === 0
                  ? "10px 10px 0 0"
                  : index === ctaCards.length - 1
                  ? "0 0 10px 10px"
                  : "0"};
                border-bottom: ${index !== ctaCards.length - 1
                  ? "1px solid #cfd4da"
                  : "none"};
                border: none;
                border-bottom: ${index !== ctaCards.length - 1
                  ? "1px solid #cfd4da"
                  : "none"};
                &:hover {
                  background: #dfe3e5;

                  ${index - 1 > 0 ? "width: 100%;" : ""}
                  width: 100%;
                  padding: 0 14px;
                }
              `}
            >
              {card.title} {AddIcon}
            </button>
          ))}
        </div>
      </Popover>
    </>
  );
}
