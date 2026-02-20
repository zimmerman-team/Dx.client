import React from "react";
import TableIcon from "@app/modules/home-module/assets/table-icon.svg?react";
import Popover from "@material-ui/core/Popover";
import { CustomGridIcon } from "@app/modules/home-module/components/Filter";

export default function ActionsMenu(props: {
  setSortValue: (value: "updatedDate" | "createdDate" | "name") => void;
  setFilterValue?: (value: "allAssets" | "myAssets") => void;
  setAssetsView: (value: "grid" | "table") => void;
  filterValue?: string;
  sortValue: string;
  assetsView: "table" | "grid";
  terminateSearch?: () => void;
}) {
  const BORDER_BOTTOM = "1px solid #cfd4da";
  const menuItems = [
    {
      label: props.assetsView === "grid" ? "Card View" : "List View",
      value: "view",
      icon: props.assetsView === "grid" ? <CustomGridIcon /> : <TableIcon />,
      children: [
        {
          label: "Card View",
          value: "grid",
          active: props.assetsView === "grid",
          action: () => props.setAssetsView("grid"),
        },
        {
          label: "List View",
          value: "table",
          active: props.assetsView === "table",
          action: () => props.setAssetsView("table"),
        },
      ],
    },

    {
      label: "Sort By",
      value: "sort",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.69922 12.1498L5.39922 14.8498M5.39922 14.8498L8.09922 12.1498M5.39922 14.8498V4.0498M14.8492 6.7498L12.1492 4.0498M12.1492 4.0498L9.44922 6.7498M12.1492 4.0498V14.8498"
            stroke="#231D2C"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
      children: [
        {
          label: "Updated Date",
          value: "updatedDate",
          active: props.sortValue === "updatedDate",
          action: () => {
            props.terminateSearch && props.terminateSearch();
            props.setSortValue("updatedDate");
          },
        },
        {
          label: "Created Date",
          value: "createdDate",
          active: props.sortValue === "createdDate",
          action: () => {
            props.terminateSearch && props.terminateSearch();
            props.setSortValue("createdDate");
          },
        },
        {
          label: "Name",
          value: "name",
          active: props.sortValue === "name",
          action: () => {
            props.terminateSearch && props.terminateSearch();
            props.setSortValue("name");
          },
        },
      ],
    },
    {
      label: "Filter",
      value: "filter",
      icon: (
        <svg
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.5 1L1.5 1L7.5 10.46V17L10.5 19V10.46L16.5 1Z"
            stroke="#231D2C"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
      children: [
        {
          label: "All Assets",
          value: "allAssets",
          active: props.filterValue === "allAssets",
          action: () => {
            props.terminateSearch && props.terminateSearch();
            props.setFilterValue?.("allAssets");
          },
        },
        {
          label: "My Assets",
          value: "myAssets",
          active: props.filterValue === "myAssets",
          action: () => {
            props.terminateSearch && props.terminateSearch();
            props.setFilterValue?.("myAssets");
          },
        },
      ],
    },
  ];

  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);

  const [subMenuPopoverAnchorEl, setSubMenuPopoverAnchorEl] =
    React.useState<HTMLElement | null>(null);

  const handleOpenSortPopover = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    setSubMenuPopoverAnchorEl(event.currentTarget);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleCloseSubMenuPopover = () => {
    setExpandedIndex(null);
    setSubMenuPopoverAnchorEl(null);
  };

  return (
    <div
      css={`
        display: flex;
        width: 195px;
        flex-direction: column;
        align-items: center;
        border-radius: 10px;
        background: #f1f3f5;
      `}
    >
      {menuItems.map((card, index) => (
        <div
          key={card.value}
          //   data-cy={card.cypressId}
          onClick={(e) => handleOpenSortPopover(e, index)}
          css={`
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 40px;
            width: 100%;
            padding: 11px 11px 11px 16px;

            border-radius: ${index === 0
              ? "10px 10px 0 0"
              : index === menuItems.length - 1
              ? "0 0 10px 10px"
              : "0"};
            border-bottom: ${index !== menuItems.length - 1
              ? BORDER_BOTTOM
              : "none"};
            border: none;
            border-bottom: ${index !== menuItems.length - 1
              ? BORDER_BOTTOM
              : "none"};
            &:hover {
              background: #cfd0f4;
              border-bottom: 1px solid #8081e3;
              background: var(--Blue-200, #cfd0f4);
              ${index - 1 > 0 ? "width: 100%;" : ""}
              width: 100%;
            }
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
              svg {
                & :nth-of-type(1) {
                  path {
                    fill: #231d2c;
                  }
                }
              }
            `}
          >
            {card.icon}
            <span
              css={`
                margin-left: 8px;
                font-family: "GothamNarrow-Book", sans-serif;
                font-size: 14px;
                color: #231d2c;
              `}
            >
              {card.label}
            </span>
          </div>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.75 13.5L11.25 9L6.75 4.5"
              stroke="black"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <Popover
            open={expandedIndex === index}
            anchorEl={subMenuPopoverAnchorEl}
            onClose={handleCloseSubMenuPopover}
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
                border-radius: 12px;
              }
            `}
          >
            <div
              css={`
                top: 100%;
                left: 0;
                z-index: 1;
                background: #f1f3f5;
                width: 176px;
                box-shadow: 0px 2px 6px 0px #0000004d;
                border-radius: 10px;

                button {
                  background: transparent;
                  outline: none;
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                }
              `}
            >
              {card.children.map((child, childIndex) => (
                <button
                  key={child.value}
                  onClick={() => {
                    child.action();
                    setActiveMenu(child.value);
                  }}
                  css={`
                    border: none;
                    border-bottom: ${childIndex !== card.children.length - 1
                      ? BORDER_BOTTOM
                      : "none"};
                    padding: 11px 16px;
                  `}
                >
                  <span
                    css={`
                      color: #231d2c;
                      white-space: nowrap;
                      font-family: "GothamNarrow-book", "Helvetica Neue",
                        sans-serif;
                      font-size: 14px;
                    `}
                  >
                    {child.label}
                  </span>
                  {(child.active || activeMenu === child.value) && (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 4.5L6.75 12.75L3 9"
                        stroke="#70777E"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </Popover>
        </div>
      ))}
    </div>
  );
}
