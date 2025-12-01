import React from "react";
import LogoDark from "@app/modules/home-module/assets/logo-beta.svg";
import LogoMain from "@app/modules/home-module/assets/logo-main.svg";

export default function Logo(props: {
  width?: string;
  height?: string;
  main?: boolean;
}) {
  return (
    <div
      css={`
        display: flex;
      `}
    >
      {props.main ? (
        <img
          src={LogoMain}
          aria-label="DX Logo"
          width={props.width}
          height={props.height}
        />
      ) : (
        <img
          src={LogoDark}
          aria-label="DX Logo"
          width={props.width}
          height={props.height}
        />
      )}
    </div>
  );
}
