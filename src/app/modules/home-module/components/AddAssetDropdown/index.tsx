import Popover from "@material-ui/core/Popover";
import { useCheckUserPlan } from "app/hooks/useCheckUserPlan";
import { useMenuNavigation } from "app/hooks/useMenuNavigation";
import {
  FOCUS_VISIBLE_STYLE_DARK,
  FOCUS_VISIBLE_STYLE_LIGHT,
  MOBILE_BREAKPOINT,
} from "app/theme";
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
  const connectDataset = () => {
    handleClick("dataset", () =>
      history.push(
        `/dataset/new/upload${
          window.location.pathname === "/" ? "?fromHome=true" : ""
        }`
      )
    );
  };
  const items = [
    {
      label: "Connect Dataset",
      action: () => connectDataset(),
    },
    {
      label: "Create Chart",
      action: () => handleClick("chart", () => history.push("/chart/new/data")),
    },
    {
      label: "Create Story",
      action: () =>
        handleClick("story", () => history.push("/story/new/initial")),
    },
  ];
  const {
    openState,
    setOpenState,
    triggerRef,
    itemRefs,
    handleTriggerKeyDown,
    handleMenuKeyDown,
    activeIndex,
  } = useMenuNavigation({
    items,
    onSelect: (item) => item.action(),
  });

  const handleClosePopover = () => {
    setOpenState(null);
  };
  const togglePopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenState(openState ? null : event.currentTarget);
  };
  const { handleClick } = useCheckUserPlan();
  const chartPath = "/chart/new/data";
  const storyPath = "/story/new/initial";
  const ctaCards = [
    {
      title: "Add Dataset",
      link: "/dataset/new/upload",
      cypressId: "home-create-dataset-button",
      action: () => connectDataset(),
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
        ref={triggerRef}
        data-cy="home-asset-dropdown-button"
        onClick={togglePopover}
        onKeyDown={(e) => handleTriggerKeyDown(e, e.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={!!openState}
        css={`
          width: 145px;
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: space-between;
          border-radius: 12px;
          padding: 0 16px;
          background: ${openState ? "#6061E5" : "#231d2c"};
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
          :focus-visible {
            ${FOCUS_VISIBLE_STYLE_DARK}
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
        open={!!openState}
        anchorEl={openState}
        onClose={handleClosePopover}
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
          role="menu"
          onKeyDown={handleMenuKeyDown}
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
              &:focus-visible {
                ${FOCUS_VISIBLE_STYLE_LIGHT}
                margin: 4px 3px;
                width: calc(100% - 6px);
              }
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
              ref={(el) => (itemRefs.current[index] = el)}
              role="menuitem"
              tabIndex={activeIndex === index ? 0 : -1}
            >
              {card.title} {AddIcon}
            </button>
          ))}
        </div>
      </Popover>
    </>
  );
}
