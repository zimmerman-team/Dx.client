import { ContentBlock, EditorState } from "draft-js";

export function getStyleEl(): HTMLStyleElement {
  const styleId = "dynamic-editor-styles";
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }
  return styleEl;
}

export function registerDynamicStyle(className: string, cssRules: string) {
  const styleEl = getStyleEl();

  // Avoid duplicate rules
  const ruleMarker = `.${className}`;
  if (!styleEl.textContent?.includes(ruleMarker)) {
    styleEl.textContent += `
      li.${className}::marker { ${cssRules} }
    `;
  }
}
export function updateDynamicStylesOnRender(editorState: EditorState) {
  const content = editorState.getCurrentContent();
  const styleEl = getStyleEl();

  let cssRules = "";

  content.getBlocksAsArray().forEach((block: ContentBlock) => {
    const data: any = block.getData();
    if (!data || data.size === 0) return;

    const blockKey = block.getKey(); // unique per block

    // 🔹 Build CSS from block data
    let blockStyles = "";
    if (data.has("color")) {
      blockStyles += `color: ${data.get("color")};`;
      const className = `COLOR-${data.get("color").replace("#", "")}`;
      cssRules += `li.${className}::marker { color: ${data.get("color")}; }\n`;
    }
    if (data.has("fontFamily")) {
      blockStyles += `font-family: ${data.get("fontFamily")};`;
      const className = `FONT_FAMILY_${data
        .get("fontFamily")
        .replace(/\s/g, "_")
        .toUpperCase()}`;
      cssRules += `li.${className}::marker { font-family: ${data.get(
        "fontFamily"
      )}; }\n`;
    }
  });
  styleEl.textContent = (styleEl.textContent || "") + cssRules;
}
