import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="flex justify-center space-x-4 p-4 bg-gray-200">
      <Link to="/" className="text-blue-500 ml-10 mr-10">Calculator</Link>
      <Link to="/text-to-shader" className="text-blue-500 ml-10">Text to Shader</Link>
    </nav>
  );
}