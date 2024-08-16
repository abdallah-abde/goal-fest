import { columns } from "./columns";

import { DataTable } from "./data-table";
import prisma from "@/lib/db";

interface props {
  id: number;
  groupName: string;
  tournamentEditionId: number;
  tournamentName: string;
  editionYear: number;
}

async function getData(): Promise<props[]> {
  const groups = await prisma.group.findMany({
    select: {
      id: true,
      name: true,
      tournamentEditionId: true,
      tournamentEdition: {
        select: {
          year: true,
          tournament: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return groups.map((a) => {
    return {
      id: a.id,
      groupName: a.name,
      tournamentEditionId: a.tournamentEditionId,
      tournamentName: a.tournamentEdition.tournament.name,
      editionYear: a.tournamentEdition.year,
    };
  });
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
