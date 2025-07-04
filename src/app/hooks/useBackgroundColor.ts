import { useEffect } from "react";

export default function useBackgroundColor(
  backgroundColor: string,
  deps: any[] = []
) {
  useEffect(() => {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.style.backgroundColor = backgroundColor;
    }

    return () => {
      if (rootElement) {
        rootElement.style.backgroundColor = "#f2f7fd"; // Default fallback color
      }
    };
  }, [backgroundColor, ...deps]);
}
