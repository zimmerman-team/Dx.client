import React from "react";
import { ReactComponent as GeomapChartPlaceholderImage } from "app/modules/chart-module/assets/geomapPlaceholder.svg";

export default function GeomapPlaceholder() {
  return (
    <GeomapChartPlaceholderImage
      css={`
        width: 100%;
        height: 100%;
      `}
    />
  );
}
