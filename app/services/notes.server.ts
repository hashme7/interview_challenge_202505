import { db, notes, type Note, type NewNote } from "~/db/schema";
import { sql, desc, eq, getTableColumns, and } from "drizzle-orm";

export async function createNote(data: NewNote): Promise<Note> {
  const [note] = await db.insert(notes).values(data).returning();
  return note;
}

export async function getNoteById(id: number): Promise<Note | null> {
  const [note] = await db
    .select()
    .from(notes)
    .where(sql`${notes.id} = ${id}`);
  return note || null;
}

export async function getNotesByUserId(
  userId: number,
  { limit = 12 }: { limit?: number } = {},
  query: string,
  page: number = 1,
  showFavoriteOnly: boolean
): Promise<{ notes: Note[]; count: number }> {
  const offset = page * limit - limit;

  const searchFilter = query
    ? sql`(${notes.title} ILIKE ${"%" + query + "%"})`
    : undefined;
  const favoriteFilter = showFavoriteOnly
    ? sql`${notes.isFavorite} = true`
    : undefined;

  const whereClause = and(
    sql`${notes.userId} = ${userId}`,
    searchFilter,
    favoriteFilter
  );

  const [{ count }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(notes)
    .where(whereClause);

  // Get paginated data
  const result = await db
    .select(getTableColumns(notes))
    .from(notes)
    .where(whereClause)
    .orderBy(desc(notes.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    notes: result,
    count,
  };
}

export async function toggleNoteFavorite(
  noteId: number,
  userId: number
): Promise<Note | null> {
  const existingNote = await db
    .select()
    .from(notes)
    .where(sql`${notes.id} = ${noteId} AND ${notes.userId} = ${userId}`)
    .limit(1);

  if (existingNote.length === 0) {
    return null; // Note not found or doesn't belong to user
  }

  // Toggle the favorite status
  const [updatedNote] = await db
    .update(notes)
    .set({
      isFavorite: sql`NOT ${notes.isFavorite}`, // Toggle the boolean value
    })
    .where(sql`${notes.id} = ${noteId} AND ${notes.userId} = ${userId}`)
    .returning();

  return updatedNote || null;
}

export async function updateNote(
  id: number,
  userId: number,
  data: Partial<NewNote>
): Promise<Note | null> {
  const [note] = await db
    .update(notes)
    .set(data)
    .where(sql`${notes.id} = ${id} AND ${notes.userId} = ${userId}`)
    .returning();
  return note || null;
}

export async function deleteNote(id: number, userId: number): Promise<boolean> {
  const [note] = await db
    .delete(notes)
    .where(sql`${notes.id} = ${id} AND ${notes.userId} = ${userId}`)
    .returning();
  return !!note;
}
