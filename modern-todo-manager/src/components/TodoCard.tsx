"use client";

import { Todo } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Clock, MoreVertical, Pencil, Trash } from "lucide-react";
import { format } from "date-fns";
import { useMutation } from "convex/react";
// @ts-ignore
import { api } from "../../convex/_generated/api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";
// @ts-ignore
import { Id } from "../../convex/_generated/dataModel";

interface TodoCardProps {
  todo: Todo;
}

export function TodoCard({ todo }: TodoCardProps) {
  const toggleComplete = useMutation(api.todos.toggleComplete);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  const handleToggle = async () => {
    try {
      await toggleComplete({ id: todo._id as Id<"todos">, completed: !todo.completed });
      toast.success(todo.completed ? "Todo marked as active" : "Todo marked as completed");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this todo?")) {
      try {
        await deleteTodo({ id: todo._id as Id<"todos"> });
        toast.success("Todo deleted successfully");
      } catch (error) {
        toast.error("Failed to delete todo");
      }
    }
  };

  const priorityColors = {
    Low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <Card className={`transition-all ${todo.completed ? "opacity-60" : ""}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-start gap-3">
          <button onClick={handleToggle} className="mt-1 text-muted-foreground hover:text-primary transition-colors">
            {todo.completed ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>
          <div>
            <CardTitle className={`text-lg font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
              {todo.title}
            </CardTitle>
            {todo.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{todo.description}</p>
            )}
          </div>
        </div>
        <DropdownMenu>
          {/* @ts-expect-error React 19 type issue */}
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="-mr-2">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* @ts-expect-error React 19 type issue */}
            <DropdownMenuItem asChild>
              <Link href={`/edit/${todo._id}`} className="cursor-pointer flex items-center">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600 cursor-pointer focus:text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mt-4">
          <Badge variant="secondary" className={`${priorityColors[todo.priority]} hover:${priorityColors[todo.priority]}`}>
            {todo.priority}
          </Badge>
          {todo.dueDate && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {format(todo.dueDate, "PPP")}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
