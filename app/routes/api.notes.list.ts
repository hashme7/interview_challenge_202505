import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { requireAuthApi } from "~/middleware/auth";
import { getNotesByUserId } from "~/services/notes.server";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log("on loader api notes. list....");
  // Ensure user is authenticated
  const { userId } = await requireAuthApi(request);

  try {
    const { notes } = await getNotesByUserId(userId, { limit: 12 }, 1);

    return json({
      success: true,
      notes,
    });
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}
