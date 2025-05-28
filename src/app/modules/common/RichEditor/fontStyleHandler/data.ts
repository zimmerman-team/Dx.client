export const DEFAULT_FONT_FAMILY =
  "GothamNarrow-Book, Helvetica Neue, sans-serif";
export const DEFAULT_BOLD_FONT_FAMILY =
  "GothamNarrow-Bold, Helvetica Neue, sans-serif";

export const fontStyles = [
  {
    key: "normal",
    label: "Normal",
    style: "normal",
    height: "40px",
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: "12px",
    selected: false,
    blockType: "unstyled",
  },
  {
    key: "title",
    label: "Title",
    style: "title",
    height: "70px",
    fontFamily: DEFAULT_BOLD_FONT_FAMILY,
    fontSize: "40px",
    selected: false,
    blockType: "header-one",
  },
  {
    key: "subtitle",
    label: "Subtitle",
    style: "subtitle",
    height: "51px",
    fontSize: "24px",
    selected: false,
    fontFamily: DEFAULT_BOLD_FONT_FAMILY,
    blockType: "header-two",
  },
  {
    key: "heading1",
    label: "Heading 1",
    style: "heading1",
    fontSize: "18px",
    height: "46px",
    selected: false,
    fontFamily: DEFAULT_BOLD_FONT_FAMILY,
    blockType: "header-three",
  },
  {
    key: "heading2",
    label: "Heading 2",
    style: "heading2",
    fontSize: "14px",
    height: "40px",
    selected: false,
    fontFamily: DEFAULT_BOLD_FONT_FAMILY,
    blockType: "header-four",
  },
  {
    key: "heading3",
    label: "Heading 3",
    style: "heading1",
    fontSize: "12px",
    height: "40px",
    selected: false,
    fontFamily: DEFAULT_FONT_FAMILY,
    blockType: "header-five",
  },
  {
    key: "options",
    label: "Options",
    style: "options",
    height: "40px",
    fontSize: "12px",
    fontFamily: DEFAULT_FONT_FAMILY,
    selected: false,
    blockType: "unstyled",
  },
];
export const fontFamilies = [
  {
    label: "Amatic SC",
    fontFamily: "Amatic SC, sans-serif",
    selected: false,
  },
  {
    label: "Arial",
    fontFamily: "Arial, sans-serif",
    selected: false,
  },
  {
    label: "Caveat",
    selected: false,
    fontFamily: "Caveat, sans-serif",
  },
  {
    selected: false,
    label: "Comfortaa",
    fontFamily: "Comfortaa, sans-serif",
  },
  {
    label: "Comic Sans MS",
    selected: false,
    fontFamily: "Comic Sans MS, sans-serif",
  },
  {
    label: "Courier New",
    selected: false,
    fontFamily: "Courier New, Courier, monospace",
  },
  {
    label: "EB Garamond",
    fontFamily: "EB Garamond, serif",
    selected: false,
  },
  {
    label: "Finlandica",
    fontFamily: "Finlandica, serif",
    selected: false,
  },
  {
    label: "Georgia",
    fontFamily: "Georgia, serif",
    selected: false,
  },
  {
    label: "Impact",
    fontFamily: "Impact, sans-serif",
    selected: false,
  },
  {
    label: "Inter",
    fontFamily: "Inter, sans-serif",
    selected: false,
  },
  {
    label: "Gotham",
    fontFamily: '"GothamNarrow-Book", "Helvetica Neue", sans-serif',
    selected: false,
  },
];

export const fontFamilyStyleMap = fontFamilies.reduce(
  (acc: { [key: string]: { fontFamily: string } }, font) => {
    const key = "FONT_FAMILY_" + font.label.toUpperCase().replace(/\s/g, "_");
    acc[key] = {
      fontFamily: font.fontFamily,
    };
    return acc;
  },
  {}
);

console.log("Font family style map:", fontFamilyStyleMap);
