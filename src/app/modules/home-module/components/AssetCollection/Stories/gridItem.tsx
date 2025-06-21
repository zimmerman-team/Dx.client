import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import IconButton from "@material-ui/core/IconButton";
import { ReactComponent as MenuIcon } from "app/modules/home-module/assets/menu.svg";
import { ReactComponent as ClockIcon } from "app/modules/home-module/assets/clock-icon.svg";
import { ReactComponent as OwnerIcon } from "app/modules/home-module/assets/owner-icon.svg";
import { EditorState } from "draft-js";
import { useMediaQuery } from "@material-ui/core";
import MenuItems from "app/modules/home-module/components/AssetCollection/Datasets/menuItems";

interface Props {
  date: Date;
  id?: string;
  heading: EditorState;
  name: string;
  color: string;
  viz: JSX.Element;
  handleDelete?: (id: string) => void;
  handleDuplicate?: (id: string) => void;
  showMenuButton?: boolean;
  owner: string;
  ownerName: string;
}

export default function GridItem(props: Readonly<Props>) {
  const [menuOptionsDisplay, setMenuOptionsDisplay] = React.useState(false);
  const showMenuOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOptionsDisplay(!menuOptionsDisplay);
  };

  return (
    <div
      css={`
        position: relative;
      `}
    >
      <Link
        to={`/story/${props.id}`}
        css={`
          width: 100%;
          height: 162px;
          padding: 12px;
          display: flex;
          color: #262c34;
          background: #fff;
          text-decoration: none;
          flex-direction: column;
          border: 1px solid #fff;
          align-items: space-between;
          justify-content: space-between;
          transition: box-shadow 0.2s ease-in-out;
          box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.05);

          &:hover {
            box-shadow: 0px 7px 22px 0px rgba(0, 0, 0, 0.1);
          }
        `}
        data-cy="story-grid-item"
      >
        <div
          css={`
            display: flex;
            align-items: flex-start;
            justify-content: space-between;

            a {
              color: inherit;
              text-decoration: none;
            }
          `}
        >
          <div
            css={`
              width: 80%;
              margin-top: -7px;
            `}
          >
            <p
              title={props.name}
              css={`
                font-size: 14px;
                line-height: 22px;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                margin-top: 2px;

                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-bottom: 0;
              `}
            >
              <b>{props.name}</b>
            </p>
          </div>
          <IconButton
            css={`
              position: absolute;
              right: -2px;
              top: 0px;
              cursor: pointer;

              &:hover {
                background: transparent;
              }
            `}
            aria-label="story-menu-button"
            onClick={showMenuOptions}
            data-cy="story-grid-item-menu-btn"
          >
            <MenuIcon />
          </IconButton>
        </div>
        <div
          css={`
            margin-top: 4px;
            position: absolute;
            bottom: -15px;
            svg {
              width: 119.722px;
              height: 83.717px;
            }
            rect:nth-of-type(5) {
              fill: ${props.color || "#231d2c"};
            }

            ${props.showMenuButton &&
            `
            bottom: -5px;
            transform: scale(0.7);
            transform-origin: left bottom;
          `}
          `}
        >
          {props.viz}
        </div>
      </Link>
      {menuOptionsDisplay && (
        <MenuItems
          handleClose={() => setMenuOptionsDisplay(false)}
          handleDelete={() => props.handleDelete?.(props.id as string)}
          handleDuplicate={() => props.handleDuplicate?.(props.id as string)}
          id={props.id as string}
          owner={props.owner}
          path={`/story/${props.id}/edit`}
          type="story"
        />
      )}
      <div
        css={`
          position: absolute;
          bottom: 12px;
          right: 16px;
          p {
            margin: 0;
            font-size: 10px;
            line-height: normal;
          }
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            gap: 3px;
          `}
        >
          <OwnerIcon />
          <p>{props.ownerName?.split(" ")?.[0]}</p>
        </div>
        <div
          css={`
            display: flex;
            align-items: center;
            gap: 3px;
          `}
        >
          <ClockIcon width={12} height={12} />
          <p>{moment(props.date).format("MMMM YYYY")}</p>
        </div>
      </div>
    </div>
  );
}
