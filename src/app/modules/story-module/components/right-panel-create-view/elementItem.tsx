import React from "react";
import { useInfinityScroll } from "@app/hooks/useInfinityScroll";
import { useSearchMediaSources } from "@app/hooks/useSearchMediaSources";
import { useDrag } from "react-dnd";
import { useRecoilState } from "recoil";
import { isDividerOrRowFrameDraggingAtom } from "@app/state/recoil/atoms";
import { StoryElementsType } from ".";
import {
  Menu,
  MenuItem,
  MenuProps,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import { elementItemcss } from "@app/modules/story-module/components/right-panel-create-view/style";
import { useDebounce } from "react-use";
import { css } from "styled-components";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import SearchIcon from "@material-ui/icons/Search";
import Skeleton from "@material-ui/lab/Skeleton";
import ImageFrame from "./imageFrame";
import { get } from "lodash";
import VideoFrame from "./videoFrame";
import MuiButton from "@material-ui/core/Button";
import MenuPopover from "./menuPopover";

export const Button = withStyles(() => ({
  root: {
    width: "50%",
    height: "52px",
    fontWeight: 700,
    fontSize: "14px",
    borderRadius: "0px",
    backgroundColor: "#C7CDD1",
    fontFamily: "GothamNarrow-Bold, 'Helvetica Neue', sans-serif",
    "&:first-child": {
      borderRight: "1px solid #f1f3f5",
    },
    "&:hover": {
      backgroundColor: "#70777E",
    },
  },
  label: {
    color: "#fff",
    fontSize: "14px",
    textTransform: "none",
    fontFamily: "GothamNarrow-Book, 'Helvetica Neue', sans-serif",
  },
}))(MuiButton);

export const StyledMenu = withStyles({
  paper: {
    width: 159,
    borderRadius: "10px",
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
    width: "100%",
    fontSize: "14px",
    color: "#231d2c",
    padding: "10px 12px",
    borderBottom: "1px solid #DFE3E6",
    "&:focus-visible": {
      border: "2px solid #00B5D8",
      color: "#fff",
      backgroundColor: "none",
    },
  },
}))(MenuItem);

const videoSources = [
  { value: "youtube", label: "Youtube" },
  { value: "vimeo", label: "Vimeo" },
];

