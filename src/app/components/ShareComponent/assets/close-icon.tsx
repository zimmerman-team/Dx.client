import React from "react";

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="20"
      viewBox="0 0 19 20"
      fill="none"
      {...props}
    >
      <path
        d="M5.06732 15.5413L3.95898 14.433L8.39232 9.99967L3.95898 5.56634L5.06732 4.45801L9.50065 8.89134L13.934 4.45801L15.0423 5.56634L10.609 9.99967L15.0423 14.433L13.934 15.5413L9.50065 11.108L5.06732 15.5413Z"
        fill="#70777E"
      />
    </svg>
  );
};

export default CloseIcon;
