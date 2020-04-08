const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryId = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (repositoryId < 0) {
    return response
      .status(400)
      .json({ error: `Id ${id} not found in the database` });
  }

  const currentRepository = { ...repositories[repositoryId] };
  let updatedRepository = { ...currentRepository };
  updatedRepository.title = title ? title : currentRepository.title;
  updatedRepository.url = url ? url : currentRepository.url;
  updatedRepository.techs = techs ? techs : currentRepository.techs;

  repositories[repositoryId] = updatedRepository;

  return response.json(updatedRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryId = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (repositoryId < 0) {
    return response
      .status(400)
      .json({ error: `Id ${id} not found in the database` });
  }

  repositories.splice(repositoryId, 1);
  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryId = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (repositoryId < 0) {
    return response
      .status(400)
      .json({ error: `Id ${id} not found in the database` });
  }

  const currentRepository = { ...repositories[repositoryId] };
  const updatedRepository = {
    ...currentRepository,
    likes: parseInt(currentRepository.likes) + 1,
  };

  repositories[repositoryId] = updatedRepository;

  return response.json(updatedRepository);
});

module.exports = app;
