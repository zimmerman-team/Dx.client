// useScript.ts
import { useEffect, useState } from "react";

export function useScript(src: string) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = document.createElement("script");
    el.src = src;
    el.async = true;
    el.defer = true;
    el.onload = () => setLoaded(true);
    document.body.appendChild(el);

    return () => {
      el.remove();
    };
  }, [src]);

  return loaded;
}
