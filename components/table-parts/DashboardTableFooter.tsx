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
          <TableCell colSpan={colSpan}>
            <div className="flex items-center justify-between">
              <p className="text-left py-3 w-1/2">{`Total Rows: ( ${totalCount} )`}</p>
              <div className="w-1/2">
                <PaginationComponent totalPages={totalPages} />
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableFooter>
      {/* )} */}
    </>
  );
}
