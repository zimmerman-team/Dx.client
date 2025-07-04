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
        d="M37.092 12.4084V42H42.0001V12.4084H37.092ZM23.5001 42H28.4083V6H23.5001V42ZM10.0001 42H14.8164V18.8168H10.0001V42Z"
        fill="#231D2C"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M42.0001 42V12.4084H37.092V19.8063H32.1059V42H42.0001ZM33.1059 41H36.092V20.8063H33.1059V41ZM38.2256 41H41.0001V13.4084H38.092V18.8063H38.2256V41ZM18.5529 15V42H28.4083V6H23.5001V41L23.5 15H18.5529ZM22.5 16H19.5529V41H22.5001L22.5 16ZM24.5001 41H27.4083V7H24.5001V41ZM9.98569 42V24.6126H5V42H9.98569ZM8.98569 41H6V25.6126H8.98569V41ZM10.0001 42H14.8164V18.8168H10.0001V42ZM11.0001 19.8168V41H13.8164V19.8168H11.0001Z"
        fill="#231D2C"
      />
    </svg>
  );
};

export default Icon;
