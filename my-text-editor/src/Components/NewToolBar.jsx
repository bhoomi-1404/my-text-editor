import React from "react";

export default function Toolbar({
  wrapSelection,
  insertInteractiveElement,
  applyAlignment,
  insertUnorderedList,
  insertOrderedList,
}) {
  return (
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
      <button onClick={() => applyAlignment("left")}>Left</button>
      <button onClick={() => applyAlignment("center")}>Center</button>
      <button onClick={() => applyAlignment("right")}>Right</button>
      <button onClick={() => applyAlignment("justify")}>Justify</button>
      <button onClick={() => insertOrderedList()}>OL</button>
      <button onClick={() => insertUnorderedList()}>UL</button>
      <span style={{ borderLeft: "1px solid #ccc", margin: "0 5px" }}></span>
      <button onClick={() => insertInteractiveElement("button")}>Button</button>
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
  );
}
