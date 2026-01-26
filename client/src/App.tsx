import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Home from "./pages/Home/Home";

const FormFiller = lazy(() => import("./pages/FormFiller/FormFiller"));
const FormBuilder = lazy(() => import("./pages/FormBuilder/FormBuilder"));
const FormResponses = lazy(() => import("./pages/FormResponses/FormResponses"));


function App() {
  return (
    <Suspense fallback={<div className="loader">Loading page...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forms/new" element={<FormBuilder />} />
        <Route path="/forms/:id/fill" element={<FormFiller />} />
        <Route path="/forms/:id/responses" element={<FormResponses />} />
      </Routes>
    </Suspense>
  );
}

export default App;
