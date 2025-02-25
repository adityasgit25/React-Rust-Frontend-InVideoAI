import { Routes, Route } from "react-router-dom";
import Calculator from "./Calculator"; 
import TextToShader from "./TextToShader"; 
import Navigation from "./Navigation";

export default function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Calculator />} />
        <Route path="/text-to-shader" element={<TextToShader />} />
      </Routes>
    </>
  );
}
