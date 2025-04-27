import React from "react";

export default function ButtonProperties({ properties, updateProperties }) {
  return (
    <>
      <div style={{ marginBottom: "10px" }}>
        <label>Button Text</label>
        <input
          type="text"
          value={properties.text || ""}
          onChange={(e) => updateProperties({ text: e.target.value })}
          style={{ width: "100%", padding: "5px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Background Color</label>
        <input
          type="color"
          value={properties.bgColor || "#ffffff"}
          onChange={(e) => updateProperties({ bgColor: e.target.value })}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Text Color</label>
        <input
          type="color"
          value={properties.textColor || "#000000"}
          onChange={(e) => updateProperties({ textColor: e.target.value })}
        />
      </div>
    </>
  );
}
