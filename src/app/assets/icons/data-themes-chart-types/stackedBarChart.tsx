import React from "react";

interface Props {
  big?: boolean;
}

const Icon: React.FC<Props> = (props) => {
  return (
    <svg
      width={props.big ? "74" : "48"}
      height={props.big ? "74" : "48"}
      viewBox="0 0 48 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M34.1837 13.262H42V22.3562H34.1837V13.262ZM34.1837 27.262V24.3562H42V27.262H34.1837ZM34.1837 41.262V29.262H42V41.262H34.1837ZM28.4082 18.262H20.5918V7.26196H28.4082V18.262ZM20.5918 20.262H28.4082V27.262H20.5918V20.262ZM20.5918 41.262V29.262H28.4082V41.262H20.5918ZM7 41.262V29.262H14.8163V41.262H7ZM14.8163 26.4504H7V20.262H14.8163V26.4504Z"
        stroke="#231D2C"
        stroke-width="2"
      />
    </svg>
  );
};

export default Icon;
