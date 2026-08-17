import { TodoList } from "@/components/TodoList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-4 md:p-8 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modern Todo Manager</h1>
          <p className="text-muted-foreground mt-1">Manage your tasks efficiently.</p>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Todo
            </Button>
          </Link>
        </div>
      </div>
      <TodoList />
    </main>
  );
}
