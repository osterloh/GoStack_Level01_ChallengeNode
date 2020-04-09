const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(cors());
app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;
  const result = title
    ? repositories.filter(repositorie => repositorie.title.includes(title))
    : repositories;

  return response.json(result);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;
  const repositorie = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositorieIndex < 0){
    return response.status(400).json({ error: 'Repositorie not found.'});
  }

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositorieIndex].likes,
  }

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositorieIndex < 0){
    return res.status(400).json({ error: 'Repositorie not found.'});
  }

  repositories.splice(repositorieIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositorieIndex < 0){
    return response.status(400).json({ error: 'Repositorie not found.'});
  }

  likes = repositories[repositorieIndex].likes + 1;

  const repositorie = {
    id,
    title: repositories[repositorieIndex].title,
    url: repositories[repositorieIndex].url,
    techs: repositories[repositorieIndex].techs,
    likes,
  }

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
});

module.exports = app;
