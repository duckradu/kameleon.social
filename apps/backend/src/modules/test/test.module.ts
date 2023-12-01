import { type FastifyInstance } from "fastify";

export default async function (instance: FastifyInstance) {
  instance.get("/", () => {
    return { hello: "world" };
  });
}
