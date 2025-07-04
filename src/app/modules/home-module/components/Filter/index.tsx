import React from "react";
import {
  iconButtonCss,
  rowFlexCss,
  searchInputCss,
  sortByItemCss,
} from "app/modules/home-module/style";
import { Popover, Tooltip } from "@material-ui/core";
import { ReactComponent as SortIcon } from "app/modules/home-module/assets/sort-fill.svg";
import { ReactComponent as GridIcon } from "app/modules/home-module/assets/grid-fill.svg";
import { ReactComponent as FilterIcon } from "app/modules/home-module/assets/filter-fill.svg";
import { ReactComponent as CloseIcon } from "app/modules/home-module/assets/close-icon.svg";
import { ReactComponent as SearchIcon } from "app/modules/home-module/assets/search-fill.svg";
import { ReactComponent as TableIcon } from "app/modules/home-module/assets/table-icon.svg";
import { ReactComponent as MenuIcon } from "app/modules/home-module/assets/menu.svg";
import AddAssetDropdown from "app/modules/home-module/components/AddAssetDropdown";
import { MultiSwitch } from "app/modules/home-module/components/TabSwitch";
import { useOnClickOutside } from "usehooks-ts";

const CustomGridIcon = ({ isActive }: { isActive?: boolean }) => (
  <Tooltip title="List View" placement="bottom">
    <GridIcon
      css={`
        path {
          fill: ${isActive ? "#fff" : "#231d2c"};
        }
      `}
    />
  </Tooltip>
);

const CustomTableIcon = ({ isActive }: { isActive?: boolean }) => (
  <Tooltip title="Table View" placement="bottom">
    <TableIcon
      css={`
        g {
          path {
            fill: ${isActive ? "#fff" : "#231d2c"};
          }
        }
      `}
    />
  </Tooltip>
);

