import prisma from "@/lib/db";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil, Trash2Icon } from "lucide-react";

const DashboardCountriesPage = async () => {
  const countries = await prisma.country.findMany();

  return (
    <>
      <Button variant='default' asChild className='ml-auto block w-fit'>
        <Link href='/dashboard/countries/new'>Add New Country</Link>
      </Button>
      {countries.length > 0 ? (
        <Table className='my-8'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[80%] text-left'>Name</TableHead>
              <TableHead className='w-[10%]'>Edit</TableHead>
              <TableHead className='w-[10%]'>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countries.map((cou) => (
              <TableRow key={cou.id}>
                <TableCell className='text-left font-bold'>
                  {cou.name}
                </TableCell>
                <TableCell>
                  <Button
                    asChild
                    variant='secondary'
                    className='transition duration-200 hover:text-blue-500 '
                  >
                    <Link href={`/dashboard/countries/${cou.id}`}>
                      <Pencil />
                    </Link>
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant='secondary'>
                    <Trash2Icon className='transition duration-200 hover:text-red-500' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No Countries Found</p>
      )}
    </>
  );
};

export default DashboardCountriesPage;
