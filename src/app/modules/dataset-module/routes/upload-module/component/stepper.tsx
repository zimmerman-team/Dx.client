import React from "react";
import { ReactComponent as InProgressIcon } from "app/modules/dataset-module/routes/upload-module/assets/upload-options-icons/in-progress-icon.svg";
import { ReactComponent as IdleIcon } from "app/modules/dataset-module/routes/upload-module/assets/upload-options-icons/idle-icon.svg";
import { ReactComponent as CompletedIcon } from "app/modules/dataset-module/routes/upload-module/assets/upload-options-icons/completed-icon.svg";

export default function Stepper(
  props: Readonly<{
    tabs: { title: string; description: string }[];
    activeStep: number;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    index: number;
    tab: { title: string; description: string };
  }>
) {
  return (
    <div
      css={`
        gap: 8px;
        display: flex;
        flex: 1;
        height: 100%;
        align-items: start;
        padding-right: 16px;
        padding-top: 10px;
        border-top: ${props.activeStep >= props.index
          ? "1px solid #6061E5"
          : "1px solid #DFE3E5"};
        p:first-of-type {
          color: #231d2c;
          font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
          margin: 0;
          line-height: normal;
        }
        p:last-of-type {
          color: #525252;
          font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
          font-size: 14px;
          margin: 0;
          margin-top: 2px;
          line-height: normal;
        }
      `}
    >
      <span>
        {props.activeStep === props.index ? (
          <InProgressIcon />
        ) : props.activeStep > props.index ? (
          <CompletedIcon />
        ) : (
          <IdleIcon />
        )}
      </span>
      <div>
        <p>{props.tab.title}</p>
        <p>{props.tab.description}</p>
      </div>
    </div>
  );
}
