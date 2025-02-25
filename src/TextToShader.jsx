// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { mat4 } from "gl-matrix";

// export default function TextToShader() {
//   const [description, setDescription] = useState("");
//   const [shaderCode, setShaderCode] = useState(null);
//   const [error, setError] = useState(null);
//   const canvasRef = useRef(null);
//   let gl;
//   let angle = 0;

//   const handleGenerateShader = async () => {
//     try {
//       setError(null);
//       const response = await axios.post("http://localhost:4000/api/generate-shader", {
//         text: description,
//       });
      
//       const shaderText = response.data.candidates[0].content.parts[0].text;
//       setShaderCode(shaderText);
      
//       requestAnimationFrame(renderShader);
//     } catch (err) {
//       setError("Failed to generate shader");
//       setShaderCode("Error in shader generation");
//     }
//   };

//   const compileShader = (source, type) => {
//     const shader = gl.createShader(type);
//     gl.shaderSource(shader, source);
//     gl.compileShader(shader);
//     if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//       console.error("Shader compile error:", gl.getShaderInfoLog(shader));
//       return null;
//     }
//     return shader;
//   };

//   const renderShader = () => {
//     if (!shaderCode || !canvasRef.current) return;

//     gl = canvasRef.current.getContext("webgl2");
//     if (!gl) {
//       setError("WebGL2 is not supported in your browser");
//       return;
//     }
    
//     gl.clearColor(0.0, 0.0, 0.0, 1.0);
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//     gl.enable(gl.DEPTH_TEST);

//     const vertexShaderSource = `#version 300 es
//       precision highp float;
//       layout(location = 0) in vec3 aPos;
//       uniform mat4 model;
//       uniform mat4 view;
//       uniform mat4 projection;
//       out vec3 ourColor;
//       void main() {
//         gl_Position = projection * view * model * vec4(aPos, 1.0);
//         ourColor = aPos;
//       }`;
    
//     const fragmentShaderSource = shaderCode;

//     const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
//     const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    
//     if (!vertexShader || !fragmentShader) {
//       setError("Shader compilation failed");
//       return;
//     }
    
//     const shaderProgram = gl.createProgram();
//     gl.attachShader(shaderProgram, vertexShader);
//     gl.attachShader(shaderProgram, fragmentShader);
//     gl.linkProgram(shaderProgram);
    
//     if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
//       console.error("Shader program link error:", gl.getProgramInfoLog(shaderProgram));
//       setError("Shader linking failed");
//       return;
//     }
    
//     gl.useProgram(shaderProgram);

//     const cubeVertices = new Float32Array([
//       -0.5, -0.5, -0.5,   0.5, -0.5, -0.5,   0.5,  0.5, -0.5,
//       -0.5,  0.5, -0.5,  -0.5, -0.5,  0.5,   0.5, -0.5,  0.5,
//        0.5,  0.5,  0.5,  -0.5,  0.5,  0.5,
//     ]);
    
//     const vao = gl.createVertexArray();
//     gl.bindVertexArray(vao);

//     const vbo = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
//     gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);

//     const positionAttrib = gl.getAttribLocation(shaderProgram, "aPos");
//     gl.enableVertexAttribArray(positionAttrib);
//     gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);
    
//     const modelMatrix = mat4.create();
//     angle += 0.01;
//     mat4.rotateY(modelMatrix, modelMatrix, angle);

//     const viewMatrix = mat4.create();
//     mat4.lookAt(viewMatrix, [0, 0, 3], [0, 0, 0], [0, 1, 0]);

//     const projectionMatrix = mat4.create();
//     mat4.perspective(projectionMatrix, Math.PI / 4, 1, 0.1, 10);

//     gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "model"), false, modelMatrix);
//     gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "view"), false, viewMatrix);
//     gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "projection"), false, projectionMatrix);
    
//     gl.drawArrays(gl.TRIANGLE_STRIP, 0, 8);
//     requestAnimationFrame(renderShader);
//   };

