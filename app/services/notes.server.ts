import { db, notes, type Note, type NewNote } from "~/db/schema";
import { sql, desc, eq, getTableColumns } from "drizzle-orm";

export async function createNote(data: NewNote): Promise<Note> {
    const [note] = await db.insert(notes).values(data).returning()
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
  { limit = 10 }: { limit?: number } = {},
  page:number
): Promise<{ notes: Note[],count:number }> {
  // const notesList = await db
  //   .select()
  //   .from(notes)
  //   .where(sql`${notes.userId} = ${userId}`)
  //   .orderBy(desc(notes.createdAt))
  //   .limit(limit);

  // const filteredNotes = db
  //   .$with("filtered_notes")
  //   .as(db.select().from(notes).where(eq(notes.userId, userId)));

  // Step 2: Query with pagination and count
  // Get total count
  const [{ count }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(notes)
    .where(sql`${notes.userId} = ${userId}`);

  // Get paginated data
  const result = await db
    .select(getTableColumns(notes))
    .from(notes)
    .where(sql`${notes.userId} = ${userId}`)
    .orderBy(desc(notes.createdAt))
    .limit(limit)
    .offset((page||1 -1) * limit);
  
  console.log("result", result);
  return {
    notes: result,
    count
  };
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
