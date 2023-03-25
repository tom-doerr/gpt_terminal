import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [history, setHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState('');
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
      const command = currentCommand.trim();
      if (command) {
        executeCommand(command);
        setCurrentCommand('');
      }
    }
  };

const handleFocus = (event) => {
  terminalOutputRef.current.scrollTo(0, terminalOutputRef.current.scrollHeight);
  if (event.type === 'click') {
    setCurrentCommand(event.target.textContent);
  }
};

  const displayHistory = history.map((entry, index) => (
    <React.Fragment key={index}>
      <span>{`$ ${entry.command}`}</span>
      <br />
      <span>{entry.output}</span>
      <br />
      <br />
    </React.Fragment>
  ));

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
  onFocus={handleFocus} // Add this line
  contentEditable
  onKeyPress={handleKeyPress}
>
  {displayHistory}
</div>
    </div>
  );
}

export default App;
