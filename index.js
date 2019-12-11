const express = require("express");
const app = express();
let morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

const requestLogger = (request, response, next) => {
  console.log("Method: ", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(express.static("build"));
app.use(cors());
app.use(bodyParser.json());
app.use(requestLogger);
app.use(morgan("tiny"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "0406653321"
  },
  {
    id: 2,
    name: "Olli Manninen",
    number: "0506976455"
  },
  {
    id: 3,
    name: "Jussi Pupunen",
    number: "0401234567"
  },
  {
    id: 4,
    name: "Jorma Uotila",
    number: "0449876543"
  }
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  res.send(`<h2>Contacts in Phonebook: ${persons.length}</h2> ${new Date()}`);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  console.log(id, typeof id, person.id, typeof person.id);
  person ? res.json(person) : res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  console.log("poistettava id: ");
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

app.post("/api/persons/", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing"
    });
  }
  persons.map(person => {
    if (person.name === body.name) {
      return res.status(400).json({
        error: "name is already in Phonebook"
      });
    }
  });

  const id = Math.floor(Math.random() * 1000);

  const personToAdd = { ...body, id: id };

  persons = persons.concat(personToAdd);
  console.log(persons);
  res.json(persons);
  // res.send(`<h2>New contact added: ${personToAdd.name} </h2>`);
});
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
