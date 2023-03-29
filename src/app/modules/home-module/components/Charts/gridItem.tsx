import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import { ReactComponent as MenuIcon } from "../../assets/menu.svg";
import { ReactComponent as DeleteIcon } from "../../assets/delete.svg";
import { ReactComponent as EditIcon } from "../../assets/edit.svg";

interface Props {
  id: number;
  path: string;
  title: string;
  descr: string;
  date: string;
  viz: React.ReactNode;
  handleDelete?: (id: number) => void;
}

export default function GridItem(props: Props) {
  const [menuOptionsDisplay, setMenuOptionsDisplay] = React.useState(false);
  const showMenuOptions = () => {
    setMenuOptionsDisplay(!menuOptionsDisplay);
  };
  return (
    <div
      css={`
        background: #ffffff;
        width: 296px;
        position: relative;
        padding: 0rem 1.2rem;
        padding-bottom: 0.5rem;
        color: #262c34;
        height: 125px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      `}
    >
      <div
        css={`
          display: flex;
          justify-content: space-between;
          align-items: center;
          a {
            text-decoration: none;
            color: inherit;
          }
        `}
      >
        <div
          css={`
            width: 60%;
          `}
        >
          <Link to={`/chart/${props.id}`}>
            <p
              css={`
                font-size: 14px;
                margin-top: 8px;

                margin-bottom: 0;
              `}
            >
              <b>{props.title}</b>
            </p>
          </Link>

          <p
            css={`
              font-size: 10px;
              line-height: 12px;
              margin-top: 1px;
            `}
          >
            {props.descr}
          </p>
        </div>
        <div
          css={`
            path {
              fill: #868a9d;
            }
          `}
        >
          {props.viz}
        </div>
        <MenuIcon
          onClick={showMenuOptions}
          css={`
            margin-top: 13px;
            cursor: pointer;
            align-self: flex-start;
          `}
        />
      </div>
      <div
        css={`
          display: flex;
          font-size: 12px;
          justify-content: space-between;

          > p {
            margin: 0;
          }
        `}
      >
        <p>Creation date</p>
        <p>{moment(props.date).format("DD-MM-YYYY")}</p>
      </div>
      {menuOptionsDisplay ? (
        <div>
          <div
            css={`
              position: fixed;
              height: 100vh;
              width: 100vw;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;

              z-index: 1;
            `}
            onClick={showMenuOptions}
          />
          <div
            css={`
              background: #f4f4f4;
              border-radius: 13px;
              z-index: 2;
              width: 128px;
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 1rem;
              position: absolute;
              right: 3%;
              top: 30%;
              padding: 7px 0;
            `}
          >
            <div>
              <Link to={`/chart/${props.id}/customize`}>
                <EditIcon
                  css={`
                    cursor: pointer;
                    margin-top: 6px;
                    :hover {
                      opacity: 0.5;
                    }
                  `}
                />
              </Link>
            </div>
            <div>
              <IconButton
                css={`
                  padding: 0;
                `}
                onClick={() => props.handleDelete?.(props.id as number)}
              >
                <DeleteIcon
                  css={`
                    cursor: pointer;
                    :hover {
                      opacity: 0.5;
                    }
                  `}
                />
              </IconButton>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
