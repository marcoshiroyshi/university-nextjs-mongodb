
import { clientPromise } from "@/lib/mongodb";

export type StudentRegistration = {
  registration_id: number;
  status: string;
  group_name: string;
  semester: string;
  schedule_time: string;
  location: string;
  module_name: string;
  course_title: string;
  course_code: string;
  professor_name: string;
  grade_value: number | null;
};

export async function getStudentRegistrations(
  studentId: number
): Promise<StudentRegistration[]> {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  return db
    .collection("student_group_registrations")
    .aggregate<StudentRegistration>([
      {
        $match: { student_id: studentId },
      },
      {
        $lookup: {
          from: "class_groups",
          localField: "group_id",
          foreignField: "group_id",
          as: "group",
        },
      },
      {
        $unwind: "$group",
      },
      {
        $lookup: {
          from: "modules",
          localField: "group.module_id",
          foreignField: "module_id",
          as: "module",
        },
      },
      {
        $unwind: "$module",
      },
      {
        $lookup: {
          from: "courses",
          localField: "module.course_id",
          foreignField: "course_id",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $lookup: {
          from: "professors",
          localField: "group.professor_id",
          foreignField: "professor_id",
          as: "professor",
        },
      },
      {
        $unwind: {
          path: "$professor",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "grades",
          localField: "registration_id",
          foreignField: "registration_id",
          as: "grade",
        },
      },
      {
        $unwind: {
          path: "$grade",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          registration_id: 1,
          status: 1,
          group_name: "$group.group_name",
          semester: "$group.semester",
          schedule_time: "$group.schedule_time",
          location: "$group.location",
          module_name: "$module.module_name",
          course_title: "$course.title",
          course_code: "$course.course_code",
          professor_name: {
            $trim: {
              input: {
                $concat: [
                  { $ifNull: ["$professor.first_name", ""] },
                  " ",
                  { $ifNull: ["$professor.last_name", ""] },
                ],
              },
            },
          },
          grade_value: {
            $ifNull: ["$grade.grade_value", null],
          },
        },
      },
      {
        $sort: { registration_id: 1 },
      },
    ])
    .toArray();
}
