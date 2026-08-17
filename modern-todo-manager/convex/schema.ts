import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()), // timestamp
    priority: v.union(v.literal("Low"), v.literal("Medium"), v.literal("High")),
    completed: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).searchIndex("search_title", {
    searchField: "title",
  }),
});
