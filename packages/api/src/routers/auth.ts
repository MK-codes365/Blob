import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { oauthAccounts, users } from "@blob/db/schema";

import { router, publicProcedure } from "../server.js";
import {
  issueAppSessionToken,
  verifyAppSessionToken,
  verifyGoogleIdToken,
} from "../auth.js";

export const authRouter = router({
  googleSignIn: publicProcedure
    .input(z.object({ idToken: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const google = await verifyGoogleIdToken(input.idToken);

      const existingAccount = await ctx.db
        .select()
        .from(oauthAccounts)
        .where(
          and(
            eq(oauthAccounts.providerId, "google"),
            eq(oauthAccounts.providerUserId, google.providerUserId)
          )
        )
        .limit(1);

      let user = undefined as undefined | typeof users.$inferSelect;

      if (existingAccount.length > 0) {
        const existingUser = await ctx.db
          .select()
          .from(users)
          .where(eq(users.id, existingAccount[0]!.userId))
          .limit(1);

        user = existingUser[0];
      }

      if (!user) {
        const existingByEmail = await ctx.db
          .select()
          .from(users)
          .where(eq(users.email, google.email))
          .limit(1);

        user = existingByEmail[0];
      }

      if (!user) {
        const inserted = await ctx.db
          .insert(users)
          .values({
            email: google.email,
            name: google.name ?? google.email.split("@")[0] ?? "Blob user",
            image: google.picture,
          })
          .returning();

        user = inserted[0];
      } else {
        if (
          (google.name && user.name !== google.name) ||
          (google.picture && user.image !== google.picture)
        ) {
          const updated = await ctx.db
            .update(users)
            .set({
              name: google.name ?? user.name,
              image: google.picture ?? user.image,
              updatedAt: new Date(),
            })
            .where(eq(users.id, user.id))
            .returning();
          user = updated[0] ?? user;
        }
      }

      await ctx.db
        .insert(oauthAccounts)
        .values({
          userId: user.id,
          providerId: "google",
          providerUserId: google.providerUserId,
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [oauthAccounts.providerId, oauthAccounts.providerUserId],
          set: {
            userId: user.id,
            lastLoginAt: new Date(),
            updatedAt: new Date(),
          },
        });

      const sessionToken = await issueAppSessionToken({
        sub: user.id,
        email: user.email,
        name: user.name,
        picture: user.image ?? undefined,
      });

      return {
        sessionToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.image,
        },
      };
    }),

  me: publicProcedure.query(async ({ ctx }) => {
    const authHeader = ctx.authHeader;
    if (!authHeader) {
      return { user: null };
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : authHeader;

    try {
      const session = await verifyAppSessionToken(token);
      const dbUser = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, session.userId))
        .limit(1);
      const user = dbUser[0];
      if (!user) {
        return { user: null };
      }
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.image,
        },
      };
    } catch {
      return { user: null };
    }
  }),
});
