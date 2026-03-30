import { FOCUS_VISIBLE_STYLE_LIGHT } from "@app/theme";
import React from "react";

export interface Plan {
  name: string;
  yearlyPrice: string;
  monthlyPrice: string;
  text: string;
  current: boolean;
  recommended: boolean;
  buttonText: string;
  discount: string;
  key: string;
  available: boolean;
}
interface PlanCardProps {
  activeView: string;
  plan: Plan;
  onButtonClick: (key: string) => void;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function PlanCard({
  activeView,
  plan,
  onButtonClick,
}: PlanCardProps) {
  const centerContent = (
    <>
      <p
        css={`
          margin: 0;
          padding: 0;
          font-size: 16px;
          line-height: 19.2px;
          font-weight: 325;
          font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
          @media (max-width: 1300px) {
            font-size: 12px;
          }
        `}
      >
        per {activeView === "monthly" ? "month" : "year"}
        {plan.key === "team" ? " / per user" : ""}
      </p>
      <p
        css={`
          margin: 0;
          padding: 0;
          margin-top: 15.08px;
          font-size: 14px;
          font-weight: 325;
          font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
          line-height: normal;
          font-style: normal;
          @media (max-width: 1300px) {
            font-size: 12px;
          }
        `}
      >
        Or{" "}
        {activeView === "monthly"
          ? `${plan.yearlyPrice}/year ${plan.discount}`
          : `${plan.monthlyPrice}/month`}
      </p>
    </>
  );

  return (
    <div
      css={`
        width: 224px;
        background: rgba(202, 202, 202, 0.1);
        border-top-right-radius: 20px;
        border-top-left-radius: 20px;
        height: 343px;
        @media (max-width: 1300px) {
          width: 179px;
          height: 267px;
        }
      `}
      data-cy="plan-card"
    >
      <div
        key={plan.name}
        css={`
          width: 100%;
          height: 100%;
          padding: 16px 10px;
          border-radius: 20px;
          background: ${plan.current || plan.recommended
            ? "#6061E5"
            : "#FFFFFF"};
          box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.15);
          color: ${plan.current || plan.recommended ? "#FFFFFF" : "#231D2C"};
          position: relative;
          display: flex;
          flex-direction: column;
          @media (max-width: 1300px) {
            padding: 19px 20px 19.5px 19px;
          }
        `}
      >
        <p
          css={`
            margin: 0;
            padding: 0;
            font-size: 24px;
            font-weight: 400;
            line-height: normal;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            @media (max-width: 1300px) {
              font-size: 16px;
            }
          `}
        >
          {plan.name}
        </p>
        {["free", "enterprise"].includes(plan.key) || plan.available ? (
          <p
            css={`
              margin: 0;
              padding: 0;
              margin-top: 4.3px;
              font-size: 40px;
              font-weight: 400;
              line-height: normal;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              @media (max-width: 1300px) {
                font-size: 32px;
              }
            `}
          >
            {activeView === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
          </p>
        ) : null}
        {["free", "enterprise"].includes(plan.key) ? (
          plan.key === "free" ? (
            <div
              css={`
                height: 13px;
              `}
            />
          ) : (
            <p
              css={`
                margin: 0;
                padding: 0;
                font-size: 16px;
                line-height: 19.2px;
                font-weight: 325;
                padding-top: 3px;
                padding-bottom: 12px;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                @media (max-width: 1300px) {
                  font-size: 12px;
                }
              `}
            >
              per {activeView === "monthly" ? "month" : "year"}
            </p>
          )
        ) : plan.available ? (
          centerContent
        ) : (
          <p
            css={`
              margin: 0;
              padding: 0;
              color: #98a1aa;
              line-height: normal;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              font-size: 40px;
            `}
          >
            Coming Soon
          </p>
        )}

        <p
          css={`
            margin: 0;
            padding: 0;
            margin-top: 3px;
            font-size: 14px;
            font-weight: 325;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            white-space: pre-line;
            line-height: normal;
            @media (max-width: 1300px) {
              font-size: 12px;
            }
          `}
        >
          {plan.text}
        </p>

        <button
          css={`
            border-radius: 12px;
            border: none;
            line-height: normal;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            color: ${plan.current || plan.recommended ? "#231D2C" : "#FFF"};
            background: ${plan.current || plan.recommended
              ? "#F2F7FD"
              : "#6061E5"};
            height: 48px;
            width: 100%;
            margin-top: auto;
            display: block;
            justify-content: center;
            align-items: center;
            &:hover {
              background: ${plan.current ? "#BFC0F1" : "#4849B7"};
              color: ${plan.current ? "#231D2C" : "#fff"};
              cursor: pointer;
              border: none;
            }
            :disabled {
              border: 1px solid transparent;
              color: #70777e;
              background: #dfe3e5;
              cursor: not-allowed;
              ${plan.current &&
              `
              background:#F2F7FD; 
              color: #231D2C;  
              border: none;
              `}
            }
            :focus-visible {
              ${FOCUS_VISIBLE_STYLE_LIGHT}
            }
            @media (max-width: 1300px) {
              width: 77.4%;
            }
          `}
          disabled={plan.current}
          onClick={() => onButtonClick(plan.key)}
          data-cy="plan-button"
        >
          {plan.current
            ? "Current Plan"
            : !plan.available && plan.key !== "enterprise"
            ? "Join Waitlist"
            : plan.buttonText}
        </button>
        {plan.recommended ? (
          <div
            css={`
              color: #6061e5;
              position: absolute;
              font-size: 10px;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              font-weight: 400;
              line-height: normal;
              background: #ffffff;
              border-radius: 30px;
              padding: 1.63px 7.8px 3.33px 8.2px;
              text-transform: uppercase;
              top: 16px;
              right: 10px;
            `}
          >
            recommended{" "}
          </div>
        ) : null}
      </div>
    </div>
  );
}
