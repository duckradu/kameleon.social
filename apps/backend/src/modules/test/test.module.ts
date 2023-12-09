import { FastifyInstance } from "fastify";

export default async function (instance: FastifyInstance) {
  instance.route({
    url: "/",
    method: "GET",
    handler: async () => {
      return { hello: "world" };
    },
  });
}
