// src/contexts/FontSizeContext.js
import { useEffect } from "react";

const useDynamicFontSize = (size) => {
  useEffect(() => {
    if (typeof size === "number") {
      // Apply font size to the root HTML element
      document.documentElement.style.fontSize = `${size}px`;
      localStorage.setItem("fontSize", size.toString());
    }
  }, [size]);
};

export default useDynamicFontSize;
