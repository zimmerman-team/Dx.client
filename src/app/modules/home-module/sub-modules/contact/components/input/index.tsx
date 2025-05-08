import React from "react";

const InputField: React.FC<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & { label?: string }
> = (props) => {
  return (
    <div
      css={`
        width: 100%;
      `}
    >
      <label
        htmlFor={props.id}
        css={`
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          span {
            font-style: normal;
            font-weight: 325;
            font-family: "GothamNarrow-Book", sans-serif;
          }
        `}
      >
        <span
          css={`
            font-size: 16px;
            line-height: normal;
            color: #231d2c;
          `}
        >
          {props.label}
          {props.required ? "*" : ""}
        </span>
        <span
          css={`
            font-size: 14px;
            color: #525252;
          `}
        >
          {props?.value?.toString()?.length ?? 0}/{props.maxLength ?? 0}
        </span>
      </label>
      <input
        type="text"
        css={`
          padding: 15px 16px;
          border: none;
          outline: none;
          border-radius: 10px;
          width: 100%;
          font-size: 16px;
          font-style: normal;
          font-weight: 325;
          font-family: "GothamNarrow-Book", sans-serif;
          border-bottom: 1px solid #6061e5;
          background: #ffffff;
          ::placeholder {
            color: #98a1aa;
          }
        `}
        {...props}
      />
    </div>
  );
};

export default InputField;

export const TextField: React.FC<
  React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > & { label?: string }
> = (props) => {
  return (
    <div
      css={`
        width: 100%;
      `}
    >
      <label
        htmlFor={props.id}
        css={`
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          span {
            font-style: normal;
            font-weight: 325;
            font-family: "GothamNarrow-Book", sans-serif;
          }
        `}
      >
        <span
          css={`
            font-size: 16px;
            line-height: normal;
            color: #231d2c;
          `}
        >
          {props.label}
          {props.required ? "*" : ""}
        </span>
        <span
          css={`
            font-size: 14px;
            color: #525252;
          `}
        >
          {props?.value?.toString()?.length ?? 0}/{props.maxLength ?? 0}
        </span>
      </label>
      <textarea
        css={`
          padding: 16px;
          height: 156px;
          border: none;
          outline: none;
          border-radius: 10px;
          width: 100%;
          font-size: 16px;
          font-style: normal;
          font-weight: 325;
          font-family: "GothamNarrow-Book", sans-serif;
          border-bottom: 1px solid #6061e5;
          background: #ffffff;
          ::placeholder {
            color: #98a1aa;
          }
        `}
        {...props}
      />
    </div>
  );
};
