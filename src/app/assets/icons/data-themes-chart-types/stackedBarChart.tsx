import React from "react";

interface Props {
  big?: boolean;
}

const Icon: React.FC<Props> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.big ? "74" : "48"}
      height={props.big ? "74" : "48"}
      viewBox="0 0 48 48"
      fill="none"
    >
      <path
        d="M33.1837 23.0942V42H43V23.0942H33.1837ZM19.5918 42H29.4082V19H19.5918V42ZM6 42H15.8163V27.1885H6V42Z"
        fill="#231D2C"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.1837 42H43V12H33.1837V42ZM35.1837 14V21.0942H41V14H35.1837ZM41 25.0942H35.1837V26H41V25.0942ZM35.1837 30V40H41V30H35.1837ZM6 42H15.8163V19H6V42ZM8 21V25.1885H13.8163V21H8ZM8 30V40H13.8163V30H8ZM29.4082 6H19.5918V42H29.4082V6ZM27.4082 40V30H21.5918V40H27.4082ZM27.4082 26V21H21.5918V26H27.4082ZM21.5918 17H27.4082V8H21.5918V17Z"
        fill="#231D2C"
      />
    </svg>
  );
};

export default Icon;
