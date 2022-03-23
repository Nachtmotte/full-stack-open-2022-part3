require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(express.static("build"));
app.use(cors());
app.use(express.json());

app.get("/info", morgan("tiny"), (request, response) => {
  Person.find({}).then((persons) =>
    response.send(
      `<p>Phonebook has info for ${
        persons.length
      } people</p><p>${new Date()}</p>`
    )
  );
});

app.get("/api/persons", morgan("tiny"), (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", morgan("tiny"), (request, response) => {
  Person.findById(request.params.id).then((person) =>
    person !== null ? response.json(person) : response.status(404).end()
  );
});

app.delete("/api/persons/:id", morgan("tiny"), (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) =>
    result !== null ? response.status(200).end() : response.status(404).end())
    .catch((error) => next(error));
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

    const isNameDuplicate = false; //Arreglar
    if (isNameDuplicate) {
      return response.status(409).json({ error: "name must be unique" });
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    });

    person.save().then((savedPerson) => response.json(savedPerson));
  }
);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
