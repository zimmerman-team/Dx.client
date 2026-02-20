import { homeDisplayAtom } from "@app/state/recoil/atoms";
import React from "react";
import SwipeableViews from "react-swipeable-views";
import { useRecoilState } from "recoil";
import AddAssetDropdown from "@app/modules/home-module/components/AddAssetDropdown";
import {
  SearchInput,
  SearchInputProps,
} from "@app/modules/home-module/components/Filter/SearchInput";
import MenuIcon from "@app/modules/home-module/assets/menu.svg?react";

import { useOnClickOutside } from "usehooks-ts";
import Popover from "@material-ui/core/Popover";
import ActionsMenu from "./ActionsMenu";

interface AssetsControlsProps {
  datasetCount: number;
  chartCount: number;
  storyCount: number;
  allCount: number;
}

interface MobileControlsProps {
  assetsControlsProps: AssetsControlsProps;
  searchInputProps: SearchInputProps;
  terminateSearch?: () => void;
  setOpenSearch?: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchValue?: (value: string | undefined) => void;
  setSortValue: (value: "updatedDate" | "createdDate" | "name") => void;
  setFilterValue?: (value: "allAssets" | "myAssets") => void;
  setAssetsView: (value: "grid" | "table") => void;
  assetsView: "table" | "grid";
  sortValue: string;
  filterValue?: string;
}
export default function MobileControls(props: MobileControlsProps) {
  const inputContainerRef = React.useRef<HTMLDivElement>(null);
  useOnClickOutside(inputContainerRef, () => {
    props.terminateSearch && props.terminateSearch();
    props.setOpenSearch?.(false);
  });

  const [openActionsMenuPopover, setOpenSortPopover] = React.useState(false);
  const [actionsMenuPopoverAnchorEl, setActionsMenuPopoverAnchorEl] =
    React.useState<HTMLElement | null>(null);

  const handleOpenSortPopover = (event: React.MouseEvent<HTMLElement>) => {
    setActionsMenuPopoverAnchorEl(event.currentTarget);
    setOpenSortPopover(true);
  };

  const handleCloseActionsMenuPopover = () => {
    setActionsMenuPopoverAnchorEl(null);
    setOpenSortPopover(false);
  };
  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        gap: 10px;
      `}
    >
      <AssetsSwitchControls {...props.assetsControlsProps} />
      <div
        css={`
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: flex-end;
          flex-wrap: wrap-reverse;
        `}
        ref={inputContainerRef}
      >
        <SearchInput {...props.searchInputProps} inputRef={inputContainerRef} />
        <AddAssetDropdown />
        <>
          <div
            onClick={handleOpenSortPopover}
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
          <Popover
            open={openActionsMenuPopover}
            anchorEl={actionsMenuPopoverAnchorEl}
            onClose={handleCloseActionsMenuPopover}
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
                border-radius: 12px;
              }
            `}
          >
            <ActionsMenu
              terminateSearch={props.terminateSearch}
              setSortValue={props.setSortValue}
              setFilterValue={props.setFilterValue}
              setAssetsView={props.setAssetsView}
              assetsView={props.assetsView}
              sortValue={props.sortValue}
              filterValue={props.filterValue}
            />
          </Popover>
        </>
      </div>
    </div>
  );
}
type AssetType = "all" | "data" | "charts" | "stories";

const AssetsSwitchControls = (props: AssetsControlsProps) => {
  const [_displayedAsset, setDisplayedAsset] = useRecoilState(homeDisplayAtom);
  const [assetIndex, setAssetIndex] = React.useState(0);

  const getActiveAssetCount = (assetType: AssetType) => {
    switch (assetType) {
      case "all":
        return props.allCount;
      case "data":
        return props.datasetCount;
      case "charts":
        return props.chartCount;
      case "stories":
        return props.storyCount;
      default:
        return 0;
    }
  };

  const assetTypes = [
    {
      type: "all",
      label: "All",
      index: 0,
    },
    {
      type: "data",
      label: "Datasets",
      index: 1,
    },
    {
      type: "charts",
      label: "Charts",
      index: 2,
    },
    {
      type: "stories",
      label: "Stories",
      index: 3,
    },
  ];
  const handleChangeIndex = (index: number, position: "back" | "forward") => {
    if (position === "back") {
      if (index === 0) {
        return;
      } else {
        setDisplayedAsset(assetTypes[index - 1].type as AssetType);
        setAssetIndex(index - 1);
      }
    } else {
      if (index === 3) {
        return;
      } else {
        setDisplayedAsset(assetTypes[index + 1].type as AssetType);
        setAssetIndex(index + 1);
      }
    }
  };
  const handleChange = (
    event: React.ChangeEvent<{}> | null,
    newValue: number
  ) => {
    setDisplayedAsset(assetTypes[newValue].type as AssetType);
  };

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        gap: 10px;
        height: 41px;
        button {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 0.5px solid #6061e5;
          background: #f2f7fd;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          :nth-of-type(1) {
            ${assetIndex === 0 && " border: 0.5px solid #231d2c;"}
          }
          :last-of-type {
            ${assetIndex === assetTypes.length - 1 &&
            " border: 0.5px solid #231d2c;"}
          }
        }
      `}
    >
      <button onClick={() => handleChangeIndex(assetIndex, "back")}>
        <svg
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5 15.3887L7.5 10.3887L12.5 5.38867"
            stroke="black"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <SwipeableViews
        onChangeIndex={(index) => handleChange(null, index)}
        index={assetIndex}
        animateTransitions={true}
        style={{
          height: "100%",
          flex: 1,
        }}
      >
        {assetTypes.map((asset) => (
          <div
            css={`
              background: #6061e5;
              display: flex;
              flex: 1;
              border-radius: 10px;
              align-items: center;
              padding-left: 16px;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              color: #fff;
              height: 41px;
            `}
            key={asset.type}
            onClick={() => setDisplayedAsset(asset.type as AssetType)}
          >
            {`${asset.label} (${getActiveAssetCount(asset.type as AssetType)})`}
          </div>
        ))}
      </SwipeableViews>
      <button onClick={() => handleChangeIndex(assetIndex, "forward")}>
        <svg
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.5 15.3887L12.5 10.3887L7.5 5.38867"
            stroke="black"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};
