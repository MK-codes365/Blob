import { pgTable, uuid, timestamp, index, jsonb } from "drizzle-orm/pg-core";
import { topics } from "./topics";

export const mindMaps = pgTable("mind_maps", {
        id: uuid("id").defaultRandom().primaryKey(),
        topicId: uuid("topic_id")
            .notNull()
            .references(() => topics.id, { onDelete: "cascade" }),
        data: jsonb("json").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => ({
        topicIdx: index("mind_maps_topic_id_idx").on(table.topicId)
    })
);

export type MindMap = typeof mindMaps.$inferSelect;
export type NewMindMap = typeof mindMaps.$inferInsert;
