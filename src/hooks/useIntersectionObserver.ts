import { useState, useEffect, RefObject } from "react";

export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "100px", ...options }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options.threshold, options.rootMargin, options.root]);

  return isIntersecting;
}
