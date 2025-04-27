import React from "react";

export default function KeyboardShortcutsGuide() {
  return (
    <div
      style={{
        marginTop: "20px",
        fontSize: "14px",
        color: "#333",
        padding: "15px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        maxWidth: "600px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <strong
        style={{ fontSize: "16px", display: "block", marginBottom: "10px" }}
      >
        Keyboard Shortcuts:
      </strong>
      <ul
        style={{
          padding: "0",
          margin: "0",
          listStyleType: "none",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridGap: "15px",
          fontSize: "14px",
          color: "#555",
          textAlign:"start"
        }}
      >
        <li>Cmd+B: Bold</li>
        <li>Cmd+I: Italic</li>
        <li>Cmd+U: Underline</li>
        <li>Cmd+Q: Quote</li>
        <li>Cmd+Z: Undo</li>
        <li>Cmd+Shift+Z: Redo</li>
        <li>/ : Open Command Menu</li>
        <li>Tab: Navigate Elements</li>
        <li>Escape: Close Menus</li>
      </ul>
    </div>
  );
}
