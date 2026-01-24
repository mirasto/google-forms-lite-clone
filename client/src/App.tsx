import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FormBuilder from './pages/FormBuilder';
import FormFiller from './pages/FormFiller';
import FormResponses from './pages/FormResponses';

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
