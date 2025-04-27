import { useState, useEffect } from "react";

export function useDragAndDrop(
  editorRef,
  saveHistory,
  updateInteractiveElements
) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElement, setDraggedElement] = useState(null);

  const createDragGhost = (element, event) => {
    const ghost = element.cloneNode(true);
    Object.assign(ghost.style, {
      position: "absolute",
      top: `${event.clientY}px`,
      left: `${event.clientX}px`,
      opacity: "0.6",
      pointerEvents: "none",
      zIndex: "1000",
      width: `${element.offsetWidth}px`,
      transform: "translate(-50%, -50%)",
    });

    document.body.appendChild(ghost);

    const rect = element.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    return { ghost, offsetX, offsetY };
  };

  const startDrag = (element, event) => {
    event.preventDefault();
    event.stopPropagation();

    const { ghost, offsetX, offsetY } = createDragGhost(element, event);

    element.dataset.offsetX = offsetX;
    element.dataset.offsetY = offsetY;

    setIsDragging(true);
    setDraggedElement({ element, ghost });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && draggedElement) {
        const { element, ghost } = draggedElement;
        const offsetX = parseInt(element.dataset.offsetX) || 0;
        const offsetY = parseInt(element.dataset.offsetY) || 0;

        ghost.style.left = `${e.clientX - offsetX}px`;
        ghost.style.top = `${e.clientY - offsetY}px`;
        const selection = document.caretRangeFromPoint(e.clientX, e.clientY);
        if (selection && editorRef.current.contains(selection.startContainer)) {
          const marker =
            document.getElementById("drag-insertion-marker") ||
            document.createElement("div");
          marker.id = "drag-insertion-marker";
          marker.style.height = "2px";
          marker.style.background = "#4285f4";
          marker.style.position = "absolute";
          marker.style.width = "100px";
          marker.style.zIndex = "999";

          const rect = selection.getBoundingClientRect();
          marker.style.left = `${rect.left}px`;
          marker.style.top = `${rect.top}px`;

          if (!document.getElementById("drag-insertion-marker")) {
            document.body.appendChild(marker);
          }
        }
      }
    };

    const handleMouseUp = (e) => {
      if (isDragging && draggedElement) {
        const { element, ghost } = draggedElement;

        if (ghost && ghost.parentNode) {
          ghost.parentNode.removeChild(ghost);
        }

        const marker = document.getElementById("drag-insertion-marker");
        if (marker) marker.parentNode.removeChild(marker);

        const selection = document.caretRangeFromPoint(e.clientX, e.clientY);
        if (selection && editorRef.current.contains(selection.startContainer)) {
          const range = document.createRange();
          range.setStart(selection.startContainer, selection.startOffset);
          range.collapse(true);

          const isOnSelf =
            selection.startContainer === element ||
            element.contains(selection.startContainer);

          if (!isOnSelf) {
            element.parentNode.removeChild(element);

            range.insertNode(element);

            const space = document.createTextNode("\u00A0");
            const spaceRange = document.createRange();
            spaceRange.setStartAfter(element);
            spaceRange.collapse(true);
            spaceRange.insertNode(space);

            saveHistory();
            updateInteractiveElements();
          }
        }

        setIsDragging(false);
        setDraggedElement(null);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    draggedElement,
    editorRef,
    saveHistory,
    updateInteractiveElements,
  ]);

  return {
    isDragging,
    setIsDragging,
    draggedElement,
    setDraggedElement,
    startDrag, 
  };
}
