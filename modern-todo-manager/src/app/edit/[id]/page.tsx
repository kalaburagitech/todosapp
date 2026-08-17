import { EditFormWrapper } from "./EditFormWrapper";

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="max-w-4xl mx-auto p-4 md:p-8 w-full">
      <EditFormWrapper params={params} />
    </main>
  );
}
