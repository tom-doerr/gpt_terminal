const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post("/execute", (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: "Command is required" });
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr });
    }
    res.json({ result: stdout });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

