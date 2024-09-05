import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import PaginationComponent from "@/components/PaginationComponent";

export default function DashboardTableFooter({
  totalPages,
  colSpan,
}: {
  totalPages: number;
  colSpan: number;
}) {
  return (
    <>
      {totalPages > 1 && (
        <TableFooter>
          <TableRow className='border-t-[1px] border-t-primary/10'>
            <TableCell colSpan={colSpan}>
              <PaginationComponent totalPages={totalPages} />
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </>
  );
}
