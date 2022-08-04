const express = require("express");
const generateId = require("./utils");
const morgan = require("morgan");
let persons = require("./data");
const app = express();

morgan.token("body", function getBody(req) {
  if (req.method === "POST") return JSON.stringify(req.body);
  return "{}";
});

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(express.static("build"));

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  let lengthOfData = persons.length;
  let people = lengthOfData === 1 ? "person" : "people";
  let data = `Phonebook has info for ${lengthOfData} ${people}`;

  response.send(`<p>${data}</p><p>${Date()}</p>`);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.post("/api/persons", (req, res) => {
  let body = req.body;

  if (!body.number) return res.status(400).send({ error: "number is missing" });

  if (!body.name) return res.status(400).send({ error: "name is missing" });

  let isAdded = persons.some((person) => person.number === body.number);

  if (isAdded)
    return res
      .status(400)
      .send({ error: "this number is already in the phonebook" });

  let dataToAdd = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(dataToAdd);
  res.status(200).json(dataToAdd);
});

app.get("/api/persons/:id", (req, res) => {
  let id = Number(req.params.id);
  let person = persons.filter((person) => person.id === id);

  if (person.length === 0) {
    return res.sendStatus(404);
  }

  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  let id = Number(req.params.id);

  let person = persons.filter((person) => person.id === id);

  if (person.length === 0) {
    return res.sendStatus(404);
  }

  persons = persons.filter((person) => person.id !== id);

  res.sendStatus(204);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT);
