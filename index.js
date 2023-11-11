const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");
const { default: axios } = require("axios");

async function startServer() {
  // APP
  const app = express();

  // New Apollo Server
  const server = new ApolloServer({
    typeDefs: `
    type User {
        id: ID
        name: String
        phone: String
        email: String
        username: String
    }
    
    type Todo {
        id: ID
        userId: ID
        title: String
        completed: Boolean
        user: User
    }

    type Query {
        getTodos: [Todo]
    }
    `,
    resolvers: {
      Todo: {
        user: async (todo) =>
          (
            await axios.get(
              `https://jsonplaceholder.typicode.com/users/${todo.userId}`
            )
          ).data,
      },
      Query: {
        getTodos: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
      },
    },
  });

  app.use(express.json());
  app.use(cors());

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.listen(8000, () => console.log("server runing..."));
}

startServer();
