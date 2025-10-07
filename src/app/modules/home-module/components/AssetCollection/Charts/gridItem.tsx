import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { ReactComponent as ClockIcon } from "app/modules/home-module/assets/clock-icon.svg";
import { ReactComponent as OwnerIcon } from "app/modules/home-module/assets/owner-icon.svg";
import MenuPopover from "app/modules/home-module/components/AssetCollection/All/menuPopover";
import AIIcon from "app/assets/icons/AIIcon";
import { useAuth0 } from "@auth0/auth0-react";
import { FOCUS_VISIBLE_STYLE_LIGHT } from "app/theme";
import Logo from "app/assets/icons/Logo";

interface Props {
  id: string;
  title: string;
  date: string;
  vizType: string;
  viz: React.ReactNode;
  isMappingValid: boolean;
  handleDelete?: (id: string) => void;
  handleDuplicate?: (id: string) => void;
  owner: string;
  isAIAssisted: boolean;
  ownerName: string;
}

export default function GridItem(props: Props) {
  const { isAuthenticated } = useAuth0();

  return (
    <div
      css={`
        position: relative;
      `}
    >
      <Link
        to={`/chart/${props.id}`}
        title={props.title}
        css={`
          width: 100%;
          height: 162px;
          display: flex;
          color: #262c34;
          background: #fff;
          position: relative;
          text-decoration: none;
          flex-direction: column;
          border: 1px solid #fff;
          transition: box-shadow 0.2s ease-in-out;
          padding: 10px;
          box-shadow: 0px 1px 14px 0px rgba(0, 0, 0, 0.12);
          border-radius: 10px;

          &:hover {
            box-shadow: 0px 7px 22px 0px rgba(0, 0, 0, 0.1);
          }
          &:focus-visible {
            ${FOCUS_VISIBLE_STYLE_LIGHT}
          }
        `}
        data-cy={`chart-grid-item`}
        aria-label={`chart-card`}
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
          <div
            css={`
              display: flex;
              align-items: center;
              gap: 5px;
            `}
          >
            <p>chart</p>
            {props.isAIAssisted ? <AIIcon /> : null}
          </div>

          <MenuPopover
            handleDelete={() => props.handleDelete?.(props.id as string)}
            handleDuplicate={() => props.handleDuplicate?.(props.id as string)}
            id={props.id as string}
            owner={props.owner}
            path={
              props.isMappingValid
                ? `/chart/${props.id}/customize`
                : `/chart/${props.id}/mapping`
            }
            type="chart"
            dataCy="chart-grid-item-menu-btn"
            dataTestId="chart-grid-item-menu-btn"
            menuId="chart-grid-item-menu"
          />
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
              width: 96%;
              gap: 6px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            `}
          >
            <p
              css={`
                font-size: 14px;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                margin: 0;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                line-height: normal;
              `}
            >
              {props.title}
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
              display: flex;
              align-items: flex-end;
              svg {
                width: 73px;
                height: 40px;
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
              <OwnerIcon role="presentation" />
              {isAuthenticated ? <p>{props.ownerName}</p> : <Logo />}
            </div>
            <div
              css={`
                display: flex;
                align-items: center;
                gap: 3px;
              `}
            >
              <ClockIcon width={12} height={12} role="presentation" />
              <p>{moment(props.date).format("DD-MM-YYYY")}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
