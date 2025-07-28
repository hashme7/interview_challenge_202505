import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { requireAuthApi } from "~/middleware/auth";
import { getNotesByUserId } from "~/services/notes.server";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log("on loader api notes. list....");
  // Ensure user is authenticated
  const { userId } = await requireAuthApi(request);
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const query = url.searchParams.get("search") ?? "";
  const showFavoritesOnly = url.searchParams.get("favorites") === "true";
  const limit = 12;
  try {
    const { notes, count } = await getNotesByUserId(
      userId,
      { limit },
      query,
      page,
      showFavoritesOnly
    );
    const totalPages = Math.ceil(count / limit);
    return json({
      notes,
      searchQuery: query,
      showFavoritesOnly,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}
