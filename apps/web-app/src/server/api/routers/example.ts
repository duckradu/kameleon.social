import { createTRPCRouter, publicProcedure } from "../utils";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return "hello world++";
  }),
});
