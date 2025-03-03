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
        d="M32.6059 41.762V20.5682H36.592V41.762H32.6059ZM41.5001 41.762H37.7256V20.0682V19.5682H37.592V13.1703H41.5001V41.762ZM23.0001 41.762H19.0529V15.762H23L23.0001 41.762ZM27.9083 41.762H24.0001V6.76196H27.9083V41.762ZM14.3164 41.762H10.5001V19.5787H14.3164V41.762ZM9.48569 25.3745V41.762H5.5V25.3745H9.48569Z"
        stroke="#231D2C"
      />
    </svg>
  );
};

export default Icon;
