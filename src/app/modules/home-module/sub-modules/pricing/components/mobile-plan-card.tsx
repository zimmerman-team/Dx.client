/* eslint-disable sonarjs/no-duplicate-string */
/* eslint no-use-before-define: 0 */
import React from "react";
import GoodIcon from "@app/modules/home-module/sub-modules/pricing/assets/good-icon";
import { Plan } from "./plan-card";
import { features } from "./data";
import InfoIcon from "app/modules/home-module/sub-modules/pricing/assets/info-icon";
import { Tooltip } from "react-tooltip";
import { MOBILE_BREAKPOINT } from "@app/theme";

interface MobilePlanCardProps {
  plans: Plan[];
  subscriptionPlan: string;
  onButtonClick: (key: string) => void;
  activeView: string;
}

export default function MobilePlanCard(props: MobilePlanCardProps) {
  // eslint-disable-next-line sonarjs/cognitive-complexity
  const renderSingleValue = (option: any, planIndex: number) => {
    const value = option.values[planIndex];
    const beta = option.beta;
    const betaContent = () => {
      if (planIndex === 0 && value !== "available") {
        const betaItem = beta === "available" ? null : beta;

        return (
          <p
            css={`
              display: flex;
              align-items: center;
              gap: 5px;
            `}
          >
            <span>
              :{" "}
              {value ? (
                <span
                  css={`
                    text-decoration: line-through;
                  `}
                >
                  {value}
                </span>
              ) : null}{" "}
              {betaItem}
            </span>
            <span
              css={`
                border-radius: 16px;
                padding: 2px 4px;
                border: 0.5px solid #a1aebd;
                display: block;
                width: max-content;
                font-style: italic;
                font-size: 12px;
                line-height: normal;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              `}
            >
              Only During Beta
            </span>
          </p>
        );
      }
    };

    return (
      <p
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <span
          css={`
            display: flex;
            align-items: center;
            gap: 6.5px;
            ${value === "coming" ? "font-style: italic;" : ""}
          `}
        >
          {value === "coming" ? null : <GoodIcon />} {option.name}
        </span>
        <span aria-hidden="true">
          {value === "coming" ? (
            <span
              css={`
                font-size: 14px;
                font-style: italic;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                line-height: 20px;
                color: #868e96;
              `}
            >
              (Coming Soon!)
            </span>
          ) : value === "available" ? null : value === false ? (
            "-"
          ) : beta ? (
            betaContent()
          ) : (
            `: ${value}`
          )}
        </span>
      </p>
    );
  };
  return (
    <>
      {/* eslint-disable-next-line sonarjs/cognitive-complexity */}
      {props.plans.map((plan, planIndex) => {
        let buttonText = plan.key === "free" ? "Activate" : "Activate trial";
        if (plan.current) {
          buttonText = "Current plan";
        } else if (!plan.available) {
          buttonText = "Coming soon";
        } else if (plan.key === "enterprise") {
          buttonText = "Contact Sales";
        }

        return (
          <div
            key={plan.key}
            css={`
              box-shadow: 0px 0px 10px 0px #00000026;
              border-radius: 20px;
              background: ${plan.recommended ? "#6061E5" : "#fff"};
              padding: 20px;
              margin-bottom: 40px;
              p {
                margin: 0;
                color: ${plan.recommended ? "#fff" : "#252c34"};
              }
            `}
          >
            <div
              css={`
                position: relative;
              `}
            >
              <div
                css={`
                  > p:nth-of-type(1) {
                    font-family: "GothamNarrow-Bold", "Helvetica Neue",
                      sans-serif;
                    font-size: 24px;
                    line-height: "normal";
                  }

                  > p:nth-of-type(3) {
                    margin-top: ${plan.key === "enterprise" ||
                    plan.key === "free"
                      ? "0px"
                      : "10px"};
                    font-family: "GothamNarrow-Book", "Helvetica Neue",
                      sans-serif;
                    font-size: 14px;
                    white-space: pre-line;
                  }
                `}
              >
                <p>{plan.name}</p>
                {["free", "enterprise"].includes(plan.key) || plan.available ? (
                  <p
                    css={`
                      margin: 0;
                      padding: 0;
                      margin-top: 4.3px;
                      font-size: 40px;
                      font-weight: 400;
                      line-height: normal;
                      font-family: "GothamNarrow-Bold", "Helvetica Neue",
                        sans-serif;
                      @media (max-width: 1300px) {
                        font-size: 32px;
                      }
                    `}
                  >
                    {props.activeView === "monthly"
                      ? plan.monthlyPrice
                      : plan.yearlyPrice}
                  </p>
                ) : null}
                {["free", "enterprise"].includes(plan.key) ? (
                  plan.key === "free" ? (
                    <div
                      css={`
                        height: 10px;
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
                        padding-top: 10px;
                        font-family: "GothamNarrow-Book", "Helvetica Neue",
                          sans-serif;
                        @media (max-width: 1300px) {
                          font-size: 12px;
                        }
                      `}
                    >
                      per {props.activeView === "monthly" ? "month" : "year"}
                    </p>
                  )
                ) : plan.available ? null : (
                  <p
                    css={`
                      margin: 0;
                      padding: 0;
                      color: #98a1aa !important;
                      line-height: normal;
                      font-family: "GothamNarrow-Bold", "Helvetica Neue",
                        sans-serif;
                      font-size: 40px;
                    `}
                  >
                    Coming Soon
                  </p>
                )}

                <p>{plan.text}</p>
              </div>
              {plan.recommended && (
                <button
                  css={`
                    border-radius: 30px;
                    background: var(--Secondary-White-1, #fff);
                    border: none;
                    outline: none;
                    color: #6061e5;
                    font-family: "GothamNarrow-Bold", "Helvetica Neue",
                      sans-serif;
                    font-size: 10px;
                    text-transform: uppercase;
                    width: 88px;
                    height: 13.568px;
                    position: absolute;
                    right: 0px;
                    top: 0px;
                  `}
                >
                  Recommended
                </button>
              )}
            </div>

            <button
              css={`
                margin-top: 40px;
                margin-bottom: 30px;
                border-radius: 12px;
                width: 100%;
                outline: none;
                background: transparent;
                color: #231d2c;
                border: 1px solid #231d2c;
                ${plan.current &&
                "background:#231D2C; color: #ffffff;  border: none;"}
                ${plan.recommended &&
                "background: #33347B; color: #F5F5F7;  border: none;"}
                height: 41px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                font-size: 16px;
                :disabled {
                  border: 1px solid transparent;
                  color: #70777e;
                  background: #dfe3e5;
                  cursor: not-allowed;
                  ${plan.current &&
                  `
                    background:#231D2C; 
                    color: #ffffff;  
                    border: none;
              `}
                }
              `}
              disabled={plan.current || !plan.available}
              onClick={() => props.onButtonClick(plan.key)}
            >
              {buttonText}
            </button>
            <div>
              <p
                css={`
                  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                `}
              >
                Includes:
              </p>

              <div
                css={`
                  display: flex;
                  flex-direction: column;
                  row-gap: 18px;
                `}
              >
                {features.map((feature, idx) => {
                  if (
                    feature.options.every(
                      (option) => option.values[planIndex] === ""
                    )
                  ) {
                    return null;
                  }
                  return (
                    <div key={feature.title}>
                      <div
                        css={`
                          display: flex;
                          align-items: center;
                          column-gap: 6px;
                          svg {
                            path {
                              fill: ${plan.recommended ? "#fff" : "#6061E5"};
                            }
                          }
                        `}
                      >
                        <feature.icon />
                        <p
                          css={`
                            margin: 0;
                            padding: 0;
                            font-weight: 400;
                            line-height: normal;
                            font-family: "GothamNarrow-Bold", "Helvetica Neue",
                              sans-serif;
                            font-size: 18px;
                          `}
                        >
                          {feature.title}
                        </p>
                      </div>
                      <p
                        css={`
                          margin: 0;
                          padding: 0;
                          color: #787f88;
                          font-family: "GothamNarrow-Book", "Helvetica Neue",
                            sans-serif;
                          font-size: 14px;
                          font-style: normal;
                          font-weight: 325;
                          white-space: pre-line;
                          line-height: 20px;
                          margin-top: 4px;
                        `}
                      >
                        {feature.subtitle}
                      </p>
                      <div
                        css={`
                          margin-top: 18px;
                          display: grid;
                          ${planIndex === 0
                            ? "grid-template-columns: repeat(1, 1fr);"
                            : "grid-template-columns: repeat(2, 1fr);"}
                          @media (max-width: ${MOBILE_BREAKPOINT}) {
                            grid-template-columns: repeat(1, 1fr);
                          }
                        `}
                      >
                        {feature.options.map(
                          (option: any, optionIndex: number) => {
                            if (
                              !(option as any).beta &&
                              option.values[planIndex] === ""
                            ) {
                              return null;
                            }
                            return (
                              <div
                                key={option.name}
                                css={`
                                  svg {
                                    display: flex;
                                    flex-shrink: 0;
                                    path {
                                      fill: ${plan.recommended
                                        ? "#fff"
                                        : "#6061E5"};
                                    }
                                    /* margin-top: 2.5px; */
                                  }
                                `}
                              >
                                <p
                                  css={`
                                    display: flex;
                                    align-items: center;
                                    gap: 5px;
                                  `}
                                >
                                  {renderSingleValue(option, planIndex)}{" "}
                                  <button
                                    css={`
                                      all: unset;
                                      flex-shrink: 0;
                                      cursor: pointer;
                                      svg {
                                        display: flex;
                                        flex-shrink: 0;
                                        margin-top: 0px;
                                        path {
                                          fill: ${plan.recommended
                                            ? "#fff"
                                            : "#231D2C"};
                                        }
                                      }
                                    `}
                                    className={`feature-${idx}-option-${optionIndex}`}
                                  >
                                    <InfoIcon />
                                  </button>
                                  <Tooltip
                                    anchorSelect={`.feature-${idx}-option-${optionIndex}`}
                                    place="right"
                                    css={`
                                      opacity: 1 !important;
                                    `}
                                    style={{
                                      backgroundColor: "#231D2C",
                                      borderRadius: "8px",
                                      color: "#fff",
                                      fontSize: "12px",
                                      fontFamily: "GothamNarrow-Medium",
                                      maxWidth: "320px",
                                      lineHeight: "16px",
                                      zIndex: "1",
                                      padding: "12px",
                                    }}
                                  >
                                    {option.info}
                                  </Tooltip>
                                </p>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* <div>
                <div>
                  {firstHalf.map((offer) => (
                    <p key={offer}>
                      <GoodIcon /> {offer}
                    </p>
                  ))}
                </div>
                <div>
                  {plan.offers
                    .slice(firstHalf.length, plan.offers.length)
                    .map((offer) => (
                      <p key={offer}>
                        <GoodIcon /> {offer}
                      </p>
                    ))}
                </div>
              </div> */}
            </div>
          </div>
        );
      })}
    </>
  );
}
