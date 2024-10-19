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
import { paginate } from "@/lib/paginate";

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

  const pagination = paginate(totalPages, currentPage);

  return (
    <>
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent className="ml-auto">
            <PaginationItem>
              <Button
                variant="ghost"
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
            {totalPages > 1 &&
              pagination.map((page) => (
                <>
                  {page === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href={createPageURL(page)}
                        isActive={currentPage === page}
                        className={
                          currentPage === page
                            ? "bg-primary text-secondary hover:bg-primary hover:text-secondary"
                            : "hover:bg-primary/20 hover:text-primary"
                        }
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                </>
              ))}
            <PaginationItem>
              <Button
                variant="ghost"
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
                    currentPage < totalPages
                      ? createPageURL(currentPage + 1)
                      : ""
                  }
                />
              </Button>
            </PaginationItem>
            {/* )} */}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
