import React from "react";
import { boolean } from "yup";

export const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props
) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
    >
      <path
        d="M10 2.5V7.5M20 2.5V7.5M3.75 12.5H26.25M18.75 27.5V22.5C18.75 21.837 19.0134 21.2011 19.4822 20.7322C19.9511 20.2634 20.587 20 21.25 20H26.25M26.25 21.25V7.5C26.25 6.83696 25.9866 6.20107 25.5178 5.73223C25.0489 5.26339 24.413 5 23.75 5H6.25C5.58696 5 4.95107 5.26339 4.48223 5.73223C4.01339 6.20107 3.75 6.83696 3.75 7.5V25C3.75 25.663 4.01339 26.2989 4.48223 26.7678C4.95107 27.2366 5.58696 27.5 6.25 27.5H20L26.25 21.25Z"
        stroke="#6061E5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const CalendarIcon2: React.FC<React.SVGProps<SVGSVGElement>> = (
  props
) => {
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
        d="M8.66675 2V6M16.6667 2V6M3.66675 10H21.6667M15.6667 22V18C15.6667 17.4696 15.8775 16.9609 16.2525 16.5858C16.6276 16.2107 17.1363 16 17.6667 16H21.6667M21.6667 17V6C21.6667 5.46957 21.456 4.96086 21.081 4.58579C20.7059 4.21071 20.1972 4 19.6667 4H5.66675C5.13632 4 4.62761 4.21071 4.25253 4.58579C3.87746 4.96086 3.66675 5.46957 3.66675 6L3.66675 20C3.66675 20.5304 3.87746 21.0391 4.25253 21.4142C4.62761 21.7893 5.13632 22 5.66675 22H16.6667L21.6667 17Z"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export const CalendarIcon3: React.FC<
  React.SVGProps<SVGSVGElement> & { dark?: boolean }
> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M8 2V6M16 2V6M3 10H21M15 22V18C15 17.4696 15.2107 16.9609 15.5858 16.5858C15.9609 16.2107 16.4696 16 17 16H21M21 17V6C21 5.46957 20.7893 4.96086 20.4142 4.58579C20.0391 4.21071 19.5304 4 19 4H5C4.46957 4 3.96086 4.21071 3.58579 4.58579C3.21071 4.96086 3 5.46957 3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H16L21 17Z"
        stroke={props.dark ? "#454545" : "#6061E5"}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
