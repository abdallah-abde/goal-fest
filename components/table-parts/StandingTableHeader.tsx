import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

interface TableHeadProps {
  labels: Array<{ name: string; className?: string | null }>;
  className: string;
}

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
