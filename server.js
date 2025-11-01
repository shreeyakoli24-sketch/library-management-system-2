
import express from "express";
import cors from "cors";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const readDB = (file) => JSON.parse(fs.readFileSync(`./data/${file}`));
const writeDB = (file, data) => fs.writeFileSync(`./data/${file}`, JSON.stringify(data, null, 2));

app.get("/books", (req, res) => res.json(readDB("books.json")));
app.post("/books", (req, res) => {
  const books = readDB("books.json");
  books.push(req.body);
  writeDB("books.json", books);
  res.json({ success: true, message: "Book Added Successfully" });
});

app.get("/students", (req, res) => res.json(readDB("students.json")));
app.post("/students", (req, res) => {
  const students = readDB("students.json");
  students.push(req.body);
  writeDB("students.json", students);
  res.json({ success: true, message: "Student Added Successfully" });
});

app.post("/issue", (req, res) => {
  const { studentId, bookId } = req.body;
  const books = readDB("books.json");
  const book = books.find(b => b.id === bookId);

  if (!book) return res.json({ error: "Book Not Found" });
  if (book.issued) return res.json({ error: "Book Already Issued" });

  book.issued = true;
  book.issuedTo = studentId;
  writeDB("books.json", books);
  res.json({ success: true, message: "Book Issued Successfully" });
});

app.post("/return", (req, res) => {
  const { bookId } = req.body;
  const books = readDB("books.json");
  const book = books.find(b => b.id === bookId);

  if (!book) return res.json({ error: "Book Not Found" });

  book.issued = false;
  delete book.issuedTo;
  writeDB("books.json", books);
  res.json({ success: true, message: "Book Returned Successfully" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
