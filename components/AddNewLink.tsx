import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AddNewLink({
  href,
  label = "Add New",
  width = "min-w-44",
}: {
  href: string;
  label?: string;
  width?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "ml-auto flex items-center gap-2 text-sm border border-outline p-2 rounded-sm hover:bg-primary/10 transition duration-200",
        width
      )}
    >
      <Plus className='size-5' />
      <span className='self-center'>{label}</span>
    </Link>
  );
}
