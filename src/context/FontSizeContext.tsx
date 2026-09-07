import React, { createContext, useContext, useEffect, useState } from "react";

type FontSizeMode = "xs" | "s" | "m" | "l" | "xl" | "xxl" | "xxxl" | "xxxxl" | "xxxxxl";
const FONT_ARR: FontSizeMode[] = ["xs", "s", "m", "l", "xl", "xxl", "xxxl", "xxxxl", "xxxxxl"];

type FontSizeContextType = {
  mode: FontSizeMode;
  setSmall: () => void;
  setLarge: () => void;
};

const FontSizeContext = createContext<FontSizeContextType | null>(null);

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<FontSizeMode>("xl");

  function setSmall() {
    const findIndex = FONT_ARR.findIndex((item) => item === mode);
    const next = FONT_ARR[findIndex - 1];
    if (next) {
      setMode(next);
    }
  }
  function setLarge() {
    const findIndex = FONT_ARR.findIndex((item) => item === mode);
    const next = FONT_ARR[findIndex + 1];
    if (next) {
      setMode(next);
    }
  }

  useEffect(() => {
    const findIndex = FONT_ARR.findIndex((item) => item === mode);

    const scale = 1 + (findIndex - Math.floor(FONT_ARR.length / 2)) * 0.1;
    document.documentElement.style.setProperty("--font-scale", String(scale));
  }, [mode]);

  return <FontSizeContext.Provider value={{ mode, setSmall, setLarge }}>{children}</FontSizeContext.Provider>;
}

export function useFontSize() {
  const ctx = useContext(FontSizeContext);
  if (!ctx) throw new Error("useFontSize must be used within FontSizeProvider");
  return ctx;
}
