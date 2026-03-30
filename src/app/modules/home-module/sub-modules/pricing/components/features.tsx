import React from "react";
import GoodIcon from "@app/modules/home-module/sub-modules/pricing/assets/good-icon";
import InfoIcon from "@app/modules/home-module/sub-modules/pricing/assets/info-icon";
import { Tooltip } from "react-tooltip";
import { features } from "./data";

const Features = () => {
  const planMap = {
    1: "Free plan",
    2: "Pro plan",
    3: "Team plan",
    4: "Enterprise plan",
  };

  const renderSingleValue = (value: any, index: number, beta: any) => {
    if (beta && index === 0 && value !== "available") {
      const betaItem = beta === "available" ? <GoodIcon /> : beta;

      return (
        <p css={``}>
          <span>
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
              padding: 2px 12px;
              border: 0.5px solid #a1aebd;
              display: block;
              width: max-content;
              font-style: italic;
              font-size: 12px;
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            `}
          >
            Only During Beta
          </span>
        </p>
      );
    }
    return (
      <p aria-hidden="true">
        {value === ">" || value === "<" ? (
          <span
            css={`
              position: absolute;
              width: 24px;
              height: 100%;
              top: 0;
              ${value === ">" ? "right" : "left"}: -24px;
              background: rgba(202, 202, 202, 0.1);
            `}
          />
        ) : value === "coming" ? (
          <span
            css={`
              font-size: 14px;
              font-style: italic;
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              line-height: 20px;
              color: #868e96;
            `}
          >
            Coming Soon!
          </span>
        ) : value === "available" ? (
          <GoodIcon />
        ) : value === false ? (
          "-"
        ) : (
          value
        )}
      </p>
    );
  };
  const renderFeatureOptions = (
    option: {
      name: string;
      values: any[];
      button?: boolean;
      info?: string;
      beta?: any;
    },
    optionIndex: number,
    idx: number
  ) => (
    <div
      key={option.name}
      css={`
        display: flex;
        justify-content: space-between;
        border-top: 1px solid rgba(223, 227, 229, 0.5);
        :last-of-type {
          border-bottom: 1px solid rgba(223, 227, 229, 0.5);
        }
      `}
    >
      <p
        css={`
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
          padding: 0px 12px;
          line-height: normal;
          font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
          font-size: 14px;
          font-style: normal;
          font-weight: 325;
          white-space: pre-line;
          span {
            border: none;
            background: none;
            outline: none;
            padding: 2px 12px;
            flex-shrink: 0;
            border-radius: 16px;
            border: 0.5px solid #a1aebd;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 10px;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            font-style: italic;
            color: #231d2c;
          }
          button {
            all: unset;
          }
        `}
      >
        {option.name}{" "}
        <button
          css={`
            flex-shrink: 0;
            cursor: pointer;
            svg {
              margin-top: 4px;
            }
          `}
          className={`feature-${idx}-option-${optionIndex}`}
        >
          {option.button ? (
            <span aria-label="coming Soon!">Coming Soon!</span>
          ) : (
            <InfoIcon />
          )}
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

      <div
        css={`
          display: flex;
          column-gap: 24px;
        `}
      >
        {option.values.map((value, index) => (
          <div
            css={`
              margin: 0;
              line-height: normal;
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              font-size: 14px;
              font-style: normal;
              font-weight: 325;
              color: #252c34;
              display: flex;
              justify-content: center;
              background: rgba(202, 202, 202, 0.1);
              width: 224px;
              padding: 9px 0;
              position: relative;
              @media (max-width: 1300px) {
                width: 179px;
              }
              p {
                all: unset;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              }
            `}
            aria-label={
              value + "for the" + planMap[(index + 1) as keyof typeof planMap]
            }
          >
            {renderSingleValue(value, index, option.beta)}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section aria-label="Feature comparison table">
      {features.map((feature, idx) => (
        <>
          <div key={feature.title}>
            <div
              css={`
                display: flex;
                justify-content: space-between;
              `}
            >
              <div
                css={`
                  padding: 5px 10px;
                `}
              >
                <div
                  css={`
                    display: flex;
                    align-items: center;
                    column-gap: 6px;
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
                      font-size: 24px;
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
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 325;
                    white-space: pre-line;
                    line-height: normal;
                    margin-top: 8px;
                  `}
                >
                  {feature.subtitle}
                </p>
              </div>

              <div
                css={`
                  display: flex;
                  justify-content: flex-end;
                  column-gap: 24px;
                `}
              >
                {Array(4)
                  .fill(null)
                  .map((_, index) => (
                    <div
                      css={`
                        background: rgba(202, 202, 202, 0.1);
                        width: 224px;
                        height: 100%;
                        @media (max-width: 1300px) {
                          width: 179px;
                        }
                      `}
                    />
                  ))}
              </div>
            </div>
            <div
              css={`
                border-left: 4px solid ${feature.color};
              `}
            >
              {feature.options.map((option, optionIndex) =>
                renderFeatureOptions(option, optionIndex, idx)
              )}
            </div>
          </div>

          <div
            css={`
              display: flex;
              justify-content: flex-end;
              height: ${idx === features.length - 1 ? "16px" : "24px"};
              column-gap: 24px;
            `}
          >
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  css={`
                    background: rgba(202, 202, 202, 0.1);
                    width: 224px;
                    height: 100%;
                    ${idx === features.length - 1
                      ? `border-bottom-right-radius: 20px;
                          border-bottom-left-radius: 20px;`
                      : ""}
                    @media (max-width: 1300px) {
                      width: 179px;
                    }
                  `}
                />
              ))}
          </div>
        </>
      ))}
    </section>
  );
};

export default Features;
