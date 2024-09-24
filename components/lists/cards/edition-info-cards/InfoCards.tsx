import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InfoCard({
  label,
  children,
  badgeClassName,
}: {
  label: string;
  children: React.ReactNode;
  badgeClassName?: string | null;
}) {
  return (
    <Card className="flex flex-col justify-between gap-4 *:p-0 p-6">
      <CardHeader>
        <CardTitle className="text-[16px] text-center">{label}</CardTitle>
      </CardHeader>
      <CardContent className="flex place-content-center">
        <Badge
          variant="secondary"
          className={`w-full flex items-center justify-center gap-2 font-bold border-2 py-[6px] hover:bg-secondary text-lg text-[16px] ${
            badgeClassName || ""
          }`}
        >
          {children}
        </Badge>
      </CardContent>
    </Card>
  );
}
