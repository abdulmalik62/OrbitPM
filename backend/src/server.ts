import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";
import { connectDB } from "./config/db";
import { verifyToken } from "./utils/verifyToken";

const startServer = async () => {
  await connectDB();

  const app = express();
  app.use(cors());
  app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return {};

    const token = authHeader.replace("Bearer ", "");

    try {
      const decoded = verifyToken(token);
      return { user: decoded };
    } catch (error) {
      return {};
    }
  }
});


  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running at http://localhost:${process.env.PORT}/graphql`);
  });
};

startServer();
