import { useState, useEffect } from "react";
import init, { evaluate } from "./pkg/math_eval_wasm"; // Import Rust WASM module

export default function Calculator() {
  const [wasmLoaded, setWasmLoaded] = useState(false);
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    async function loadWasm() {
      await init(); // Ensure WASM initializes
      setWasmLoaded(true);
    }
    loadWasm();
  }, []);

  const handleEvaluate = () => {
    if (!wasmLoaded) {
      setResult("WASM not loaded yet");
      return;
    }

    try {
      setResult(evaluate(expression));
    } catch (error) {
      console.error("WASM error:", error);
      setResult("Invalid expression");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Math Evaluator</h1>
      <input
        type="text"
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        className="border p-2 mb-2"
        placeholder="Enter an expression (e.g., 3+4*2)"
      />
      <button
        onClick={handleEvaluate}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Evaluate
      </button>
      {result && <p className="mt-4">Result: {result}</p>}
    </div>
  );
}