const imageSources = [
  { value: "unsplash", label: "Unsplash" },
  // { value: "shutterstock", label: "Shutterstock" },
];
export default function ElementItem(props: {
  leftIcon: JSX.Element;
  previewImg: string;
  elementType: string;
  name: string;
  disabled?: boolean;
  openTooltip?: boolean;
  setOpenTooltip?: React.Dispatch<React.SetStateAction<boolean>>;
  ItemDetails?: any[];
  setItemDetails?: React.Dispatch<React.SetStateAction<any[]>>;
  index?: number;
  description: string;
  draggable?: boolean;
  upgradeRequired?: boolean;
}) {
  const nullRef = React.useRef(null);

  const [dropDown, setDropDown] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const currentSourceOptions = { image: imageSources, video: videoSources };

  const [source, setSource] = React.useState(
    get(currentSourceOptions, props.elementType, [{}])[0]
  );
  const [inputFocused, setInputFocused] = React.useState(false);

  const { data, loading, search } = useSearchMediaSources(
    source.value,
    props.elementType
  );

  const observerTarget = React.useRef(null);
  const { isObserved } = useInfinityScroll(observerTarget);

  // Pagination on scroll
  React.useEffect(() => {
    if (isObserved && data.length > 0) {
      search(searchValue, true);
    }
  }, [isObserved]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: props.elementType,
    item: {
      type: props.elementType,
      value: "",
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [isItemDragging, setIsItemDragging] = useRecoilState(
    isDividerOrRowFrameDraggingAtom
  );

  React.useEffect(() => {
    if (
      (props.elementType === StoryElementsType.DIVIDER ||
        props.elementType === StoryElementsType.ROWFRAME) &&
      isDragging !== isItemDragging.state
    ) {
      setIsItemDragging({
        state: isDragging,
        rowId: null,
      });
    }
  }, [isDragging]);

  const isImageElement = props.elementType === StoryElementsType.IMAGE;
  const isVideoElement = props.elementType === StoryElementsType.VIDEO;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useDebounce(
    () => {
      search(searchValue);
    },
    1000,
    [searchValue, props.elementType, source]
  );

  return (
    <div
      css={css`
        background: #dfe3e5;
        width: 90%;
        margin: 8px auto;
        border-radius: 8px;
        flex-shrink: 0;
        max-height: 70vh;
      `}
    >
      <Tooltip
        title={"Available soon"}
        placement="bottom-end"
        open={props.openTooltip}
        onClose={() => {
          if (props.ItemDetails && props.index) {
            props.setItemDetails?.((prev) => {
              const tempPrev = prev.map((item) => ({ ...item }));
              tempPrev[props.index as number].openTooltip = false;
              return [...tempPrev];
            });
          }
        }}
        onOpen={() => {
          if (props.disabled && props.ItemDetails && props.index) {
            props.setItemDetails?.((prev) => {
              const tempPrev = prev.map((item) => ({ ...item }));
              tempPrev[props.index as number].openTooltip = true;
              return [...tempPrev];
            });
          }
        }}
      >
        <button
          ref={isImageElement || isVideoElement ? nullRef : drag}
          data-cy={`story-panel-${props.elementType}-item`}
          id={props.name}
          data-testid={props.name}
          css={elementItemcss(
            props.disabled as boolean,
            isDragging,
            props.draggable,
            props.upgradeRequired
          )}
          onClick={() => {
            if (props.disabled || props.upgradeRequired) return;
            setDropDown((prev) => !prev);
          }}
        >
          {props.leftIcon}
          <div>
            <b>{props.name}</b>
            <p>{props.description}</p>
          </div>
          {isImageElement || isVideoElement ? (
            <>
              <div
                css={`
                  position: absolute;
                  top: 20px;
                  right: 10px;
                  transition: transform 150ms ease-out;
                  transform: ${dropDown ? "rotate(180deg)" : "rotate(0deg)"};
                  width: 24px;
                  height: 24px;
                `}
              >
                <ArrowDropDownIcon />
              </div>
            </>
          ) : null}
        </button>
      </Tooltip>

      {isImageElement || isVideoElement ? (
        <div
          css={`
            ${dropDown ? "" : `height: 0px; overflow: hidden;`}
          `}
        >
          <div
            css={`
              padding: 0 8px 0 16px;
              margin-top: 25px;
            `}
          >
            <div
              css={css`
                display: flex;
                background-color: white;
                border-radius: 24px;
                padding-left: 16px;
                padding-right: 8.78px;
                align-items: center;
                ${inputFocused && "border-bottom: 1px solid #6061e5;"}
              `}
            >
              <input
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
                onBlur={() => setInputFocused(false)}
                onFocus={(e) => {
                  setInputFocused(true);
                }}
                data-cy={`search-${props.elementType}-list`}
                css={`
                  outline: none;
                  height: 34px;
                  width: 100%;
                  border: none;
                `}
              />
              <SearchIcon htmlColor="#495057" />
            </div>

            <div
              css={css`
                margin-top: 15px;
                margin-left: auto;
                width: max-content;
              `}
            >
              <MenuPopover
                menuItem={source}
                setMenuItem={setSource}
                label={source.label}
                options={get(currentSourceOptions, props.elementType, [{}])}
                menuId="breadcrumb-menu"
              />
            </div>

            <div
              css={css`
                margin-top: 21px;
                display: grid;
                row-gap: 25.75px;
                max-height: 40vh;
                overflow-y: scroll;
                padding-bottom: 15px;
              `}
            >
              {data?.map((d, i) =>
                props.elementType === "video" ? (
                  <VideoFrame
                    embedUrl={d.embedUrl}
                    videoId={d.videoId}
                    key={d.videoId}
                    snippet={d.snippet}
                    source={d.source}
                    thumbnail={d.thumbnail}
                    title={d.title}
                    description={d.description}
                    ownerThumbnail={d.ownerThumbnail}
                  />
                ) : (
                  <ImageFrame
                    imageUrl={d.imageUrl}
                    imageId={d.imageId}
                    key={d.imageId}
                    thumbnail={d.thumbnail}
                    source={d.source}
                  />
                )
              )}
              {loading
                ? Array(4)
                    .fill(null)
                    .map((_d, index: number) => (
                      <Skeleton
                        animation="wave"
                        variant="rect"
                        width="100%"
                        height="173.25px"
                        key={`${index}-skeleton`}
                      />
                    ))
                : null}
              <div
                css={`
                  height: 1px;
                `}
                ref={observerTarget}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
