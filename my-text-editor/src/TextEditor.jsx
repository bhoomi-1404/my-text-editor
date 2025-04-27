import React, { useRef, useState, useEffect } from "react";
import NewToolBar from "./Components/NewToolBar";
import CommandMenu from "./Components/CommandMenu";
import PropertiesPanel from "./Components/PropertiesPanel";
import KeyboardShortcutsGuide from "./Components/KeyboardShortcutsGuide";
import { useEditorState } from "./Hooks/useEditorState";
import { useInteractiveElements } from "./Hooks/useInteractiveElements";
import { useDragAndDrop } from "./Hooks/useDragAndDrop";
import { useCommandMenu } from "./Hooks/useCommandMenu";
import { useKeyboardShortcuts } from "./Hooks/useKeyboardShortcuts";
import "./assets/editor.css";
export default function AdvancedEditor() {
  const editorRef = useRef(null);

  // Editor state and history management
  const { history, saveHistory, undo, redo } = useEditorState(editorRef);

  // Interactive elements management
  const {
    interactiveElements,
    updateInteractiveElements,
    focusedElementIndex,
    setFocusedElementIndex,
    selectedElement,
    setSelectedElement,
    elementProperties,
    setElementProperties,
    showProperties,
    setShowProperties,
    handleElementSelect,
    updateElementProperties,
    insertInteractiveElement,
    wrapSelection,
    applyAlignment,
    insertUnorderedList,
    insertOrderedList,
  } = useInteractiveElements(editorRef, saveHistory);

  // Drag and drop functionality
  const { isDragging, setIsDragging, draggedElement, setDraggedElement } =
    useDragAndDrop(editorRef, saveHistory, updateInteractiveElements);

  // Command menu state
  const {
    showCommandMenu,
    setShowCommandMenu,
    commandPosition,
    setCommandPosition,
    commandMenuRef,
    insertHeading,
    insertCodeBlock,
    insertCallout,
  } = useCommandMenu(editorRef, saveHistory);

  // Keyboard shortcuts
  const handleKeyDown = useKeyboardShortcuts({
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
  });

  // Handle input changes
  const handleInput = () => {
    saveHistory();
  };

  // Initialize history and event listeners
  useEffect(() => {
    if (editorRef.current) {
      saveHistory();
      updateInteractiveElements();
    }

    // Handle click outside to close menus
    const handleClickOutside = (e) => {
      if (
        showCommandMenu &&
        commandMenuRef.current &&
        !commandMenuRef.current.contains(e.target) &&
        !e.target.closest('[contenteditable="true"]')
      ) {
        setShowCommandMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCommandMenu, commandMenuRef, updateInteractiveElements]);

  return (
    <div
      style={{ padding: 20, position: "relative" }}
      className="editor-wrapper"
    >
      {/* Main toolbar */}
      <NewToolBar
        wrapSelection={wrapSelection}
        insertInteractiveElement={insertInteractiveElement}
        applyAlignment={applyAlignment}
        insertUnorderedList={insertUnorderedList}
        insertOrderedList={insertOrderedList}
      />

      {/* Editor area */}
      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        style={{
          border: "1px solid #ccc",
          minHeight: "400px",
          padding: "10px",
          borderRadius: "8px",
          position: "relative",
          textAlign:"center"
        }}
      />

      {/* Command menu */}
      {showCommandMenu && (
        <CommandMenu
          ref={commandMenuRef}
          position={commandPosition}
          insertHeading={insertHeading}
          insertInteractiveElement={insertInteractiveElement}
          insertCodeBlock={insertCodeBlock}
          insertCallout={insertCallout}
          closeMenu={() => setShowCommandMenu(false)}
        />
      )}

      {/* Properties panel */}
      {showProperties && selectedElement && (
        <PropertiesPanel
          selectedElement={selectedElement}
          elementProperties={elementProperties}
          updateElementProperties={updateElementProperties}
          onClose={() => setShowProperties(false)}
          onDelete={() => {
            if (selectedElement) {
              selectedElement.parentNode.removeChild(selectedElement);
              setSelectedElement(null);
              setShowProperties(false);
              saveHistory();
              updateInteractiveElements();
            }
          }}
        />
      )}

      {/* Keyboard shortcut reference */}
      <KeyboardShortcutsGuide />
    </div>
  );
}
