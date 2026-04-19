"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { deleteEvent } from "../_actions/events";
import { PencilIcon } from "lucide-react";
import Link from "next/link";

export type Event = {
  id: string;
  title: string;
  location: string | null;
  date: string;
  price: number;
  capacity: number | null;
};

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return new Date(row.original.date).toISOString().split("T")[0];
    },
  },
  {
    accessorKey: "price",
    header: "Price (€)",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return price / 100;
    },
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const event = row.original;

      return (
        <Button variant={"ghost"} asChild>
          <Link href={`/admin/events/${row.original.id}/edit`}>
            <PencilIcon />
            Edit
          </Link>
        </Button>
      );
    },
  },
];
