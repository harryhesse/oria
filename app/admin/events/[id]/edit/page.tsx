import prisma from "@/lib/prisma";
import EditEvent from "../../_components/edit-event";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({ where: { id } });
  return (
    <>
      <h1>Add Event</h1>
      <EditEvent event={event} />
    </>
  );
}
