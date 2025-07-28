import { json, type ActionFunctionArgs } from "@remix-run/node";
import { toggleNoteFavorite } from "~/services/notes.server";
import { requireUserId } from "~/utils/session.server";

export async function action({ request, params }: ActionFunctionArgs) {
  console.log("on action", request);
  const cookieHeader = request.headers.get("cookie");
  console.log("🍪 Cookie Header:", cookieHeader);
  if (request.method !== "POST") {
    return json(
      {
        success: false,
        error: "Method is not allowed",
      },
      { status: 405 }
    );
  }
  try {
    const userId = await requireUserId(request);
    const noteId = parseInt(params.id || "", 10);
    if (isNaN(noteId)) {
      return json(
        {
          success: false,
          error: "Invalid note ID",
        },
        { status: 400 }
      );
    }

    const updatedNote = await toggleNoteFavorite(noteId, userId);
    if (!updatedNote) {
      return json(
        {
          success: false,
          error: "Note not found or access denied",
        },
        { status: 404 }
      );
    }

    return json({
      success: true,
      data: {
        note: updatedNote,
      },
      message: updatedNote.isFavorite
        ? "Note added to favorites"
        : "Note removed from favorites",
    });
  } catch (error) {
    console.error("API notes id favorite : Failed to toggle favorite:", error);

    // Handle authentication errors
    if (error instanceof Response && error.status === 401) {
      return json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    return json(
      {
        success: false,
        error: "Failed to update favorite status",
      },
      { status: 500 }
    );
  }
}
