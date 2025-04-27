import { Route, BrowserRouter, Routes } from "react-router-dom";
import "./App.css";
import AdvancedEditor from "./TextEditor";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdvancedEditor />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
