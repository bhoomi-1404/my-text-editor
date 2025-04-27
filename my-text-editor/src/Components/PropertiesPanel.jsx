import React from "react";
import ButtonProperties from "./Properties/ButtonProperties";
import CheckboxProperties from "./Properties/CheckBoxProperties";
import ImageProperties from "./Properties/ImageProperties";
export default function PropertiesPanel({
  selectedElement,
  elementProperties,
  updateElementProperties,
  onClose,
  onDelete,
}) {
  return (
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
        <button onClick={onClose}>×</button>
      </div>

      {selectedElement.dataset.type === "button" && (
        <ButtonProperties
          properties={elementProperties}
          updateProperties={updateElementProperties}
        />
      )}

      {selectedElement.dataset.type === "checkbox" && (
        <CheckboxProperties
          properties={elementProperties}
          updateProperties={updateElementProperties}
        />
      )}

      {selectedElement.dataset.type === "image" && (
        <ImageProperties
          properties={elementProperties}
          updateProperties={updateElementProperties}
        />
      )}

      <button
        onClick={onDelete}
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
  );
}
