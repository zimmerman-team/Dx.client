import React from "react";
import GeomapChartPlaceholderImage from "@app/modules/chart-module/assets/geomapPlaceholder.svg?react";

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
