// @ts-nocheck
import { query, mutation } from "./generated/server";
import { v } from "convex/values";

export const getTodos = query({
  args: {
    filter: v.optional(v.union(v.literal("All"), v.literal("Active"), v.literal("Completed"))),
    sort: v.optional(v.union(v.literal("Newest First"), v.literal("Oldest First"))),
  },
  handler: async (ctx, args) => {
    let todos = await ctx.db.query("todos").collect();

    // Apply filtering
    if (args.filter === "Active") {
      todos = todos.filter((todo) => !todo.completed);
    } else if (args.filter === "Completed") {
      todos = todos.filter((todo) => todo.completed);
    }

    // Apply sorting
    if (args.sort === "Oldest First") {
      todos.sort((a, b) => a.createdAt - b.createdAt);
    } else {
      // Default to Newest First
      todos.sort((a, b) => b.createdAt - a.createdAt);
    }

    return todos;
  },
});

export const getTodoById = query({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const searchTodos = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("todos")
      .withSearchIndex("search_title", (q) => q.search("title", args.searchTerm))
      .collect();
  },
});

export const createTodo = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    priority: v.union(v.literal("Low"), v.literal("Medium"), v.literal("High")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("todos", {
      title: args.title,
      description: args.description,
      dueDate: args.dueDate,
      priority: args.priority,
      completed: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    priority: v.union(v.literal("Low"), v.literal("Medium"), v.literal("High")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const toggleComplete = mutation({
  args: {
    id: v.id("todos"),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      completed: args.completed,
      updatedAt: Date.now(),
    });
  },
});
