import { z } from "zod";
import { router, publicProcedure } from "../server.js";
import { users } from "@blob/db/schema";
import { authRouter } from "./auth.js";

// example test router
export const appRouter = router({
  auth: authRouter,
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name ?? "World"}!`,
      };
    }),

  getTime: publicProcedure.query(() => {
    return {
      time: new Date().toISOString(),
    };
  }),

  echo: publicProcedure
    .input(z.object({ message: z.string() }))
    .mutation(({ input }) => {
      return {
        message: input.message,
      };
    }),
  testDB: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(users);
  }),
});

export type AppRouter = typeof appRouter;
