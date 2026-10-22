"use client";

import React, { useEffect, useRef, useState } from "react";

type AnimationType =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "fade";

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number; // ms
  duration?: number; // ms
  className?: string;
  as?: React.ElementType;
  threshold?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 600,
  className = "",
  as: Component = "div",
  threshold = 0,
  once = true,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(true);
  const domRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && domRef.current) {
            observer.unobserve(domRef.current);
          }
        }
      },
      {
        threshold: 0,
        rootMargin: "80px 0px 80px 0px",
      }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [once]);

  return (
    <Component
      ref={domRef}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-all ease-out ${
        isVisible
          ? "translate-y-0 translate-x-0 scale-100 opacity-100"
          : "translate-y-3 opacity-95"
      } ${className}`}
    >
      {children}
    </Component>
  );
}

/**
 * Animated counter that counts up to the target number once scrolled into view
 */
export function StatCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 1500,
  className = "",
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const domRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setCount(end);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.2 }
    );

    const current = domRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasStarted, end]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [hasStarted, end, duration]);

  return (
    <span ref={domRef} className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
