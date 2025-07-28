// app/components/ui/pagination.tsx
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: number; // How many page numbers to show around current page
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = 3,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Calculate which page numbers to show
  const getVisiblePages = () => {
    const delta = Math.floor(showPageNumbers / 2);
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, currentPage + delta);

    // Adjust if we're near the beginning or end
    if (end - start + 1 < showPageNumbers) {
      if (start === 1) {
        end = Math.min(totalPages, start + showPageNumbers - 1);
      } else if (end === totalPages) {
        start = Math.max(1, end - showPageNumbers + 1);
      }
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = visiblePages[0] > 2;
  const showEndEllipsis =
    visiblePages[visiblePages.length - 1] < totalPages - 1;

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
    >
      <div className="flex flex-row items-center space-x-1">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Go to previous page</span>
        </Button>

        {/* First page */}
        {visiblePages[0] > 1 && (
          <Button
            variant={1 === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(1)}
            className="h-8 w-8 p-0"
          >
            1
          </Button>
        )}

        {/* Start ellipsis */}
        {showStartEllipsis && (
          <span className="flex h-8 w-8 items-center justify-center">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More pages</span>
          </span>
        )}

        {/* Visible page numbers */}
        {visiblePages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            disabled={page === currentPage}
            className="h-8 w-8 p-0"
          >
            {page}
          </Button>
        ))}

        {/* End ellipsis */}
        {showEndEllipsis && (
          <span className="flex h-8 w-8 items-center justify-center">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More pages</span>
          </span>
        )}

        {/* Last page */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <Button
            variant={totalPages === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className="h-8 w-8 p-0"
          >
            {totalPages}
          </Button>
        )}

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Go to next page</span>
        </Button>
      </div>
    </nav>
  );
}

// Simple pagination info component
export function PaginationInfo({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  className,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}) {
  const startItem = currentPage * itemsPerPage - itemsPerPage + 1;

  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  console.log("endIt3em", endItem, currentPage, itemsPerPage);
  return (
    <div className={cn("text-sm text-muted-foreground", className)}>
      Showing {startItem} to {endItem} of {totalItems} results
    </div>
  );
}
