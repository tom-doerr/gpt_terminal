import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState("");

  const executeCommand = async () => {
    try {
      const { data } = await axios.post("http://localhost:3001/execute", { command });
      setOutput(data.result);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      executeCommand();
    }
  };

  return (
    <div className="App">
      <h1>React Terminal</h1>
      <textarea
        rows="15"
        cols="80"
        value={output}
        readOnly
      />
      <input
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter command"
      />
      <button onClick={executeCommand}>Execute</button>
      </div>
  );
}
export default App;
   
