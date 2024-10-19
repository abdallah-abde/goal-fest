import { TableCell, TableFooter, TableRow } from "@/components/ui/table";
import PaginationComponent from "@/components/table-parts/PaginationComponent";

export default function DashboardTableFooter({
  totalCount,
  totalPages,
  colSpan,
}: {
  totalCount: number;
  totalPages: number;
  colSpan: number;
}) {
  return (
    <>
      {/* {totalPages > 1 && ( */}
      <TableFooter>
        <TableRow className="border-t-[1px] border-t-primary/10">
          <TableCell>
            <p className="text-left py-3">{`Total Rows: ( ${totalCount} )`}</p>
          </TableCell>
          <TableCell colSpan={colSpan - 1}>
            <PaginationComponent totalPages={totalPages} />
          </TableCell>
        </TableRow>
      </TableFooter>
      {/* )} */}
    </>
  );
}