export default function Filter(
  props: Readonly<{
    searchValue?: string;
    setSearchValue?: (value: string | undefined) => void;
    setSortValue: (value: "updatedDate" | "createdDate" | "name") => void;
    sortValue: string;
    setFilterValue?: (value: "allAssets" | "myAssets") => void;
    filterValue?: string;
    setAssetsView: (value: "grid" | "table") => void;
    assetsView: "table" | "grid";
    terminateSearch?: () => void;
    searchInputWidth?: string;
    openSearch?: boolean;
    setOpenSearch?: React.Dispatch<React.SetStateAction<boolean>>;
    searchIconCypressId: string;
    hasSearch: boolean;
    onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  }>
) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [displayIcons, setDisplayIcons] = React.useState(true);
  const [sortPopoverAnchorEl, setSortPopoverAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  const [filterPopoverAnchorEl, setFilterPopoverAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  useOnClickOutside(inputRef, () => {
    props.setSearchValue?.("");
    props.terminateSearch && props.terminateSearch();
    props.setOpenSearch?.(false);
  });
  const handleCloseSortPopover = () => {
    setSortPopoverAnchorEl(null);
  };
  const openSortPopover = Boolean(sortPopoverAnchorEl);
  const handleCloseFilterPopover = () => {
    setFilterPopoverAnchorEl(null);
  };

  const openFilterPopover = Boolean(filterPopoverAnchorEl);
  const sortOptions = [
    { label: "Last updated", value: "updatedDate" },
    { label: "Created date", value: "createdDate" },
    { label: "Name", value: "name" },
  ];

  const filterOptions = [
    { label: "All Assets", value: "allAssets" },
    { label: "My Assets", value: "myAssets" },
  ];
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.terminateSearch && props.terminateSearch();
    props.setSearchValue?.(e.target.value);
  };
  const handleIconsDisplay = () => {
    setDisplayIcons(!displayIcons);
  };
  const handleTabSwitch = (tab: string) => {
    props.setAssetsView(tab as "grid" | "table");
  };

  return (
    <div
      css={`
        ${rowFlexCss}
        justify-content: flex-start;
        flex-direction: row-reverse;
        gap: 8px;
        width: 100%;
      `}
    >
      <div
        css={`
          ${rowFlexCss}
          justify-content: flex-end;
          gap: 8px;
          width: 100%;
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
          `}
        >
          <div css={searchInputCss(!!props.openSearch)}>
            <SearchIcon />
            <input
              type="text"
              ref={inputRef}
              value={props.searchValue}
              placeholder="Search"
              onChange={handleSearch}
              onKeyPress={props.onKeyPress}
              data-cy="filter-search-input"
              aria-label="search"
              name="search"
              autoComplete="search"
            />
          </div>{" "}
          {props.hasSearch && !props.openSearch && (
            <Tooltip title="Search" placement="bottom">
              <button
                data-cy={props.searchIconCypressId}
                onClick={() => {
                  props.setOpenSearch?.(true);
                  inputRef.current?.focus();
                }}
                css={`
                  ${iconButtonCss(props.openSearch)}
                `}
                aria-label="search-button"
              >
                <SearchIcon />
              </button>
            </Tooltip>
          )}
        </div>
        <div
          css={`
            height: 40px;
            width: 100px;
            svg {
            }
          `}
        >
          <MultiSwitch
            activeTab={props.assetsView}
            onTabChange={handleTabSwitch}
            style={{
              radius: 10,
              paddingX: 4,
              backgroundActive: "#6061E5",
            }}
            tabs={[
              {
                value: "grid",
                label: CustomGridIcon({
                  isActive: props.assetsView === "grid",
                }),
              },
              {
                value: "table",
                label: CustomTableIcon({
                  isActive: props.assetsView === "table",
                }),
              },
            ]}
          />
        </div>

        {props.filterValue && (
          <>
            {" "}
            <Tooltip title="Filter" placement="bottom">
              <button
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  setFilterPopoverAnchorEl(
                    filterPopoverAnchorEl ? null : event.currentTarget
                  );
                }}
                css={iconButtonCss(openFilterPopover)}
                aria-label="filter-button"
              >
                <FilterIcon />
              </button>
            </Tooltip>
            <Popover
              open={openFilterPopover}
              anchorEl={filterPopoverAnchorEl}
              onClose={handleCloseFilterPopover}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              css={`
                .MuiPaper-root {
                  border-radius: 16px;
                }
              `}
            >
              <div
                css={`
                  color: #fff;
                  font-size: 12px;
                  padding: 8px 22px;
                  background: #231d2c;
                  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                `}
              >
                Filter
              </div>
              {filterOptions.map((option) => (
                <div
                  key={option.label}
                  css={sortByItemCss(props.filterValue === option.value)}
                  onClick={() => {
                    props.terminateSearch && props.terminateSearch();
                    props.setFilterValue?.(
                      option.value as "allAssets" | "myAssets"
                    );
                    handleCloseSortPopover();
                  }}
                >
                  {option.label}
                </div>
              ))}
            </Popover>
          </>
        )}

        <Tooltip title="Sort By" placement="bottom">
          <button
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              setSortPopoverAnchorEl(
                sortPopoverAnchorEl ? null : event.currentTarget
              );
            }}
            css={iconButtonCss(openSortPopover)}
            aria-label="sort-button"
          >
            <SortIcon />
          </button>
        </Tooltip>
        <Popover
          open={openSortPopover}
          anchorEl={sortPopoverAnchorEl}
          onClose={handleCloseSortPopover}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          css={`
            .MuiPaper-root {
              border-radius: 16px;
            }
          `}
        >
          <div
            css={`
              color: #fff;
              font-size: 12px;
              padding: 8px 22px;
              background: #231d2c;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            `}
          >
            Sort by
          </div>
          {sortOptions.map((option) => (
            <div
              key={option.label}
              css={sortByItemCss(props.sortValue === option.value)}
              onClick={() => {
                props.terminateSearch && props.terminateSearch();
                props.setSortValue(
                  option.value as "name" | "createdDate" | "updatedDate"
                );
                handleCloseSortPopover();
              }}
            >
              {option.label}
            </div>
          ))}
        </Popover>
        <AddAssetDropdown />
        <div
          css={`
            display: flex;
            flex-shrink: 0;
            width: 40px;
            height: 40px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 10px;
            background: #f1f3f5;
          `}
        >
          <MenuIcon />
        </div>
      </div>
    </div>
  );
}
