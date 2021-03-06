import cors from "cors";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";

const app = express();

app.use(cors());

let users = {
  1: {
    id: "1",
    username: "Robin Wieruch"
  },
  2: {
    id: "2",
    username: "Dave Davids"
  }
};

// Query type, Mutation type, Object type, Scalar type
const schema = gql`
  type Query {
    users: [User!]
    me: User
    user(id: ID!): User
  }
  type User {
    id: ID!
    username: String!
  }
`;

const resolvers = {
  Query: {
    users: () => {
      return Object.values(users);
    },
    me: (parent, args, { me }) => {
      return me;
    },
    user: (parent, { id }) => {
      return users[id];
    }
  },
  User: {
    // resolver map
    username: user => user.username
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    // inject dependency to resolver functions
    me: users[1]
  }
});

server.applyMiddleware({ app, path: "/graphql" });
app.listen({ port: 8000 }, () => {
  console.log("Apollo Server on http://localhost:8000/graphql");
});
