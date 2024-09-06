"use client";

import { usePathname, useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

export default function PaginationComponent({
  totalPages,
}: {
  totalPages: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* {currentPage > 1 && ( */}
        <PaginationItem>
          <Button
            variant='ghost'
            asChild
            disabled={!(currentPage > 1)}
            className={
              !(currentPage > 1)
                ? "cursor-not-allowed text-gray-500 hover:text-gray-500"
                : "cursor-pointer hover:bg-primary/20 hover:text-primary"
            }
          >
            <PaginationPrevious
              href={currentPage > 1 ? createPageURL(currentPage - 1) : ""}
            />
          </Button>
        </PaginationItem>
        {/* )} */}
        {totalPages > 1 &&
          Array.from({ length: totalPages }).map((_, a) => (
            <PaginationItem key={a + 1}>
              <PaginationLink
                href={createPageURL(a + 1)}
                isActive={currentPage - 1 === a}
                className={
                  currentPage - 1 === a
                    ? "bg-primary text-secondary hover:bg-primary hover:text-secondary"
                    : "hover:bg-primary/20 hover:text-primary"
                }
              >
                {a + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        {/* {currentPage < totalPages && ( */}
        <PaginationItem>
          <Button
            variant='ghost'
            asChild
            disabled={!(currentPage < totalPages)}
            className={
              !(currentPage < totalPages)
                ? "cursor-not-allowed text-gray-500 hover:text-gray-500"
                : "cursor-pointer hover:bg-primary/20 hover:text-primary"
            }
          >
            <PaginationNext
              href={
                currentPage < totalPages ? createPageURL(currentPage + 1) : ""
              }
            />
          </Button>
        </PaginationItem>
        {/* )} */}
      </PaginationContent>
    </Pagination>
  );
}
