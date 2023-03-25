
import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [history, setHistory] = useState([]);
  const terminalOutputRef = useRef();

  const executeCommand = async (command) => {
    try {
      const { data } = await axios.post('http://localhost:3001/execute', { command });
      setHistory([...history, { command, output: data.result }]);
    } catch (error) {
      setHistory([...history, { command, output: `Error: ${error.message}` }]);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const command = event.target.textContent.trim();
      if (command) {
        executeCommand(command);
        event.target.textContent = '';
        }
        }
      };

const displayHistory = history.map((entry, index) => (
  <React.Fragment key={index}>
    <span>{`$ ${entry.command}`}</span>
    <br />
    <span>{entry.output}</span>
    <br />
    <br /> {/* Add an extra line break here */}
  </React.Fragment>
));

const handleFocus = () => {
terminalOutputRef.current.scrollTo(0, terminalOutputRef.current.scrollHeight);
};

return (
<div className="App">
<h1>React Terminal</h1>
<div
className="terminal-output"
ref={terminalOutputRef}
style={{
whiteSpace: 'pre-wrap',
width: '80%',
minHeight: '300px',
maxHeight: '500px',
overflowY: 'auto',
padding: '10px',
backgroundColor: 'black',
color: 'white',
border: '1px solid #61dafb',
marginBottom: '10px',
}}
onClick={handleFocus}
contentEditable
onKeyPress={handleKeyPress}
>
{displayHistory}
</div>
</div>
);
}

export default App;
