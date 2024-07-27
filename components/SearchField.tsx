"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchField() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
      params.set("page", "1");
      params.set("sort", "asc");
    } else {
      params.delete("query");
      params.delete("page");
      params.delete("sort");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <>
      <Label htmlFor='search' className='sr-only'>
        Search
      </Label>
      <Input
        id='search'
        name='search'
        placeholder='Search...'
        className='px-4'
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
      />
    </>
  );
}
