import { Link, useFetcher } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { type Note } from "~/db/schema";
import { formatRelativeTime } from "~/utils/date";
import { StarIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { cn } from "~/lib/utils";

type SerializedNote = Omit<Note, "createdAt"> & { createdAt: string };

interface NoteCardProps {
  note: SerializedNote;
}

export function NoteCard({ note }: NoteCardProps) {
  const fetcher = useFetcher();

  // Get the current favorite status (optimistic updates)
  const isFavorite = fetcher.formData
    ? fetcher.formData.get("action") === "toggle"
      ? !note.isFavorite // Optimistically flip the status
      : note.isFavorite
    : note.isFavorite;

  const isLoading = fetcher.state === "submitting";

  return (
    <Card
      className={cn(
        "flex h-full flex-col transition-all duration-200",
        isFavorite &&
          "ring-2 ring-yellow-400/20 bg-yellow-50/50 dark:bg-yellow-950/10"
      )}
    >
      <CardHeader className="flex-none">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 flex-1">
            <Link to={`/notes/${note.id}`} className="hover:underline">
              {note.title}
            </Link>
          </CardTitle>

          {/* Favorite Button using fetcher.Form - Cookies included automatically */}
          <fetcher.Form method="post" action={`/api/notes/${note.id}/favorite`}>
            <input type="hidden" name="action" value="toggle" />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 shrink-0"
              disabled={isLoading}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? (
                <StarFilledIcon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isLoading ? "text-gray-400" : "text-yellow-500"
                  )}
                />
              ) : (
                <StarIcon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isLoading
                      ? "text-gray-400"
                      : "text-gray-600 hover:text-yellow-500"
                  )}
                />
              )}
            </Button>
          </fetcher.Form>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {note.description || ""}
        </p>
      </CardContent>

      <CardFooter className="flex-none border-t pt-4">
        <div className="flex items-center justify-between w-full">
          <p className="text-xs text-muted-foreground">
            {formatRelativeTime(note.createdAt)}
          </p>

          {/* Favorite Badge */}
          {isFavorite && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
              <StarFilledIcon className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
              <span className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                Favorite
              </span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
