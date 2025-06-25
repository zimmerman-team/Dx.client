import React from "react";
import DesktopFooter from "./DesktopFooter";
interface Props {
  mini?: boolean;
}
export default function HomeFooter(props: Props) {
  return (
    <>
      <DesktopFooter mini={props.mini} />
    </>
  );
}
