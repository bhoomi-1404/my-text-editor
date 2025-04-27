import { useCallback, useEffect } from "react";

export function useKeyboardShortcuts({
  editorRef,
  wrapSelection,
  undo,
  redo,
  insertInteractiveElement,
  interactiveElements,
  focusedElementIndex,
  setFocusedElementIndex,
  showCommandMenu,
  setShowCommandMenu,
  showProperties,
  setShowProperties,
  setSelectedElement,
  setCommandPosition,
}) {
  const handleKeyDown = useCallback(
    (e) => {
      const isEditorFocused = document.activeElement === editorRef.current;
      const isInteractiveElementFocused = focusedElementIndex !== null;

      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      if (
        ((e.ctrlKey || e.metaKey) && e.key === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z")
      ) {
        e.preventDefault();
        redo();
        return;
      }

      if (showCommandMenu) {
        if (e.key === "Escape") {
          e.preventDefault();
          setShowCommandMenu(false);
          return;
        }

        return;
      }

      if (showProperties) {
        if (e.key === "Escape") {
          e.preventDefault();
          setShowProperties(false);
          setSelectedElement(null);
          return;
        }

        return;
      }

      if (interactiveElements?.length > 0) {
        if (e.key === "Tab") {
          e.preventDefault();

          if (e.shiftKey) {
            const prevIndex =
              focusedElementIndex === null || focusedElementIndex === 0
                ? interactiveElements.length - 1
                : focusedElementIndex - 1;
            setFocusedElementIndex(prevIndex);
          } else {
            const nextIndex =
              focusedElementIndex === null ||
              focusedElementIndex === interactiveElements.length - 1
                ? 0
                : focusedElementIndex + 1;
            setFocusedElementIndex(nextIndex);
          }
          return;
        }

        if (e.key === "Enter" && isInteractiveElementFocused) {
          e.preventDefault();
          const element = interactiveElements[focusedElementIndex];
          setSelectedElement(element);
          setShowProperties(true);
          return;
        }

        if (
          (e.key === "Delete" || e.key === "Backspace") &&
          isInteractiveElementFocused
        ) {
          e.preventDefault();

          return;
        }
      }

      if (isEditorFocused) {
        if ((e.ctrlKey || e.metaKey) && e.key === "b") {
          e.preventDefault();
          wrapSelection("strong");
          return;
        }

        if ((e.ctrlKey || e.metaKey) && e.key === "i") {
          e.preventDefault();
          wrapSelection("em");
          return;
        }

        if ((e.ctrlKey || e.metaKey) && e.key === "u") {
          e.preventDefault();
          wrapSelection("u");
          return;
        }

        if (e.key === "/") {
          e.preventDefault();

          const selection = window.getSelection();
          if (selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            setCommandPosition({
              top: rect.bottom + window.scrollY,
              left: rect.left + window.scrollX,
            });

            setShowCommandMenu(true);
          }
          return;
        }

        if ((e.ctrlKey || e.metaKey) && e.key === "e") {
          e.preventDefault();
          insertInteractiveElement("embed");
          return;
        }

        if ((e.ctrlKey || e.metaKey) && e.key === "m") {
          e.preventDefault();
          insertInteractiveElement("math");
          return;
        }

        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "I") {
          e.preventDefault();
          insertInteractiveElement("image");
          return;
        }

        if ((e.ctrlKey || e.metaKey) && e.key === "d") {
          e.preventDefault();
          insertInteractiveElement("diagram");
          return;
        }

        if ((e.ctrlKey || e.metaKey) && e.key === "k") {
          e.preventDefault();
          insertInteractiveElement("link");
          return;
        }
      }
    },
    [
      editorRef,
      wrapSelection,
      undo,
      redo,
      insertInteractiveElement,
      interactiveElements,
      focusedElementIndex,
      setFocusedElementIndex,
      showCommandMenu,
      setShowCommandMenu,
      showProperties,
      setShowProperties,
      setSelectedElement,
      setCommandPosition,
    ]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return handleKeyDown;
}
