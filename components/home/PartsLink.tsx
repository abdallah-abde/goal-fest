import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function PartsLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Button
      variant="ghost"
      asChild
      className="text-center rounded-none w-full p-0 m-0 border-t-1 border-primary/25 hover:bg-transparent"
    >
      <Link
        href={href}
        className="font-bold flex items-center gap-2 hover:no-underline"
      >
        {label}
        <ChevronRight size="15" />
      </Link>
    </Button>
  );
}
