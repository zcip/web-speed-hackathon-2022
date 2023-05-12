import { join } from "path";

import fastifyStatic from "@fastify/static";

/**
 * @type {import('fastify').FastifyPluginCallback}
 */
export const spaRoute = async (fastify) => {
  fastify.register(fastifyStatic, {
    immutable: true,
    maxAge: "1h",
    preCompressed: true,
    root: join(__dirname, "public"),
    wildcard: false,
  });

  fastify.get("/favicon.ico", () => {
    throw fastify.httpErrors.notFound();
  });

  fastify.get("/races/:raceId/*", async (req, reply) => {
    return reply.sendFile("races.html", join(__dirname, "public"), {
      immutable: false,
    });
  });

  fastify.get("/races", (_req, reply) => {
    return reply.sendFile("index.html", join(__dirname, "public"), {
      immutable: false,
    });
  });

  fastify.get("*", (_req, reply) => {
    return reply.sendFile("index.html", join(__dirname, "public"), {
      immutable: false,
    });
  });
};
