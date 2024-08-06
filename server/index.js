const express = require("express");
const { expressMiddleware } = require("@apollo/server/express4");
const { ApolloServer } = require("@apollo/server");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
            type User {
                id: ID!
                name: String! 
                username: String!
                email: String!
            } 

            type Todo {
                id: ID!
                title: String!
                completed: Boolean
                mainUser: User
            }

            type Query {
                getTodos: [Todo!]!
                getUsers: [User!]!
                getUserById(id: ID!): User
            }
        `,
    resolvers: {
        Todo: {
            mainUser: async (todo) =>
              (
                await axios.get(
                    `https://jsonplaceholder.typicode.com/users/${todo.userId}`
                  )
              ).data,
          },
      Query: {
        getTodos: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
        getUsers: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
        getUserById: async (parent, {id}) =>
          (
            await axios.get(
              `https://jsonplaceholder.typicode.com/users/${id}`
            )
          ).data,
      },
    },
  });

  app.use(bodyParser.json());
  app.use(cors());

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000/graphql");
  });
}

startServer();
