"use client";

import { useQuery } from "convex/react";
// @ts-ignore
import { api } from "../../../../convex/_generated/api";
// @ts-ignore
import { Id } from "../../../../convex/_generated/dataModel";
import { TodoForm } from "@/components/TodoForm";
import { use } from "react";

export function EditFormWrapper({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const todo = useQuery(api.todos.getTodoById, { id: resolvedParams.id as Id<"todos"> });

  if (todo === undefined) {
    return <div className="text-center mt-12">Loading...</div>;
  }

  if (todo === null) {
    return <div className="text-center mt-12 text-red-500">Todo not found.</div>;
  }

  return <TodoForm initialData={todo as any} />;
}
