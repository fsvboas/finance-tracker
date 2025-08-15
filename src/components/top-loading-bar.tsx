"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Progress } from "./progress";

const TopLoadingBar = () => {
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    requestAnimationFrame(() => {
      setIsLoading(false);
    });
  }, [pathname]);

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      setProgress(0);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          if (prev >= 60) return prev + Math.random() * 3;
          if (prev >= 30) return prev + Math.random() * 8;
          return prev + Math.random() * 15;
        });
      }, 150);

      return () => clearInterval(interval);
    }

    setProgress(100);
    const timeout = setTimeout(() => {
      setIsVisible(false);
      setProgress(0);
    }, 300);

    return () => clearTimeout(timeout);
  }, [isLoading]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Progress
        value={progress}
        className="h-1 rounded-none border-none bg-transparent [&>div]:bg-green-600"
      />
    </div>
  );
};

export default TopLoadingBar;
