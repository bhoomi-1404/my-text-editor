import React from "react";
const ToolBar = ({ saveHistory }) => {
  const wrapSelection = (tagName) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const wrapper = document.createElement(tagName);
    wrapper.appendChild(range.extractContents());
    range.insertNode(wrapper);
  };
  const applyAlignment = (alignment) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const wrapper = document.createElement("div");
    wrapper.style.textAlign = alignment;
    wrapper.appendChild(range.extractContents());
    range.insertNode(wrapper);
    saveHistory();
  };
  const insertUnorderedList = () => {
    const ul = document.createElement("ul");
    const li = document.createElement("li");
    li.innerText = "List Item";
    ul.appendChild(li);

    const selection = window.getSelection();
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0);
      range.insertNode(ul);
    }
    saveHistory();
  };
  const insertOrderedList = () => {
    const ol = document.createElement("ol");
    const li = document.createElement("li");
    li.innerText = "List Item";
    ol.appendChild(li);

    const selection = window.getSelection();
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0);
      range.insertNode(ol);
    }
    saveHistory();
  };
  return (
    <div>
      <div className="toolbar" style={{ marginBottom: "10px" }}>
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
      </div>
    </div>
  );
};
export default ToolBar;
