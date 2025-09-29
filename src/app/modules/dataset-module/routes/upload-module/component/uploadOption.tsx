import React from "react";
import { useHistory } from "react-router-dom";
import { Tooltip } from "react-tooltip";

const UploadOption = (props: {
  name: string;
  type: string;
  formats: string[];
  icon: React.ReactNode;
  disabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  setActiveOption: React.Dispatch<React.SetStateAction<string | null>>;
  connected?: boolean;
  onLogout?: () => void;
  canConnect?: boolean;
  upgradeRequired: boolean;
}) => {
  const [openSettings, setOpenSettings] = React.useState(false);

  const history = useHistory();

  return (
    <div
      data-tooltip-id={
        props.upgradeRequired ? `${props.name.split(" ").join("")}-tooltip` : ""
      }
    >
      <button
        css={`
          border-radius: 10px;
          border: 1px solid #adb5bd;
          background: #fff;
          width: 100%;
          overflow: hidden;
          padding: 0;
          cursor: pointer;
          :disabled {
            cursor: not-allowed;
          }
          position: relative;
        `}
        disabled={props.disabled}
        onClick={(e) => {
          if (props.upgradeRequired) {
            return history.push("/pricing");
          }
          props.setActiveOption(props.name);
          props.onClick(e);
        }}
        data-cy="upload-option-button"
        data-testid={`${props.name}-option`}
      >
        <div
          css={`
            margin: 34px auto;
            width: max-content;
            display: flex;
            gap: 14px;
            align-items: center;
            color: #6b727b;
          `}
        >
          {props.icon}
          <div>
            <p
              css={`
                font-size: 18px;
                font-style: normal;
                font-weight: 400;
                line-height: 20px; /* 111.111% */
                letter-spacing: 0.5px;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                margin: 0;
                padding: 0;
                text-align: left;
              `}
            >
              {props.name}
            </p>
            <p
              css={`
                font-size: 14px;
                font-style: normal;
                font-weight: 325;
                line-height: 20px; /* 111.111% */
                letter-spacing: 0.5px;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                margin: 0;
                padding: 0;
                text-align: left;
              `}
            >
              {props.type}
            </p>
          </div>
        </div>
        {props.upgradeRequired ? (
          <div
            css={`
              background: #f6c445;
              border-radius: 48px;
              color: #856207;
              font-family: "GothamNarrow-Bold", Helvetica, sans-serif;
              font-size: 11px;
              font-style: normal;
              font-weight: 450;
              line-height: normal;
              text-transform: uppercase;
              padding: 8px 16px;
              width: max-content;
              position: absolute;
              right: 8px;
              bottom: 46px;
            `}
          >
            UPGRADE
          </div>
        ) : null}

        <div
          css={`
            padding: 7px 16px;
            background: #f3f5f8;
            border-radius: 0 0 10px 10px;
            border: 1px solid #adb5bd;
            border-bottom: none;

            border-right: none;
            border-left: none;
          `}
        >
          <div
            css={`
              display: flex;
              gap: 8px;
              height: 24px;
              align-items: center;
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              font-size: 14px;
              color: #6b727b;
            `}
          >
            {props.formats.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
        </div>
      </button>

      <Tooltip
        id={`${props.name.split(" ").join("")}-tooltip`}
        place="bottom"
        style={{
          background: "#231D2C",
          borderRadius: "8px",
          color: "#fff",
          fontSize: "12px",
          fontFamily: "GothamNarrow-Medium, 'Helvetica Neue', sans-serif",
          width: "320px",
          lineHeight: "16px",
          zIndex: 2,
        }}
      >
        This feature is available on <b>the Pro Plan and above.</b> Click to
        view pricing options.
      </Tooltip>
    </div>
  );
};

export default UploadOption;
