"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

import { useDebouncedCallback } from "use-debounce";

export default function SearchFieldComponent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
      params.set("page", "1");
      // params.set("sortDir", "asc");
      // params.set("sortField", defaultSortField);
    } else {
      params.delete("query");
      params.delete("page");
      // params.delete("sortDir");
      // params.delete("sortField");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="flex-auto">
      <Label htmlFor="search" className="sr-only">
        Search
      </Label>
      <Input
        id="search"
        name="search"
        placeholder="Search..."
        className="px-4 bg-primary/50 placeholder:text-white  text-white"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
      />
    </div>
  );
}
