"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface PerformanceContextType {
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
  lowPowerMode: boolean;
  setLowPowerMode: (value: boolean) => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const PerformanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lowPowerMode, setLowPowerMode] = useState(false);

  useEffect(() => {
    // Check system preference for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    
    // Load saved preferences
    const savedLowPowerMode = localStorage.getItem("lowPowerMode") === "true";
    setLowPowerMode(savedLowPowerMode);
    
    const savedReducedMotion = localStorage.getItem("reducedMotion");
    if (savedReducedMotion !== null) {
      setReducedMotion(savedReducedMotion === "true");
    }

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    localStorage.setItem("lowPowerMode", lowPowerMode.toString());
    localStorage.setItem("reducedMotion", reducedMotion.toString());
    
    // Apply global CSS classes for performance mode
    if (lowPowerMode || reducedMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
  }, [lowPowerMode, reducedMotion]);

  return (
    <PerformanceContext.Provider
      value={{
        reducedMotion,
        setReducedMotion,
        lowPowerMode,
        setLowPowerMode,
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
};
