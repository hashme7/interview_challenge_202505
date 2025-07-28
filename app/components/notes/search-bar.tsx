// app/components/notes/search-bar.tsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { Search, X } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) {
        params.set("search", query.trim());
      }

      if (query.trim()) {
        params.set("page", "1");
      }

      const search = params.toString();
      navigate(`/notes${search ? `?${search}` : ""}`, { replace: true });
    }, 300);

    return () => clearTimeout(timer);
  }, [query, navigate]);

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search notes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-10"
      />
      {query && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </Button>
      )}
    </div>
  );
}
