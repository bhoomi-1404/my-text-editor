import React, { useRef, useState, useEffect } from "react";
export default function AdvancedEditor() {
  const editorRef = useRef(null);
  const commandMenuRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [commandPosition, setCommandPosition] = useState({ top: 0, left: 0 });

  const [selectedElement, setSelectedElement] = useState(null);
  const [showProperties, setShowProperties] = useState(false);
  const [elementProperties, setElementProperties] = useState({});
  const [draggedElement, setDraggedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [interactiveElements, setInteractiveElements] = useState([]);
  const [focusedElementIndex, setFocusedElementIndex] = useState(-1);

  const saveHistory = () => {
    if (editorRef.current) {
      setHistory((prev) => [...prev, editorRef.current.innerHTML]);
      setRedoStack([]);
    }
  };

  const updateInteractiveElements = () => {
    if (editorRef.current) {
      const elements = editorRef.current.querySelectorAll(
        ".interactive-element"
      );
      setInteractiveElements(Array.from(elements));
    }
  };

  const wrapSelection = (tagName, className = "") => {
    editorRef.current.focus();
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const wrapper = document.createElement(tagName);

    if (className) {
      wrapper.className = className;
    }

    wrapper.appendChild(range.extractContents());
    range.insertNode(wrapper);
    saveHistory();

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(wrapper);
    newRange.collapse(true);
    selection.addRange(newRange);

    updateInteractiveElements();
  };

  const insertInteractiveElement = (type) => {
    editorRef.current.focus();
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    const element = document.createElement("div");
    element.contentEditable = "false";
    element.className = `interactive-element ${type}`;
    element.dataset.type = type;
    element.tabIndex = 0;

    const dragHandle = document.createElement("div");
    dragHandle.className = "drag-handle";
    dragHandle.innerHTML = "⋮";
    dragHandle.style.cursor = "move";
    dragHandle.style.display = "inline-block";
    dragHandle.style.marginRight = "5px";
    dragHandle.style.userSelect = "none";

    switch (type) {
      case "button":
        element.innerHTML = `${dragHandle.outerHTML}<button>Button Text</button>`;
        element.style.display = "inline-block";
        element.style.padding = "5px";
        element.style.margin = "5px 0";
        break;
      case "checkbox":
        element.innerHTML = `${
          dragHandle.outerHTML
        }<input type="checkbox" id="cb-${Date.now()}" /><label for="cb-${Date.now()}">Checkbox Label</label>`;
        element.style.display = "inline-block";
        element.style.padding = "5px";
        element.style.margin = "5px 0";
        break;
      case "image":
        element.innerHTML = `${dragHandle.outerHTML}<img src="/api/placeholder/200/100" alt="Placeholder Image" style="max-width: 100%;" />`;
        element.style.display = "block";
        element.style.padding = "5px";
        element.style.margin = "10px 0";
        break;
      case "table": {
        const tableHTML = `
          <table style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px;" contenteditable="true">Header 1</th>
                <th style="border: 1px solid #ddd; padding: 8px;" contenteditable="true">Header 2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;" contenteditable="true">Cell 1</td>
                <td style="border: 1px solid #ddd; padding: 8px;" contenteditable="true">Cell 2</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;" contenteditable="true">Cell 3</td>
                <td style="border: 1px solid #ddd; padding: 8px;" contenteditable="true">Cell 4</td>
              </tr>
            </tbody>
          </table>`;
        element.innerHTML = `${dragHandle.outerHTML}${tableHTML}`;
        element.style.display = "block";
        element.style.margin = "10px 0";
        break;
      }
      default:
        element.innerHTML = `${dragHandle.outerHTML}<div>Interactive Element</div>`;
    }

    element.addEventListener("click", (e) => {
      if (
        (!isDragging && e.target === element) ||
        e.target.closest(".drag-handle")
      ) {
        e.stopPropagation();
        handleElementSelect(element);
      }
    });

    element.addEventListener("mousedown", (e) => {
      if (e.target.closest(".drag-handle")) {
        e.stopPropagation();
        setDraggedElement(element);
        setIsDragging(true);

        const ghost = element.cloneNode(true);
        ghost.style.position = "absolute";
        ghost.style.opacity = "0.5";
        ghost.style.pointerEvents = "none";
        ghost.style.zIndex = "1000";
        document.body.appendChild(ghost);

        const rect = element.getBoundingClientRect();
        element.dataset.offsetX = e.clientX - rect.left;
        element.dataset.offsetY = e.clientY - rect.top;

        element.dataset.ghost = true;
        setDraggedElement({ element, ghost });
      }
    });

    range.deleteContents();
    range.insertNode(element);

    const space = document.createTextNode("\u00A0");
    const spaceRange = document.createRange();
    spaceRange.setStartAfter(element);
    spaceRange.collapse(true);
    spaceRange.insertNode(space);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(space);
    newRange.collapse(true);
    selection.addRange(newRange);

    saveHistory();
    setShowCommandMenu(false);
    updateInteractiveElements();
  };

  const handleElementSelect = (element) => {
    setSelectedElement(element);

    const type = element.dataset.type;
    let props = {};

    switch (type) {
      case "button": {
        const button = element.querySelector("button");
        props = {
          text: button.textContent,
          bgColor: button.style.backgroundColor || "#ffffff",
          textColor: button.style.color || "#000000",
        };
        break;
      }
      case "checkbox": {
        const label = element.querySelector("label");
        props = {
          text: label.textContent,
          checked: element.querySelector("input").checked,
        };
        break;
      }
      case "image": {
        const img = element.querySelector("img");
        props = {
          src: img.src,
          alt: img.alt,
          width: img.style.width || "200px",
        };
        break;
      }
      default:
        props = {
          content: element.innerText,
        };
    }

    setElementProperties(props);
    setShowProperties(true);
  };

  const updateElementProperties = (props) => {
    if (!selectedElement) return;

    const type = selectedElement.dataset.type;

    switch (type) {
      case "button": {
        const button = selectedElement.querySelector("button");
        if (props.text !== undefined) button.textContent = props.text;
        if (props.bgColor !== undefined)
          button.style.backgroundColor = props.bgColor;
        if (props.textColor !== undefined) button.style.color = props.textColor;
        break;
      }
      case "checkbox": {
        const label = selectedElement.querySelector("label");
        const input = selectedElement.querySelector("input");
        if (props.text !== undefined) label.textContent = props.text;
        if (props.checked !== undefined) input.checked = props.checked;
        break;
      }
      case "image": {
        const img = selectedElement.querySelector("img");
        if (props.src !== undefined) img.src = props.src;
        if (props.alt !== undefined) img.alt = props.alt;
        if (props.width !== undefined) img.style.width = props.width;
        break;
      }
      default: {
        const content = selectedElement.querySelector("div");
        if (props.content !== undefined && content)
          content.innerText = props.content;
      }
    }

    setElementProperties({ ...elementProperties, ...props });
    saveHistory();
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
  }, [isDragging, draggedElement]);

  const filterCommands = () => {
    const commands = [
      { name: "Heading 1", action: () => insertHeading(1) },
      { name: "Heading 2", action: () => insertHeading(2) },
      { name: "Heading 3", action: () => insertHeading(3) },
      { name: "Button", action: () => insertInteractiveElement("button") },
      { name: "Checkbox", action: () => insertInteractiveElement("checkbox") },
      { name: "Image", action: () => insertInteractiveElement("image") },
      { name: "Table", action: () => insertInteractiveElement("table") },
      { name: "Code Block", action: () => insertCodeBlock() },
      { name: "Callout", action: () => insertCallout() },
    ];

    return commands.filter((cmd) => cmd.name.toLowerCase());
  };

  const insertHeading = (level) => {
    editorRef.current.focus();
    const selection = window.getSelection();
    console.log("🚀 ~ insertHeading ~ selection:", selection);

    const range = selection.getRangeAt(0);

    const headingTag = `h${level}`;
    const heading = document.createElement(headingTag);

    const text = range.toString() || `Heading ${level}`;
    heading.textContent = text;

    range.deleteContents();
    range.insertNode(heading);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(heading);
    newRange.collapse(true);
    selection.addRange(newRange);

    saveHistory();
    setShowCommandMenu(false);
  };

  const insertCodeBlock = () => {
    editorRef.current.focus();
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    const pre = document.createElement("pre");
    const code = document.createElement("code");
    const text = range.toString() || "Code goes here";
    code.textContent = text;
    pre.appendChild(code);

    range.deleteContents();
    range.insertNode(pre);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(pre);
    newRange.collapse(true);
    selection.addRange(newRange);

    saveHistory();
    setShowCommandMenu(false);
  };

  const insertCallout = () => {
    editorRef.current.focus();
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    const callout = document.createElement("div");
    const text = range.toString() || "Callout Text";
    callout.textContent = "💬 " + text;
    callout.style.background = "#f0f4c3";
    callout.style.padding = "10px";
    callout.style.borderLeft = "4px solid #cddc39";
    callout.style.margin = "10px 0";

    range.deleteContents();
    range.insertNode(callout);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(callout);
    newRange.collapse(true);
    selection.addRange(newRange);

    saveHistory();
    setShowCommandMenu(false);
  };

  const handleInput = () => {
    saveHistory();
  };

  const handleKeyDown = (e) => {
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case "b":
          e.preventDefault();
          wrapSelection("strong");
          break;
        case "i":
          e.preventDefault();
          wrapSelection("em");
          break;
        case "u":
          e.preventDefault();
          wrapSelection("u");
          break;
        case "s":
          e.preventDefault();
          wrapSelection("s");
          break;
        case "q":
          e.preventDefault();
          wrapSelection("blockquote");
          break;
        case "z":
          e.preventDefault();
          if (e.shiftKey) redo();
          else undo();
          break;
        case "8":
          if (e.shiftKey) {
            e.preventDefault();
            insertInteractiveElement("button");
          }
          break;
        case "9":
          if (e.shiftKey) {
            e.preventDefault();
            insertInteractiveElement("checkbox");
          }
          break;
        case "0":
          if (e.shiftKey) {
            e.preventDefault();
            insertInteractiveElement("image");
          }
      }
    }

    if (e.key === "Tab") {
      if (interactiveElements.length > 0) {
        e.preventDefault();
        let newIndex = focusedElementIndex;

        if (e.shiftKey) {
          newIndex =
            newIndex <= 0 ? interactiveElements.length - 1 : newIndex - 1;
        } else {
          newIndex = (newIndex + 1) % interactiveElements.length;
        }

        setFocusedElementIndex(newIndex);
        interactiveElements[newIndex].focus();
      }
    }

    if (e.key === "Escape") {
      if (showCommandMenu) {
        e.preventDefault();
        setShowCommandMenu(false);
      } else if (showProperties) {
        e.preventDefault();
        setShowProperties(false);
        setSelectedElement(null);
      }
    }

    if (e.key === "/" && !showCommandMenu) {
      e.preventDefault();
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setCommandPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
      setShowCommandMenu(true);
    }
  };

  const undo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      const currentState = newHistory.pop(); 
      const lastState = newHistory[newHistory.length - 1];
      setRedoStack((prev) => [...prev, currentState]);
      editorRef.current.innerHTML = lastState;
      setHistory(newHistory);
      updateInteractiveElements();
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const newRedoStack = [...redoStack];
      const redoState = newRedoStack.pop();
      setHistory((prev) => [...prev, redoState]);
      editorRef.current.innerHTML = redoState;
      setRedoStack(newRedoStack);
      updateInteractiveElements();
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      setHistory([editorRef.current.innerHTML]);
      updateInteractiveElements();
    }

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
  }, [showCommandMenu]);

  return (
    <div style={{ padding: 20, position: "relative" }}>
      <div
        className="toolbar"
        style={{ marginBottom: "10px", display: "flex", gap: "5px" }}
      >
        <button onClick={() => wrapSelection("strong")}>B</button>
        <button onClick={() => wrapSelection("em")}>I</button>
        <button onClick={() => wrapSelection("u")}>U</button>
        <button onClick={() => wrapSelection("s")}>S</button>
        <button onClick={() => wrapSelection("sub")}>X₂</button>
        <button onClick={() => wrapSelection("sup")}>X²</button>
        <button onClick={() => wrapSelection("blockquote")}>Quote</button>
        <span style={{ borderLeft: "1px solid #ccc", margin: "0 5px" }}></span>
        <button onClick={() => insertInteractiveElement("button")}>
          Button
        </button>
        <button onClick={() => insertInteractiveElement("checkbox")}>
          Checkbox
        </button>
        <button onClick={() => insertInteractiveElement("image")}>Image</button>
        <button onClick={() => insertInteractiveElement("table")}>Table</button>
        <span style={{ flexGrow: 1 }}></span>
        <div style={{ fontSize: "12px", color: "#666" }}>
          Type "/" for commands | Tab to navigate elements | Cmd+Shift+8 for
          Button
        </div>
      </div>

      {/* Editor area */}
      <div
        ref={editorRef}
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
        }}
      />

      {/* Command menu */}
      {showCommandMenu && (
        <div
          ref={commandMenuRef}
          style={{
            position: "absolute",
            top: commandPosition.top + 20,
            left: commandPosition.left,
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 1000,
            width: "250px",
          }}
        >
          {/* <input
            type="text"
            value={commandInput}
            onChange={handleCommandInput}
            placeholder="Type to filter commands..."
            style={{
              width: "100%",
              padding: "5px",
              border: "1px solid #eee",
              borderRadius: "4px",
              marginBottom: "5px",
            }}
            autoFocus
          /> */}
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {filterCommands().map((cmd, index) => (
              //   editorRef,
              //   saveHistory,
              //   setShowCommandMenu,
              //   isDragging,
              //   setDraggedElement,
              //   setIsDragging,
              //   setInteractiveElements
              <div
                key={index}
                style={{
                  padding: "4px 8px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  margin: "2px 0",
                  hover: { background: "#f5f5f5" },
                }}
                onClick={cmd.action}
              >
                {cmd.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Properties panel */}
      {showProperties && selectedElement && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "20px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 1000,
            width: "250px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <h4 style={{ margin: 0 }}>Edit Properties</h4>
            <button onClick={() => setShowProperties(false)}>×</button>
          </div>

          {selectedElement.dataset.type === "button" && (
            <>
              <div style={{ marginBottom: "10px" }}>
                <label>Button Text</label>
                <input
                  type="text"
                  value={elementProperties.text || ""}
                  onChange={(e) =>
                    updateElementProperties({ text: e.target.value })
                  }
                  style={{ width: "100%", padding: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Background Color</label>
                <input
                  type="color"
                  value={elementProperties.bgColor || "#ffffff"}
                  onChange={(e) =>
                    updateElementProperties({ bgColor: e.target.value })
                  }
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Text Color</label>
                <input
                  type="color"
                  value={elementProperties.textColor || "#000000"}
                  onChange={(e) =>
                    updateElementProperties({ textColor: e.target.value })
                  }
                />
              </div>
            </>
          )}

          {selectedElement.dataset.type === "checkbox" && (
            <>
              <div style={{ marginBottom: "10px" }}>
                <label>Label Text</label>
                <input
                  type="text"
                  value={elementProperties.text || ""}
                  onChange={(e) =>
                    updateElementProperties({ text: e.target.value })
                  }
                  style={{ width: "100%", padding: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <input
                  type="checkbox"
                  checked={elementProperties.checked || false}
                  onChange={(e) =>
                    updateElementProperties({ checked: e.target.checked })
                  }
                />
                <label>Checked</label>
              </div>
            </>
          )}

          {selectedElement.dataset.type === "image" && (
            <>
              <div style={{ marginBottom: "10px" }}>
                <label>Image Source (URL)</label>
                <input
                  type="text"
                  value={elementProperties.src || ""}
                  onChange={(e) =>
                    updateElementProperties({ src: e.target.value })
                  }
                  style={{ width: "100%", padding: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Alt Text</label>
                <input
                  type="text"
                  value={elementProperties.alt || ""}
                  onChange={(e) =>
                    updateElementProperties({ alt: e.target.value })
                  }
                  style={{ width: "100%", padding: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Width</label>
                <input
                  type="text"
                  value={elementProperties.width || "200px"}
                  onChange={(e) =>
                    updateElementProperties({ width: e.target.value })
                  }
                  style={{ width: "100%", padding: "5px" }}
                />
              </div>
            </>
          )}

          <button
            onClick={() => {
              if (selectedElement) {
                selectedElement.parentNode.removeChild(selectedElement);
                setSelectedElement(null);
                setShowProperties(false);
                saveHistory();
                updateInteractiveElements();
              }
            }}
            style={{
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
            }}
          >
            Delete Element
          </button>
        </div>
      )}

      {/* Keyboard shortcut reference */}
      <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
        <strong>Keyboard Shortcuts:</strong>
        <ul
          style={{
            columns: 2,
            columnGap: "20px",
            padding: "0 0 0 20px",
            margin: "5px 0",
          }}
        >
          <li>Cmd+B: Bold</li>
          <li>Cmd+I: Italic</li>
          <li>Cmd+U: Underline</li>
          <li>Cmd+S: Strikethrough</li>
          <li>Cmd+Q: Quote</li>
          <li>Cmd+Z: Undo</li>
          <li>Cmd+Shift+Z: Redo</li>
          <li>Cmd+Shift+8: Insert Button</li>
          <li>Cmd+Shift+9: Insert Checkbox</li>
          <li>Cmd+Shift+0: Insert Image</li>
          <li>/ : Open Command Menu</li>
          <li>Tab: Navigate Elements</li>
          <li>Escape: Close Menus</li>
        </ul>
      </div>
    </div>
  );
}
