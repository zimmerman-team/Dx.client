import React from "react";
import { Col } from "react-bootstrap";
import InilineColorPicker from "app/modules/chart-module/routes/customize/components/InlineColorPicker/";
import ChartOptionSelect from "app/modules/chart-module/routes/customize/components/ChartOptionSelect";

interface Props {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  default?: string;
  label: string;
  isEnabled?: boolean;
  options?: any;
  className?: string;
}
const ChartOptionColor = ({
  value,
  error,
  onChange,
  default: defaultValue,
  label,
  isEnabled,
  ...props
}: Props) => {
  if (props.options) {
    return (
      <ChartOptionSelect
        value={value}
        error={error}
        onChange={onChange}
        default={defaultValue}
        label={label}
        {...props}
      />
    );
  }

  return (
    <label
      className={props.className + " row"}
      data-cy={`color-label-${label}`}
    >
      <Col xs={6} className="d-flex align-items-center">
        {label}
      </Col>
      <Col xs={6}>
        {/* <InilineColorPicker
          disabled={!isEnabled}
          color={value}
          onChange={onChange}
        /> */}
      </Col>
      {error && (
        <small>
          <i>{error}</i>
        </small>
      )}
    </label>
  );
};

export default React.memo(ChartOptionColor);
