"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "convex/react";
// @ts-ignore
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Todo, Priority } from "@/types";
// @ts-ignore
import { Id } from "../../convex/_generated/dataModel";

interface TodoFormProps {
  initialData?: Todo;
}

export function TodoForm({ initialData }: TodoFormProps) {
  const router = useRouter();
  const createTodo = useMutation(api.todos.createTodo);
  const updateTodo = useMutation(api.todos.updateTodo);

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [priority, setPriority] = useState<Priority>(initialData?.priority || "Medium");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setLoading(true);
    try {
      if (initialData) {
        await updateTodo({
          id: initialData._id as Id<"todos">,
          title,
          description,
          priority,
        });
        toast.success("Todo updated successfully");
      } else {
        await createTodo({
          title,
          description,
          priority,
        });
        toast.success("Todo created successfully");
      }
      router.push("/");
    } catch (error) {
      toast.error("Failed to save todo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto mt-8 shadow-sm">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Todo" : "Create Todo"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(val) => setPriority(val as Priority)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/")} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Todo"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
