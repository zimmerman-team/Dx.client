import React from "react";

const CompleteCheckIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clip-path="url(#clip0_23908_3690)">
        <circle
          cx="16"
          cy="16"
          r="15"
          fill="#6061E5"
          stroke="#6061E5"
          stroke-width="2"
        />
      </g>
      <path
        d="M12.5778 19.642L22.2198 10L23.5 11.2802L12.5778 22.2025L7.49951 17.1257L8.77976 15.8455L12.5778 19.642Z"
        fill="white"
      />
      <defs>
        <clipPath id="clip0_23908_3690">
          <rect width="32" height="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default CompleteCheckIcon;
