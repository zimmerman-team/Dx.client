import React, { useMemo } from "react";
import ChartOptionColorScale from "app/modules/chart-module/routes/customize/components//ChartOptionColorScale";
import ChartOptionColorScaleDefault from "app/modules/chart-module/routes/customize/components//ChartOptionColorScaleDefault";

const ChartOptionColorScaleWrapper = ({
  value,
  onChange,
  default: defaultValue,
  mappingValue,
  colorDataType,
  colorDataset,
}) => {
  const hasAnyMapping = useMemo(() => {
    return colorDataset && colorDataset.length > 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorDataset]);

  return (
    <>
      {!hasAnyMapping && (
        <ChartOptionColorScaleDefault
          onChange={onChange}
          defaultValue={defaultValue}
          value={value}
        />
      )}
      {hasAnyMapping && (
        <ChartOptionColorScale
          hasAnyMapping={hasAnyMapping}
          mappingValue={mappingValue}
          defaultValue={defaultValue}
          value={value}
          colorDataType={colorDataType}
          colorDataset={colorDataset}
          onChange={onChange}
        />
      )}
    </>
  );
};

export default ChartOptionColorScaleWrapper;
