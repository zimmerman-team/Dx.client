import React from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MobileFooter from "./MobileFooter";
import DesktopFooter from "./DesktopFooter";
interface Props {
  mini?: boolean;
}
export default function HomeFooter(props: Props) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <>{isMobile ? <MobileFooter /> : <DesktopFooter mini={props.mini} />}</>
  );
}
