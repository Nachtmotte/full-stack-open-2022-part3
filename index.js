const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(cors());
app.use(express.json());

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendick",
    number: "39-23-6423122",
    id: 4,
  },
];

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};

app.get("/", morgan("tiny"), (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", morgan("tiny"), (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons", morgan("tiny"), (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", morgan("tiny"), (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  person ? response.json(person) : response.status(404).end();
});

app.delete("/api/persons/:id", morgan("tiny"), (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    persons = persons.filter((p) => p !== person);
    response.status(200).end();
  } else {
    response.status(404).end();
  }
});

app.post(
  "/api/persons",
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
  (request, response) => {
    const body = request.body;

    if (!body.name) {
      return response.status(400).json({ error: "name missing" });
    }

    if (!body.number) {
      return response.status(400).json({ error: "number missing" });
    }

    const isNameDuplicate = persons.some((person) => person.name === body.name);
    if (isNameDuplicate) {
      return response.status(409).json({ error: "name must be unique" });
    }

    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    };
    persons = persons.concat(person);

    response.json(person);
  }
);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})