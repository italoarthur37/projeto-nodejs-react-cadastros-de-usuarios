import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const users = [];

app.post("/usuarios", (request, response) => {
  const { email, name, age } = request.body;

  // 🔒 Validação de campos obrigatórios
  if (!email || !name || !age || typeof age !== 'number' || age <= 0) {
    return response.status(400).json({ error: "Todos os campos são obrigatórios e válidos." });
  }

  // Verifica se o e-mail já existe
  const emailExists = users.some(user => user.email === email);
  if (emailExists) {
    return response.status(400).json({ error: "E-mail já cadastrado." });
  }

  const newUser = { email, name, age };
  users.push(newUser);

  return response.status(201).json(newUser);
});

app.put("/usuarios/:id", (request, response) => {
  const { id } = request.params;
  const { email, name, age } = request.body;

  // 🔒 Validação de campos obrigatórios
  if (!email || !name || !age || typeof age !== 'number' || age <= 0) {
    return response.status(400).json({ error: "Todos os campos são obrigatórios e válidos." });
  }

  const userIndex = users.findIndex((_, index) => index == id);

  if (userIndex === -1) {
    return response.status(404).json({ error: "Usuário não encontrado." });
  }

  // Verifica se o novo e-mail já está em uso por outro usuário
  const emailExists = users.some((user, index) => user.email === email && index != userIndex);
  if (emailExists) {
    return response.status(400).json({ error: "E-mail já está em uso por outro usuário." });
  }

  users[userIndex] = { email, name, age };

  return response.status(200).json(users[userIndex]);
});

app.delete("/usuarios/:id", (request, response) => {
  const { id } = request.params;

  const userIndex = users.findIndex((_, index) => index == id);

  if (userIndex === -1) {
    return response.status(404).json({ error: "Usuário não encontrado." });
  }

  const deletedUser = users.splice(userIndex, 1);

  return response.status(200).json(deletedUser[0]);
});

app.get("/usuarios", (request, response) => {
  let filteredUsers = users;

  if (request.query.name) {
    filteredUsers = filteredUsers.filter(user => user.name === request.query.name);
  }
  if (request.query.email) {
    filteredUsers = filteredUsers.filter(user => user.email === request.query.email);
  }
  if (request.query.age) {
    filteredUsers = filteredUsers.filter(user => user.age == request.query.age);
  }

  return response.status(200).json(filteredUsers);
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
