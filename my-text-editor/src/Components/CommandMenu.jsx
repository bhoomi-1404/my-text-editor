import React, { forwardRef } from "react";

const CommandMenu = forwardRef(
  (
    {
      position,
      insertHeading,
      insertInteractiveElement,
      insertCodeBlock,
      insertCallout,
      closeMenu,
    },
    ref
  ) => {
    const filterCommands = () => {
      const commands = [
        { name: "Heading 1", action: () => insertHeading(1) },
        { name: "Heading 2", action: () => insertHeading(2) },
        { name: "Heading 3", action: () => insertHeading(3) },
        { name: "Button", action: () => insertInteractiveElement("button") },
        {
          name: "Checkbox",
          action: () => insertInteractiveElement("checkbox"),
        },
        { name: "Image", action: () => insertInteractiveElement("image") },
        { name: "Table", action: () => insertInteractiveElement("table") },
        { name: "Code Block", action: () => insertCodeBlock() },
        { name: "Callout", action: () => insertCallout() },
      ];

      return commands;
    };

    return (
      <div
        className="command-menu"
        ref={ref}
        style={{
          position: "absolute",
          top: position.top + 20,
          left: position.left,
          background: "white",
          border: "1px solid #ddd",
          borderRadius: "6px",
          padding: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          zIndex: 1000,
          width: "250px",
        }}
      >
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          {filterCommands().map((cmd, index) => (
            <div
              key={index}
              style={{
                padding: "4px 8px",
                cursor: "pointer",
                borderRadius: "4px",
                margin: "2px 0",
                hover: { background: "#f5f5f5" },
              }}
              onClick={() => {
                cmd.action();
                closeMenu();
              }}
            >
              {cmd.name}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default CommandMenu;
