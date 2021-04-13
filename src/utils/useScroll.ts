import React, { useEffect, useRef } from "react";

export const useScroll = (callback: () => void) => {
  const targetRef = useRef<HTMLDivElement>(null);

  let timer: NodeJS.Timeout;

  const handleScroll = () => {
    const targetDocumentCurrentHeight = targetRef.current?.clientHeight || 0;
    const viewScrollHeight =
      document.documentElement.scrollTop +
      document.documentElement.clientHeight;

    const isExec = viewScrollHeight - targetDocumentCurrentHeight > 232 - 310;
    if (isExec) {
      if (timer !== null) clearTimeout(timer);
      timer = setTimeout(() => callback(), 200);
    }
  };

  useEffect(() => {
    // 监听
    window.addEventListener("scroll", handleScroll);
    // 销毁
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return targetRef;
};
