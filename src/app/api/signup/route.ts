// src/app/api/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 10);

    const res = await pool.query(
      "INSERT INTO profiles (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id",
      [email, hash, name || null]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.code === "23505") { // Unique violation (email exists)
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}