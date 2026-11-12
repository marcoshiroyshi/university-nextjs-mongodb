
import { clientPromise } from "@/lib/mongodb";

export type Student = {
  student_id: number;
  first_name: string;
  last_name: string;
  email: string;
  enrollment_date: string;
};

export async function getStudentById(id: number) {
  const client = await clientPromise;

  const db = client.db(process.env.MONGODB_DB);

  const student = await db
    .collection<Student>("students")
    .findOne({ student_id: id });

  return student;
}
