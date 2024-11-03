import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

import { TableHeadProps } from "@/types";

export default function StandingTableHeader({
  values,
}: {
  values: TableHeadProps[];
}) {
  return (
    <TableHeader>
      <TableRow className="dashboard-head-table-row">
        {values.map((val, idx) => (
          <TableHead key={idx} className={val.className}>
            {val.labels.map((lbl, idx) => (
              <span key={idx} className={lbl.className ? lbl.className : ""}>
                {lbl.name}
              </span>
            ))}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
