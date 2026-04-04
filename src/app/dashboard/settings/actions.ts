"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function updateDisplayName(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const displayName = formData.get("displayName") as string;

  await pool.query(
    `UPDATE profiles SET name = $1 WHERE id = $2`,
    [displayName, session.user.id]
  );

  return { success: "Display name updated" };
}

export async function changePassword(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const newPassword = formData.get("newPassword") as string;
  const hashed = await bcrypt.hash(newPassword, 10);

  await pool.query(
    `UPDATE users SET password = $1 WHERE id = $2`,
    [hashed, session.user.id]
  );

  return { success: "Password updated" };
}

export async function deleteAccount() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  await pool.query(`DELETE FROM users WHERE id = $1`, [session.user.id]);

  return { success: "Account deleted" };
}

export async function updateLecturerPreferences() {
  return { success: "Preferences saved (demo)" };
}

export async function exportMyData() {
  return { message: "Export feature coming soon." };
}