"use client";

import { useEffect } from "react";

export default function AntiCopyProtection() {
  useEffect(() => {
    // 1. 마우스 우클릭 방지
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. 이미지 및 요소 드래그 방지
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // 3. 텍스트 선택 시작 방지 (단, input, textarea 등 폼 필드는 제외하여 정상 입력 가능)
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
    };

    // 4. 단축키 방지 (Ctrl+C, Ctrl+U 소스보기, Ctrl+S 저장, F12 등)
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      // F12 개발자 도구 방지
      if (e.key === "F12") {
        e.preventDefault();
        return;
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (isCtrlOrCmd) {
        const key = e.key.toLowerCase();

        // 소스 보기 (Ctrl+U)
        if (key === "u") {
          e.preventDefault();
          return;
        }

        // 페이지 저장 (Ctrl+S)
        if (key === "s") {
          e.preventDefault();
          return;
        }

        // 인쇄 (Ctrl+P) - PDF 저장 방지
        if (key === "p") {
          e.preventDefault();
          return;
        }

        // 개발자 도구 (Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C)
        if (e.shiftKey && (key === "i" || key === "j" || key === "c")) {
          e.preventDefault();
          return;
        }

        // 텍스트 복사 (Ctrl+C) 및 전체 선택 (Ctrl+A) - 입력창 외부일 때만 차단
        if (!isInput && (key === "c" || key === "a")) {
          e.preventDefault();
          return;
        }
      }
    };

    // 5. 클립보드 복사(copy) 및 잘라내기(cut) 이벤트 직접 차단 (모바일 메뉴 및 스크립트 우회 복사 방지)
    const handleClipboard = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("copy", handleClipboard);
    document.addEventListener("cut", handleClipboard);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("copy", handleClipboard);
      document.removeEventListener("cut", handleClipboard);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
