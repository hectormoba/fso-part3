require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const Person = require("./models/person");

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
  Person.find({}).then((result) => {
    let lengthOfData = result.length;
    let message = "";

    if (lengthOfData !== 0) {
      let people = lengthOfData === 1 ? "person" : "people";
      message = `Phonebook has info for ${lengthOfData} ${people}`;
    } else {
      message = `Phonebook has no contacts yes `;
    }
    response.send(`<p>${message}</p><p>${Date()}</p>`);
  });
});

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => res.json(persons))
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  let body = req.body;

  if (!body.number) return res.status(400).send({ error: "number is missing" });

  if (!body.name) return res.status(400).send({ error: "name is missing" });

  const person = new Person({
    number: body.number,
    name: body.name,
  });

  person
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((error) => {
      next(error);
    });
});

app.get("/api/persons/:id", (req, res, next) => {
  let id = req.params.id;
  Person.findById(id)
    .then((result) => res.json(result))
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  let id = req.params.id;
  let body = req.body;

  let person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(id, person, { new: true })
    .then((result) => {
      if (result) {
        res.json(result);
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  let id = req.params.id;

  Person.findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        res.status(204).end();
      }
    })
    .catch((error) => next(error));
});

const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformed id" });
  }

  if (error.name === "ValidationError") {
    return res.status(400).send(error.message);
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT);
