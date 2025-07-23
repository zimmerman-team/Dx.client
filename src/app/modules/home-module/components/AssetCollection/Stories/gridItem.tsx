import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { ReactComponent as MenuIcon } from "app/modules/home-module/assets/menu.svg";
import { ReactComponent as ClockIcon } from "app/modules/home-module/assets/clock-icon.svg";
import { ReactComponent as OwnerIcon } from "app/modules/home-module/assets/owner-icon.svg";
import { EditorState } from "draft-js";
import MenuItems from "app/modules/home-module/components/AssetCollection/All/menuItems";
import { ReactComponent as Logo } from "app/modules/home-module/assets/logo.svg";

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
  const { isAuthenticated } = useAuth0();

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
          padding: 10px;
          box-shadow: 0px 1px 14px 0px rgba(0, 0, 0, 0.12);
          border-radius: 10px;

          &:hover {
            box-shadow: 0px 7px 22px 0px rgba(0, 0, 0, 0.1);
          }
        `}
        data-cy="story-grid-item"
      >
        <div
          css={`
            display: flex;
            align-items: center;
            height: 20px;
            margin-bottom: 5px;
            p {
              border-radius: 5px;
              background: #ededff;
              box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.05);
              display: flex;
              padding: 0px 6px;
              justify-content: center;
              align-items: center;
              gap: 10px;
              color: #231d2c;
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              font-size: 12px;
              width: fit-content;
              margin: 0;
              height: 20px;
              text-transform: capitalize;
            }
          `}
        >
          <p>Story</p>
          <button
            css={`
              border: none;
              background: ${menuOptionsDisplay ? "#CFD0F4" : "transparent"};
              outline: none;
              display: flex;
              align-items: center;
              justify-content: center;
              position: absolute;
              height: 19px;
              width: 19px;
              border-radius: 5px;
              right: 5px;
              top: 12px;
              cursor: pointer;

              svg {
                flex-shrink: 0;
              }
              &:hover {
                background: transparent;
              }
            `}
            aria-label="story-menu-button"
            onClick={showMenuOptions}
            data-cy="story-grid-item-menu-btn"
          >
            <MenuIcon />
          </button>
        </div>
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
        </div>

        <div
          css={`
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            height: 100%;
            gap: 7px;
            p {
              margin: 0;
              font-size: 10px;
              line-height: normal;
            }
          `}
        >
          <div
            css={`
              svg {
                width: 73px;
                height: 40px;
              }
              rect:nth-of-type(5) {
                fill: ${props.color || "#231d2c"};
              }
            `}
          >
            {props.viz}
          </div>
          <div
            css={`
              display: flex;
              align-items: center;
              gap: 5px;
            `}
          >
            <div
              css={`
                display: flex;
                align-items: center;
                gap: 3px;
                > svg:nth-child(2) {
                  height: 8px;
                  width: 72px;
                }
              `}
            >
              <OwnerIcon />
              {isAuthenticated ? (
                <p>{props.ownerName?.split(" ")?.[0]}</p>
              ) : (
                <Logo />
              )}
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
      </Link>

      <MenuItems
        handleClose={() => setMenuOptionsDisplay(false)}
        handleDelete={() => props.handleDelete?.(props.id as string)}
        handleDuplicate={() => props.handleDuplicate?.(props.id as string)}
        id={props.id as string}
        owner={props.owner}
        path={`/story/${props.id}/edit`}
        type="story"
        display={menuOptionsDisplay}
      />
    </div>
  );
}
