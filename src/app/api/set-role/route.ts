// src/app/api/set-role/route.ts
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { role } = await req.json();

    if (!["student", "lecturer"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE profiles 
       SET role = $1, updated_at = NOW() 
       WHERE id = $2 AND role IS NULL 
       RETURNING id, role`,
      [role, session.user.id]
    );

    if (result.rowCount === 0) {
      // Fetch existing role instead of failing
      const existing = await pool.query(
        `SELECT role FROM profiles WHERE id = $1`,
        [session.user.id]
      );

      if (existing.rowCount === 1 && existing.rows[0].role) {
        return NextResponse.json({
          success: true,
          role: existing.rows[0].role,
        });
      }

      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }


    return NextResponse.json({ success: true, role });
  } catch (error) {
    console.error("Set role error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}