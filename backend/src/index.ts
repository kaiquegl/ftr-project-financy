import { yoga } from "@elysia/graphql-yoga";
import { cors } from "@elysiajs/cors";
import { useCookies as createCookiesPlugin } from "@whatwg-node/server-plugin-cookies";
import { Elysia } from "elysia";
import { getSessionTokenFromRequest, verifySessionToken } from "./lib/auth";
import { env } from "./lib/env";
import { prisma } from "./lib/prisma";
import { resolvers, typeDefs } from "./schema";

const app = new Elysia()
  .use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"]
    })
  )
  .use(
    yoga({
      typeDefs,
      plugins: [createCookiesPlugin()],
      context: async ({ request }) => {
        const sessionToken = getSessionTokenFromRequest(request);
        if (!sessionToken) {
          return { prisma, request, currentUser: null };
        }

        const sessionPayload = await verifySessionToken(sessionToken);
        if (!sessionPayload) {
          return { prisma, request, currentUser: null };
        }

        const currentUser = await prisma.user.findUnique({ where: { id: sessionPayload.sub } });
        return { prisma, request, currentUser };
      },
      resolvers
    })
  )
  .listen(env.PORT);

console.info(`Server running at http://localhost:${app.server?.port}/graphql`);
