// Complete app/routes/notes._index.tsx with pagination
import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { NotesGrid } from "~/components/notes/notes-grid";
import { NoteForm } from "~/components/notes/note-form";
import { SearchBar } from "~/components/notes/search-bar";
import { Pagination, PaginationInfo } from "~/components/notes/pagination";
import { usePagination } from "~/hooks/use-pagination";
import { requireUserId } from "~/services/session.server";
import { createNote, getNotesByUserId } from "~/services/notes.server";
import { useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/components/ui/page-header";
import { Separator } from "~/components/ui/separator";
import { noteSchema } from "~/schemas/notes";
import { NotesGridSkeleton } from "~/components/notes/note-skeleton";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const query = url.searchParams.get("search") ?? "";
  const limit = 12;

  const { notes, count } = await getNotesByUserId(
    userId,
    { limit },
    query,
    page
  );
  const totalPages = Math.ceil(count / limit);
  console.log("totla pages", notes.length, totalPages, count, page);
  return json({
    notes,
    searchQuery: query,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: count,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const formData = await request.formData();
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const result = noteSchema.safeParse(data);

  if (!result.success) {
    return json(
      {
        success: false,
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  try {
    const note = await createNote({
      ...result.data,
      userId,
    });
    return json({ success: true, note });
  } catch (error) {
    console.error("Failed to create note:", error);
    return json({ error: "Failed to create note" }, { status: 500 });
  }
}

export default function NotesIndexPage() {
  const { notes, searchQuery, pagination } = useLoaderData<typeof loader>();
  const { goToPage } = usePagination();
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  const isSearching = !!searchQuery;

  return (
    <div className="h-full min-h-screen bg-background">
      <div className="container px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto space-y-8">
          <PageHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <PageHeaderHeading>Notes</PageHeaderHeading>
                <PageHeaderDescription>
                  {isSearching
                    ? `Search results for "${searchQuery}"`
                    : "Manage your notes and thoughts in one place."}
                </PageHeaderDescription>
              </div>
              <Button
                onClick={() => {
                  setIsOpen(true);
                }}
                disabled={isLoading}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Note
              </Button>
            </div>
          </PageHeader>

          <Separator />

          {/* Search Bar and Pagination Info */}
          <div className="flex items-center justify-between">
            <SearchBar />
            {pagination.totalItems > 0 && (
              <PaginationInfo
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
              />
            )}
          </div>

          {/* Create Note Form */}
          {isOpen ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Create Note</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </CardHeader>
              <CardContent>
                <NoteForm
                  onSuccess={() => {
                    setIsOpen(false);
                  }}
                />
              </CardContent>
            </Card>
          ) : null}

          {/* Notes Display */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isSearching ? "Search Results" : "Your Notes"}
              </CardTitle>
              <CardDescription>
                {isSearching
                  ? `Results matching "${searchQuery}" (${pagination.totalItems} found)`
                  : "A list of all your notes. Click on a note to view its details."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notes Grid */}
              {isLoading ? (
                <NotesGridSkeleton />
              ) : (
                <NotesGrid
                  notes={notes}
                  emptyMessage={
                    isSearching
                      ? `No notes found matching "${searchQuery}". Try different keywords.`
                      : "No notes found. Create your first note!"
                  }
                />
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex flex-col items-center space-y-4">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={goToPage}
                  />
                  <div className="text-xs text-muted-foreground">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
