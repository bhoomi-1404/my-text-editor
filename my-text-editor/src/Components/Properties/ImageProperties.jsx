import React from "react";

export default function ImageProperties({ properties, updateProperties }) {
  return (
    <>
      <div style={{ marginBottom: "10px" }}>
        <label>Image Source (URL)</label>
        <input
          type="text"
          value={properties.src || ""}
          onChange={(e) => updateProperties({ src: e.target.value })}
          style={{ width: "100%", padding: "5px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Alt Text</label>
        <input
          type="text"
          value={properties.alt || ""}
          onChange={(e) => updateProperties({ alt: e.target.value })}
          style={{ width: "100%", padding: "5px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Width</label>
        <input
          type="text"
          value={properties.width || "200px"}
          onChange={(e) => updateProperties({ width: e.target.value })}
          style={{ width: "100%", padding: "5px" }}
        />
      </div>
    </>
  );
}
