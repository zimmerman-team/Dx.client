import React from "react";

const FlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      {...props}
    >
      <path
        d="M4.33319 14.9999C4.33319 14.9999 5.33319 13.9999 8.33319 13.9999C11.3332 13.9999 13.3332 15.9999 16.3332 15.9999C19.3332 15.9999 20.3332 14.9999 20.3332 14.9999V2.99988C20.3332 2.99988 19.3332 3.99988 16.3332 3.99988C13.3332 3.99988 11.3332 1.99988 8.33319 1.99988C5.33319 1.99988 4.33319 2.99988 4.33319 2.99988V14.9999ZM4.33319 14.9999L4.33319 21.9999"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default FlagIcon;
