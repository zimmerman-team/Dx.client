import { useEffect } from "react";

export default function useBackgroundColor(
  backgroundColor: string,
  deps: any[] = []
) {
  useEffect(() => {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.style.background = backgroundColor;
    }

    return () => {
      if (rootElement) {
        rootElement.style.background =
          "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f2f7fd 100%)"; // Default fallback color
      }
    };
  }, [backgroundColor, ...deps]);
}
