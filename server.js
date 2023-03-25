const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let currentDir = process.cwd();

app.post("/execute", (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: "Command is required" });
  }

  if (command.startsWith("cd ")) {
    const newPath = path.join(currentDir, command.slice(3));
    try {
      process.chdir(newPath);
      currentDir = process.cwd();
      res.json({ result: `Changed directory to ${currentDir}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
 } else {
    exec(command, { cwd: currentDir }, (error, stdout, stderr) => {
      if (stderr) {
        return res.json({ result: stderr });
      }
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json({ result: stdout });
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port
  ${PORT}`);
});
