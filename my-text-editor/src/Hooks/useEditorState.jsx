
import { useState, useEffect, useRef } from "react";

export function useEditorState(editorRef) {

  const historyRef = useRef([]);
  const redoStackRef = useRef([]);


  const [currentIndex, setCurrentIndex] = useState(-1);


  useEffect(() => {
    if (editorRef.current && historyRef.current.length === 0) {
      historyRef.current = [editorRef.current.innerHTML];
      setCurrentIndex(0);
    }
  }, [editorRef]);


  const saveHistory = () => {
    if (!editorRef.current) return;

    const currentContent = editorRef.current.innerHTML;


    if (historyRef.current[currentIndex] === currentContent) {
      return;
    }


    if (currentIndex < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, currentIndex + 1);
    }


    historyRef.current.push(currentContent);


    setCurrentIndex(historyRef.current.length - 1);
    redoStackRef.current = [];
  };


  const undo = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;


      if (editorRef.current) {
        editorRef.current.innerHTML = historyRef.current[newIndex];
      }

      setCurrentIndex(newIndex);
    }
  };

  const redo = () => {
    if (currentIndex < historyRef.current.length - 1) {
      const newIndex = currentIndex + 1;

      if (editorRef.current) {
        editorRef.current.innerHTML = historyRef.current[newIndex];
      }

      setCurrentIndex(newIndex);
    }
  };

  const history = historyRef.current.slice(0, currentIndex + 1);
  const redoStack = historyRef.current.slice(currentIndex + 1);

  return { history, redoStack, saveHistory, undo, redo };
}
