import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";
import { connectDB } from "./config/db";
import { buildContext } from "./middleware/authMiddleware";

const startServer = async () => {
  await connectDB();

  const app = express();
  app.use(cors());
  app.use(express.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: buildContext
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  app.listen(process.env.PORT, () => {
    console.log(
      `🚀 Server running at http://localhost:${process.env.PORT}/graphql`
    );
  });
};

startServer();
