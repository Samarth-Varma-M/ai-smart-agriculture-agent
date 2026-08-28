"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AccessibilityContextType {
  sunlightMode: boolean;
  setSunlightMode: (val: boolean) => void;
  giantTouchTargets: boolean;
  setGiantTouchTargets: (val: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [sunlightMode, setSunlightMode] = useState(false);
  const [giantTouchTargets, setGiantTouchTargets] = useState(true); // Defaulting to true for rural users

  useEffect(() => {
    if (sunlightMode) {
      document.documentElement.classList.add("sunlight-mode");
    } else {
      document.documentElement.classList.remove("sunlight-mode");
    }
  }, [sunlightMode]);

  useEffect(() => {
    if (giantTouchTargets) {
      document.documentElement.classList.add("giant-touch");
    } else {
      document.documentElement.classList.remove("giant-touch");
    }
  }, [giantTouchTargets]);

  return (
    <AccessibilityContext.Provider value={{
      sunlightMode, setSunlightMode,
      giantTouchTargets, setGiantTouchTargets
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
