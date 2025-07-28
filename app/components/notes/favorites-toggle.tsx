import { useNavigate, useSearchParams } from "@remix-run/react";
import { Star } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface FavoritesToggleProps {
  className?: string;
}

export function FavoritesToggle({ className }: FavoritesToggleProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const showFavoritesOnly = searchParams.get("favorites") === "true";
  const searchQuery = searchParams.get("search") || "";

  const handleToggle = () => {
    const params = new URLSearchParams();

    // Preserve search query
    if (searchQuery) {
      params.set("search", searchQuery);
    }

    // Toggle favorites filter
    if (!showFavoritesOnly) {
      params.set("favorites", "true");
    }
    // If currently showing favorites, remove the param (show all)

    // Reset to page 1 when toggling
    const search = params.toString();
    navigate(`/notes${search ? `?${search}` : ""}`, { replace: true });
  };

  return (
    <Button
      variant={showFavoritesOnly ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      className={cn("flex items-center gap-2", className)}
    >
      <Star
        className={cn("h-4 w-4", showFavoritesOnly ? "fill-current" : "")}
      />
      {showFavoritesOnly ? "Show All" : "Favorites Only"}
    </Button>
  );
}
