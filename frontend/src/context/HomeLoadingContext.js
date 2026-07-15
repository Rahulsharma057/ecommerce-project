"use client";
import { createContext, useContext, useState, useCallback } from "react";

const HomeLoadingContext = createContext(null);

// expectedCount = kitne sections ka data-load hone ka wait karna hai
// (jaise FeaturedProducts + NewArrivals — jinke apne API calls hain).
// HeroSection jaisi static/banner cheezein isme count karne ki zaroorat nahi.
export function HomeLoadingProvider({ children, expectedCount = 1 }) {
  const [readyCount, setReadyCount] = useState(0);

  const markReady = useCallback(() => {
    setReadyCount((c) => Math.min(c + 1, expectedCount));
  }, [expectedCount]);

  const isLoading = readyCount < expectedCount;

  return (
    <HomeLoadingContext.Provider value={{ markReady, isLoading }}>
      {children}
    </HomeLoadingContext.Provider>
  );
}

export function useHomeLoading() {
  const ctx = useContext(HomeLoadingContext);
  // Agar koi component is Provider ke bahar use kare, to safe no-op fallback
  // return karo — home ke bahar galti se import hone par crash na ho.
  return ctx || { markReady: () => {}, isLoading: false };
}
