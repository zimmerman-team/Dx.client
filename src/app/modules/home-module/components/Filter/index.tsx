import React from "react";
import { rowFlexCss } from "app/modules/home-module/style";
import { Tooltip } from "@material-ui/core";
import { ReactComponent as GridIcon } from "app/modules/home-module/assets/grid-fill.svg";
import { ReactComponent as TableIcon } from "app/modules/home-module/assets/table-icon.svg";
import { ReactComponent as MenuIcon } from "app/modules/home-module/assets/menu.svg";
import AddAssetDropdown from "app/modules/home-module/components/AddAssetDropdown";
import { MultiSwitch } from "app/modules/home-module/components/TabSwitch";
import { useOnClickOutside } from "usehooks-ts";
import { SearchInput } from "./SearchInput";
import FilterPopover from "./FilterPopover";
import SortPopover from "./SortPopover";

export const CustomGridIcon = ({ isActive }: { isActive?: boolean }) => (
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
    setFilterValue: (
      value: "allAssets" | "myAssets" | "dataxplorerAssets"
    ) => void;
    filterValue: string;
    setAssetsView: (value: "grid" | "table") => void;
    assetsView: "table" | "grid";
    terminateSearch: () => void;
    searchInputWidth?: string;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    openSearch?: boolean;
    setOpenSearch?: React.Dispatch<React.SetStateAction<boolean>>;
    searchIconCypressId: string;
    hasSearchButton: boolean;
    onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  }>
) {
  const inputRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(inputRef, () => {
    props.terminateSearch && props.terminateSearch();
    props.setOpenSearch?.(false);
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.terminateSearch && props.terminateSearch();
    props.setSearchValue?.(e.target.value);
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
        <SearchInput
          searchValue={props.searchValue || ""}
          onSearchChange={handleSearch}
          onFocus={props.onFocus}
          onKeyPress={props.onKeyPress}
          hasSearchButton={props.hasSearchButton}
          openSearch={props.openSearch}
          setOpenSearch={props.setOpenSearch}
          searchIconCypressId={props.searchIconCypressId}
          inputRef={inputRef}
        />
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
            ariaControls={
              props.assetsView === "grid" ? "assets-grid" : "assets-table"
            }
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
                testId: "home-grid-view-button",
              },
              {
                value: "table",
                label: CustomTableIcon({
                  isActive: props.assetsView === "table",
                }),
                testId: "home-table-view-button",
              },
            ]}
          />
        </div>

        {props.filterValue && (
          <>
            {" "}
            <FilterPopover
              setFilterValue={props.setFilterValue}
              filterValue={props.filterValue}
              terminateSearch={props.terminateSearch}
            />
          </>
        )}

        <SortPopover
          setSortValue={props.setSortValue}
          sortValue={props.sortValue}
          terminateSearch={props.terminateSearch}
        />
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
