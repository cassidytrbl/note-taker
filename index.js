const fs = require("fs");
const path = require("path");
const express = require("express");
// const fullNotes = require("./db/db.json");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/api/notes", (req, res) => {
  const storedData = fs.readFileSync("./db/db.json", "utf-8");
  res.json(JSON.parse(storedData));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  const createdNotes = { title: title, text: text, id: uuidv4() };
  const storedData = fs.readFileSync("./db/db.json", "utf-8");
  const origNotes = JSON.parse(storedData);
  const newNotes = [...origNotes, createdNotes];
  fs.writeFileSync("db/db.json", JSON.stringify(newNotes));
  res.json(newNotes);
});

app.delete("/api/notes/:id", (req, res) => {
  let id = req.params.id;
  const { title, text } = req.body;
  const storedData = fs.readFileSync("./db/db.json", "utf-8");
  const notes = JSON.parse(storedData);
  const newNotes = [];
  for (const note of notes) {
    if(note.id != id) {
      newNotes.push(note);
		}
	}
  fs.writeFileSync("db/db.json", JSON.stringify(newNotes));
  res.json(newNotes);
});

app.listen(PORT, () => console.log(`listening on PORT: ${PORT}`));
