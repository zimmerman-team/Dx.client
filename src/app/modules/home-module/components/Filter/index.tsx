import React from "react";
import {
  iconButtonCss,
  rowFlexCss,
  searchInputCss,
} from "app/modules/home-module/style";
import { IconButton, Tooltip } from "@material-ui/core";
import { ReactComponent as GridIcon } from "app/modules/home-module/assets/grid-fill.svg";
import { ReactComponent as CloseIcon } from "app/modules/home-module/assets/close-icon.svg";
import { ReactComponent as SearchIcon } from "app/modules/home-module/assets/search-fill.svg";
import { ReactComponent as TableIcon } from "app/modules/home-module/assets/table-icon.svg";
import { FOCUS_VISIBLE_STYLE_LIGHT } from "app/theme";
import FilterPopover from "./FilterPopover";
import SortPopover from "./SortPopover";

export default function Filter(
  props: Readonly<{
    searchValue?: string;
    setSearchValue?: (value: React.SetStateAction<string | undefined>) => void;
    setSortValue: (value: "updatedDate" | "createdDate" | "name") => void;
    sortValue: string;
    setFilterValue?: (
      value: "allAssets" | "myAssets" | "dataxplorerAssets"
    ) => void;
    filterValue?: string;
    setAssetsView: (value: "grid" | "table") => void;
    assetsView: "table" | "grid";
    terminateSearch?: () => void;
    searchInputWidth?: string;
    openSearch?: boolean;
    setOpenSearch?: React.Dispatch<React.SetStateAction<boolean>>;
    searchIconCypressId: string;
    hasSearch: boolean;
  }>
) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [displayIcons, setDisplayIcons] = React.useState(true);
  const [sortPopoverAnchorEl, setSortPopoverAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  const [filterPopoverAnchorEl, setFilterPopoverAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.terminateSearch && props.terminateSearch();
    props.setSearchValue?.(e.target.value);
  };
  const handleIconsDisplay = () => {
    setDisplayIcons(!displayIcons);
  };

  return (
    <div
      css={`
        ${rowFlexCss}
        justify-content: flex-start;
        flex-direction: row-reverse;
        gap: 8px;
      `}
    >
      <div
        css={`
          ${rowFlexCss}
          justify-content: flex-end;
          gap: 8px;
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            gap: 8px;
          `}
        >
          <div css={searchInputCss(!!props.openSearch, props.searchInputWidth)}>
            <input
              type="text"
              ref={inputRef}
              value={props.searchValue}
              placeholder="eg. Kenya"
              onChange={handleSearch}
              data-cy="filter-search-input"
              aria-label="search"
              name="search"
              autoComplete="search"
              aria-hidden={!props.openSearch}
              tabIndex={props.openSearch ? 0 : -1}
            />

            <IconButton
              aria-hidden={!props.openSearch}
              tabIndex={props.openSearch ? 0 : -1}
              onClick={() => {
                props.setSearchValue?.("");
                props.terminateSearch && props.terminateSearch();
                props.setOpenSearch?.(false);
              }}
              aria-label="close-search"
              css={`
                &:hover {
                  background: transparent;
                }
              `}
            >
              <CloseIcon
                css={`
                  margin-top: 1px;
                `}
              />
            </IconButton>
          </div>{" "}
          {props.hasSearch && (
            <Tooltip title="Search" placement="bottom">
              <IconButton
                data-cy={props.searchIconCypressId}
                onClick={() => {
                  props.setOpenSearch?.(true);
                  inputRef.current?.focus();
                }}
                css={iconButtonCss(props.openSearch)}
                aria-label="search-button"
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
        {props.filterValue && (
          <FilterPopover
            setFilterValue={props.setFilterValue!}
            filterValue={props.filterValue}
            terminateSearch={props.terminateSearch!}
          />
        )}

        <SortPopover
          setSortValue={props.setSortValue}
          sortValue={props.sortValue}
          terminateSearch={props.terminateSearch!}
        />
        <Tooltip title="Card/List View" placement="bottom">
          <IconButton
            data-cy="home-table-view-button"
            onClick={() => {
              props.setAssetsView(
                props.assetsView === "table" ? "grid" : "table"
              );
            }}
            css={`
              padding: 3px;
              :focus-visible {
                ${FOCUS_VISIBLE_STYLE_LIGHT}
              }
              &:hover {
                background: transparent;
                padding: none;

                svg > circle,
                rect {
                  fill: #231d2c;
                }
                svg > path,
                svg > g > path,
                svg > g > rect {
                  fill: #fff;
                }
              }
            `}
            aria-label={`${
              props.assetsView === "table" ? "grid" : "table"
            }-view-button`}
          >
            {props.assetsView === "table" ? <TableIcon /> : <GridIcon />}
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}
