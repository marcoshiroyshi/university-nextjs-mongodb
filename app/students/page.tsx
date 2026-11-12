
import { Suspense } from "react";
import { clientPromise } from "@/lib/mongodb";
import { connection } from "next/server";
import Link from "next/link";

type Student = {
  student_id: number;
  first_name: string;
  last_name: string;
  email: string;
  enrollment_date: string;
};

async function StudentsTable() {

    await connection();
  const client = await clientPromise;

  const db = client.db(process.env.MONGODB_DB);

  const students = await db
    .collection<Student>("students")
    .find({})
    .sort({ student_id: 1 })
    .toArray();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nome</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Matrícula</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr
              key={student.student_id}
              className="border-b"
            >
              
            <td className="p-3">
              <Link
                href={`/students/${student.student_id}`}
                className="text-blue-500 hover:underline"
              >
                {student.first_name} {student.last_name}
              </Link>
            </td>


              <td className="p-3">
                {student.first_name}{" "}
                {student.last_name}
              </td>

              <td className="p-3">
                {student.email}
              </td>

              <td className="p-3">
                {new Date(
                  student.enrollment_date
                ).toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function StudentsPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Alunos cadastrados
      </h1>

      <Suspense fallback={<p>Carregando alunos...</p>}>
        <StudentsTable />
      </Suspense>
    </main>
  );
}
