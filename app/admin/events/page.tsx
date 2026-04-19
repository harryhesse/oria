import prisma from "@/lib/prisma";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import EventForm from "@/app/admin/events/_components/event-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Events</h1>
        <Button asChild>
          <Link href="/admin/events/new">Add event</Link>
        </Button>
      </div>

      <DataTable columns={columns} data={events} />
    </div>
  );
}
