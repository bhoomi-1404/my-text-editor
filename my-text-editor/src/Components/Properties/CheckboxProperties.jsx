import React from "react";

export default function CheckboxProperties({ properties, updateProperties }) {
  return (
    <>
      <div style={{ marginBottom: "10px" }}>
        <label>Label Text</label>
        <input
          type="text"
          value={properties.text || ""}
          onChange={(e) => updateProperties({ text: e.target.value })}
          style={{ width: "100%", padding: "5px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="checkbox"
          checked={properties.checked || false}
          onChange={(e) => updateProperties({ checked: e.target.checked })}
        />
        <label>Checked</label>
      </div>
    </>
  );
}
