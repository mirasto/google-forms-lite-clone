import { Route, Routes } from "react-router-dom";
import FormBuilder from "./pages/FormBuilder/FormBuilder";
import FormFiller from "./pages/FormFiller/FormFiller";
import FormResponses from "./pages/FormResponses/FormResponses";
import Home from "./pages/Home/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/forms/new" element={<FormBuilder />} />
      <Route path="/forms/:id/fill" element={<FormFiller />} />
      <Route path="/forms/:id/responses" element={<FormResponses />} />
    </Routes>
  );
}

export default App;
