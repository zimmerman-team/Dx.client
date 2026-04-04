import React from "react";

const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clip-path="url(#clip0_26958_29096)">
        <g clip-path="url(#clip1_26958_29096)">
          <rect
            width="18"
            height="18"
            fill="white"
            fill-opacity="0.01"
            style={{
              mixBlendMode: "multiply",
            }}
          />
          <path
            d="M11.8421 2.25H4.26316C3.56842 2.25 3 2.80227 3 3.47727V12.0682H4.26316V3.47727H11.8421V2.25ZM11.2105 4.70455L15 8.38636V14.5227C15 15.1977 14.4316 15.75 13.7368 15.75H6.78316C6.08842 15.75 5.52632 15.1977 5.52632 14.5227L5.53263 5.93182C5.53263 5.25682 6.09474 4.70455 6.78947 4.70455H11.2105ZM10.5789 9H14.0526L10.5789 5.625V9Z"
            fill="#231D2C"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_26958_29096">
          <rect width="18" height="18" fill="white" />
        </clipPath>
        <clipPath id="clip1_26958_29096">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default CopyIcon;
