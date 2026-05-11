import { yoga } from "@elysia/graphql-yoga";
import { Elysia } from "elysia";
import { prisma } from "./lib/prisma";
import { resolvers, typeDefs } from "./schema";

const app = new Elysia()
  .use(
    yoga({
      typeDefs,
      context: { prisma },
      resolvers
    })
  )
  .listen(3000);

console.info(`Server running at http://localhost:${app.server?.port}/graphql`);
