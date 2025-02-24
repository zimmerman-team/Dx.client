import React from "react";
import CompleteCheckIcon from "app/modules/dataset-module/routes/upload-module/assets/complete-check";

export default function Stepper(
  props: Readonly<{
    tabs: string[];
    activeStep: number;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    index: number;
    tab: string;
    disabled?: boolean;
  }>
) {
  return (
    <div
      css={`
        gap: 8px;
        display: flex;
        align-items: center;
      `}
    >
      {props.index !== 0 && (
        <div
          css={`
            width: 80px;
            border-top: 2px solid
              ${props.index <= props.activeStep ? "#6061e5" : "#868E96"};
          `}
        />
      )}
      <div
        css={`
          position: relative;
        `}
        onClick={() => {
          if (props.disabled) return;
          if (props.activeStep > 0) {
            props.setActiveStep(props.index);
          }
        }}
      >
        {props.index < props.activeStep || props.activeStep === 3 ? (
          <div
            css={`
              width: 32px;
              height: 32px;
            `}
          >
            <CompleteCheckIcon />
          </div>
        ) : (
          <button
            type="button"
            css={`
              outline: none;
              border: none;
              height: 32px;
              width: 32px;
              display: flex;
              cursor: pointer;
              align-items: center;
              border-radius: 50%;
              justify-content: center;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              font-weight: 400;
              font-size: 14px;
              border: 2px solid
                ${props.index <= props.activeStep ? "#6061E5" : "#868E96"};
              background: white;
              color: ${props.index <= props.activeStep ? "#6061E5" : "#868E96"};
              :disabled {
                cursor: not-allowed;
              }
            `}
            disabled={props.disabled}
          >
            0{props.index + 1}
          </button>
        )}
        <p
          css={`
            position: absolute;
            margin: 0;
            left: 0;
            font-size: 14px;
            font-family: ${props.index <= props.activeStep
                ? "GothamNarrow-Bold"
                : "GothamNarrow-Book"},
              "Helvetica Neue", sans-serif;
            color: ${props.index <= props.activeStep ? "#6061E5" : "#868E96"};
            width: max-content;
          `}
        >
          {props.tab}
        </p>
      </div>
    </div>
  );
}
