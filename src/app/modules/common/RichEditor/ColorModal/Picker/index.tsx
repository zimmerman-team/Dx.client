import { colors } from "app/modules/common/RichEditor/ColorModal/Picker/colors";

import Picker from "app/modules/common/RichEditor/ColorModal/Picker/picker";

const styleMap = {
  "color-000000": { color: "#000000" },
};
colors.map((c, i) => {
  styleMap[`color-${c.replace("#", "")}` as keyof typeof styleMap] = {
    color: c,
  };
  return null;
});
const pickerObj = {
  Picker: Picker,
  colorStyleMap: styleMap,
};

export default pickerObj;
