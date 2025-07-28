import { useNavigate, useSearchParams } from "@remix-run/react";
import { useCallback } from "react";

export function usePagination() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams();

      if (searchQuery) {
        params.set("search", searchQuery);
      }

      if (page > 1) {
        params.set("page", page.toString());
      }

      const search = params.toString();
      navigate(`/notes${search ? `?${search}` : ""}`, { replace: true });
    },
    [navigate, searchQuery]
  );

  return {
    currentPage,
    searchQuery,
    goToPage,
  };
}
