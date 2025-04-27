import { useState, useRef, useEffect } from "react";

export function useCommandMenu(editorRef, saveHistory) {
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [commandPosition, setCommandPosition] = useState({ top: 0, left: 0 });
  const [activeCommand, setActiveCommand] = useState(0);
  const commandMenuRef = useRef(null);

  const insertHeading = (level) => {
    editorRef.current.focus();
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    const headingTag = `h${level}`;
    const heading = document.createElement(headingTag);

    const selectedText = range.toString();
    heading.textContent = selectedText || `Heading ${level}`;


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

  const insertList = (ordered = false) => {
    editorRef.current.focus();
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    const listTag = ordered ? "ol" : "ul";
    const list = document.createElement(listTag);
    const item = document.createElement("li");

    const selectedText = range.toString();
    item.textContent = selectedText || "List item";
    list.appendChild(item);

    saveHistory();

    range.deleteContents();
    range.insertNode(list);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(item);
    newRange.collapse(true);
    selection.addRange(newRange);

    setShowCommandMenu(false);
  };

  const insertCodeBlock = () => {
    editorRef.current.focus();
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    const preElement = document.createElement("pre");
    const codeElement = document.createElement("code");

    const selectedText = range.toString();
    codeElement.textContent = selectedText || "Code block";
    preElement.appendChild(codeElement);


    range.deleteContents();
    range.insertNode(preElement);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(codeElement);
    newRange.collapse(true);
    selection.addRange(newRange);
    saveHistory();
    setShowCommandMenu(false);
  };

  const insertCallout = (type = "info") => {
    editorRef.current.focus();
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    const calloutDiv = document.createElement("div");
    calloutDiv.className = `callout callout-${type}`;

    const iconSpan = document.createElement("span");
    iconSpan.className = `callout-icon ${type}-icon`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "callout-content";

    const selectedText = range.toString();
    contentDiv.textContent = selectedText || "Callout content";

    calloutDiv.appendChild(iconSpan);
    calloutDiv.appendChild(contentDiv);


    range.deleteContents();
    range.insertNode(calloutDiv);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(calloutDiv);
    newRange.collapse(true);
    selection.addRange(newRange);

    saveHistory();
    setShowCommandMenu(false);
  };

  const openCommandMenu = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setCommandPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });

    setShowCommandMenu(true);
    setActiveCommand(0);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && !showCommandMenu) {
        e.preventDefault();
        openCommandMenu();
      }

      if (e.key === "Escape" && showCommandMenu) {
        e.preventDefault();
        setShowCommandMenu(false);
      }

      if (showCommandMenu && e.key === "ArrowUp") {
        e.preventDefault();
        setActiveCommand((prev) => (prev > 0 ? prev - 1 : commands.length - 1));
      }

      if (showCommandMenu && e.key === "ArrowDown") {
        e.preventDefault();
        setActiveCommand((prev) => (prev < commands.length - 1 ? prev + 1 : 0));
      }

      if (showCommandMenu && e.key === "Enter") {
        e.preventDefault();
        commands[activeCommand].action();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showCommandMenu, activeCommand]);

  const commands = [
    { name: "Heading 1", action: () => insertHeading(1) },
    { name: "Heading 2", action: () => insertHeading(2) },
    { name: "Heading 3", action: () => insertHeading(3) },
    { name: "Unordered List", action: () => insertList(false) },
    { name: "Ordered List", action: () => insertList(true) },
    { name: "Code Block", action: () => insertCodeBlock() },
    { name: "Info Callout", action: () => insertCallout("info") },
    { name: "Warning Callout", action: () => insertCallout("warning") },
  ];

  return {
    showCommandMenu,
    setShowCommandMenu,
    commandPosition,
    setCommandPosition,
    commandMenuRef,
    insertHeading,
    insertCodeBlock,
    insertCallout,
    activeCommand,
    commands,
  };
}
