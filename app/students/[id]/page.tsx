
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getStudentById } from "@/lib/students";

type StudentDetailsProps = {
  params: Promise<{ id: string }>;
};

async function StudentDetails({
  params,
}: StudentDetailsProps) {
  await connection();

  const { id } = await params;
  const studentId = Number(id);

  if (!Number.isSafeInteger(studentId) || studentId <= 0) {
    notFound();
  }

  const student = await getStudentById(studentId);

  if (!student) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link href="/students" className="text-blue-500">
        ← Voltar para alunos
      </Link>

      <h1 className="text-3xl font-bold">
        {student.first_name} {student.last_name}
      </h1>

      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="text-xl font-semibold">
          Informações do aluno
        </h2>

        <p>
          <strong>ID:</strong> {student.student_id}
        </p>

        <p>
          <strong>Email:</strong> {student.email}
        </p>

        <p>
          <strong>Data de matrícula:</strong>{" "}
          {new Date(
            student.enrollment_date
          ).toLocaleDateString("pt-BR", {
            timeZone: "UTC",
          })}
        </p>
      </div>
    </div>
  );
}

export default function StudentPage({
  params,
}: StudentDetailsProps) {
  return (
    <main className="p-8">
      <Suspense fallback={<p>Carregando aluno...</p>}>
        <StudentDetails params={params} />
      </Suspense>
    </main>
  );
}
