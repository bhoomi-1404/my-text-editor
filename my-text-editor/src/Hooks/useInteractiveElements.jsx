import { useState, useCallback } from "react";
import { useDragAndDrop } from "./useDragAndDrop";
export function useInteractiveElements(editorRef, saveHistory) {
  const [interactiveElements, setInteractiveElements] = useState([]);
  const [focusedElementIndex, setFocusedElementIndex] = useState(-1);
  const [selectedElement, setSelectedElement] = useState(null);
  const [elementProperties, setElementProperties] = useState({});
  const [showProperties, setShowProperties] = useState(false);


  const updateInteractiveElements = useCallback(() => {
    if (editorRef.current) {
      const elements = editorRef.current.querySelectorAll(
        ".interactive-element"
      );
      setInteractiveElements(Array.from(elements));
    }
  }, [editorRef]);
  const { startDrag } = useDragAndDrop(
    editorRef,
    saveHistory,
    updateInteractiveElements
  );


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


  const handleElementSelect = (element) => {
    setSelectedElement(element);

    // Extract properties based on element type
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
  const applyAlignment = (alignment) => {
    editorRef.current.focus();
    switch (alignment) {
      case "left":
        document.execCommand("justifyLeft");
        break;
      case "center":
        document.execCommand("justifyCenter");
        break;
      case "right":
        document.execCommand("justifyRight");
        break;
      case "justify":
        document.execCommand("justifyFull");
        break;
      default:
        break;
    }
    saveHistory();
  };
  const insertUnorderedList = () => {
    editorRef.current.focus();
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
    editorRef.current.focus();
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
      if (e.target === element || e.target.closest(".drag-handle")) {
        e.stopPropagation();
        handleElementSelect(element);
      }
    });

    element.addEventListener("mousedown", (e) => {
      if (e.target.closest(".drag-handle")) {
        e.stopPropagation();
        e.preventDefault();
        e.stopPropagation();
        startDrag(element, e);
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
    updateInteractiveElements();
  };

  return {
    interactiveElements,
    updateInteractiveElements,
    focusedElementIndex,
    setFocusedElementIndex,
    selectedElement,
    setSelectedElement,
    elementProperties,
    setElementProperties,
    showProperties,
    setShowProperties,
    handleElementSelect,
    updateElementProperties,
    insertInteractiveElement,
    wrapSelection,
    applyAlignment,
    insertUnorderedList,
    insertOrderedList,
  };
}
