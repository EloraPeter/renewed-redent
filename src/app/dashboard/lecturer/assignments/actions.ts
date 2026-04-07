// src/app/dashboard/lecturer/assignments/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import pool from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "assignments");

export async function createAssignment(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'lecturer') {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const courseId = formData.get("courseId") as string;
  const dueDate = formData.get("dueDate") as string;
  const priority = formData.get("priority") as "low" | "medium" | "high";
  const instructions = formData.get("instructions") as string;
  const file = formData.get("file") as File | null;

  let fileUrl: string | null = null;

  if (file && file.size > 0) {
    const ext = path.extname(file.name);
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);
    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(filePath, buffer);
    fileUrl = `/uploads/assignments/${filename}`;
  }

  await pool.query(
    `
    INSERT INTO assignments (user_id, course_id, title, due_date, priority, instructions, file_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
    [session.user.id, courseId, title, dueDate, priority, instructions || null, fileUrl]
  );

  revalidatePath('/dashboard/lecturer', 'page');
  revalidatePath("/dashboard/lecturer/assignments");
  return { success: true };
}

export async function updateAssignmentGrade(assignmentId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'lecturer') {
    throw new Error("Unauthorized");
  }

  const grade = formData.get("grade") as string;
  const feedback = formData.get("feedback") as string;

  await pool.query(
    `
    UPDATE assignments
    SET grade = $1, feedback = $2, graded_at = NOW(), status = 'graded'
    WHERE id = $3 AND user_id = $4
    `,
    [grade || null, feedback || null, assignmentId, session.user.id]
  );

  revalidatePath('/dashboard/lecturer', 'page');
  revalidatePath("/dashboard/lecturer/assignments");
  return { success: true };
}

export async function deleteAssignment(assignmentId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'lecturer') {
    throw new Error("Unauthorized");
  }

  const { rows } = await pool.query(
    "SELECT file_url FROM assignments WHERE id = $1 AND user_id = $2",
    [assignmentId, session.user.id]
  );

  if (rows[0]?.file_url) {
    const filePath = path.join(process.cwd(), "public", rows[0].file_url);
    try {
      await import("fs/promises").then((fs) => fs.unlink(filePath));
    } catch (err) {
      console.warn("File not found or already deleted", err);
    }
  }

  await pool.query(
    "DELETE FROM assignments WHERE id = $1 AND user_id = $2",
    [assignmentId, session.user.id]
  );

  revalidatePath('/dashboard/lecturer', 'page');
  revalidatePath("/dashboard/lecturer/assignments");
  return { success: true };
}