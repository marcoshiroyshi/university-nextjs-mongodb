
import { NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;

    const db = client.db(
      process.env.MONGODB_DB
    );

    const students = await db
      .collection("students")
      .find({})
      .limit(50)
      .toArray();

    return NextResponse.json(students);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao buscar alunos" },
      { status: 500 }
    );
  }
}