//   useEffect(() => {
//     renderShader();
//   }, [shaderCode]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h1 className="text-2xl mb-4">Text-to-Shader</h1>
//       <textarea
//         className="border p-2 w-96 h-24"
//         placeholder="Describe the shader (e.g., 'A rotating cube with a gradient background')"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//       />
//       <button onClick={handleGenerateShader} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
//         Generate Shader
//       </button>
//       {error && <p className="text-red-500 mt-4">{error}</p>}
//       <canvas ref={canvasRef} className="border mt-4 w-96 h-96"></canvas>
//       {shaderCode && (
//         <pre className="mt-4 bg-gray-200 p-2 w-96 overflow-auto">
//           {shaderCode}
//         </pre>
//       )}
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { mat4 } from "gl-matrix";

export default function TextToShader() {
  const [description, setDescription] = useState("");
  const [shaderCode, setShaderCode] = useState(null);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  let gl;
  let angle = 0;

  const handleGenerateShader = async () => {
    try {
      setError(null);
      const response = await axios.post("http://localhost:4000/api/generate-shader", {
        text: description,
      });
      
      const shaderText = response.data.candidates[0].content.parts[0].text;
      setShaderCode(shaderText);
      
      requestAnimationFrame(renderShader);
    } catch (err) {
      setError("Failed to generate shader");
      setShaderCode("Error in shader generation");
    }
  };

  const compileShader = (source, type) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(shader));
      setError(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  };

  const renderShader = () => {
    if (!shaderCode || !canvasRef.current) return;

    gl = canvasRef.current.getContext("webgl2");
    if (!gl) {
      setError("WebGL2 is not supported in your browser");
      return;
    }
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    const vertexShaderSource = `#version 300 es
      precision highp float;
      layout(location = 0) in vec3 aPos;
      uniform mat4 model;
      uniform mat4 view;
      uniform mat4 projection;
      out vec3 ourColor;
      void main() {
        gl_Position = projection * view * model * vec4(aPos, 1.0);
        ourColor = (aPos + 1.0) / 2.0; // Normalize position to [0,1] range
      }`;
    
    const fragmentShaderSource = shaderCode;

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    
    if (!vertexShader || !fragmentShader) {
      setError("Shader compilation failed");
      return;
    }
    
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error("Shader program link error:", gl.getProgramInfoLog(shaderProgram));
      setError("Shader linking failed");
      return;
    }
    
    gl.useProgram(shaderProgram);

    const cubeVertices = new Float32Array([
      -0.5, -0.5, -0.5,    0.5, -0.5, -0.5,    0.5,  0.5, -0.5,   -0.5,  0.5, -0.5,
      -0.5, -0.5,  0.5,    0.5, -0.5,  0.5,    0.5,  0.5,  0.5,   -0.5,  0.5,  0.5,
    ]);
    
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);

    const positionAttrib = gl.getAttribLocation(shaderProgram, "aPos");
    gl.enableVertexAttribArray(positionAttrib);
    gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);
    
    const modelMatrix = mat4.create();
    mat4.rotateY(modelMatrix, modelMatrix, angle);
    angle += 0.01;

    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, [0, 0, 3], [0, 0, 0], [0, 1, 0]);

    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, 1, 0.1, 10);

    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "model"), false, modelMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "view"), false, viewMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "projection"), false, projectionMatrix);
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 8);
    requestAnimationFrame(renderShader);
  };

  useEffect(() => {
    renderShader();
  }, [shaderCode]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Text-to-Shader</h1>
      <textarea
        className="border p-2 w-96 h-24"
        placeholder="Describe the shader (e.g., 'A rotating cube with a gradient background')"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleGenerateShader} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
        Generate Shader
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <canvas ref={canvasRef} className="border mt-4 w-96 h-96"></canvas>
      {shaderCode && (
        <pre className="mt-4 bg-gray-200 p-2 w-96 overflow-auto">
          {shaderCode}
        </pre>
      )}
    </div>
  );
}
