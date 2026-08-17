"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
// @ts-ignore
import { api } from "../../convex/_generated/api";
import { TodoCard } from "./TodoCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { Todo } from "@/types";

export function TodoList() {
  const [filter, setFilter] = useState<"All" | "Active" | "Completed">("All");
  const [sort, setSort] = useState<"Newest First" | "Oldest First">("Newest First");
  const [searchTerm, setSearchTerm] = useState("");

  const searchResults = useQuery(api.todos.searchTodos, searchTerm ? { searchTerm } : "skip");
  const todosList = useQuery(api.todos.getTodos, { filter, sort });

  const todos = (searchTerm && searchResults ? searchResults : todosList) as Todo[] | undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search todos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={filter} onValueChange={(val) => setFilter(val as any)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(val) => setSort(val as any)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Newest First">Newest First</SelectItem>
              <SelectItem value="Oldest First">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {todos === undefined ? (
          <div className="text-center py-12 text-muted-foreground">Loading todos...</div>
        ) : todos.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <h3 className="text-lg font-medium">No todos found</h3>
            <p className="text-muted-foreground mt-1">Get started by creating a new todo.</p>
          </div>
        ) : (
          todos.map((todo) => <TodoCard key={todo._id} todo={todo} />)
        )}
      </div>
    </div>
  );
}
