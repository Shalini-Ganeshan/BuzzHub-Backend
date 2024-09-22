import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { PrismaClient } from "@prisma/client";
import { json } from "body-parser";
import resolvers from "./graphql/resolvers/index";
import typeDefs from "./graphql/typeDefs";

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// This function will be called when your Netlify function is invoked
export async function handler(event, context) {
  // Setup middleware for GraphQL
  const expressApp = express();
  expressApp.use(json());
  
  expressApp.use(
    "/.netlify/functions/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Add your context logic here
        return { prisma };
      },
    })
  );

  // Call the express app with the event and context
  return await new Promise((resolve, reject) => {
    expressApp(event, context, (response) => {
      resolve(response);
    });
  });
}
