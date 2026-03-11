// src/app/dashboard/student/assignments/AssignmentList.tsx
"use client";

import toast from "react-hot-toast";
import { markSubmitted, deleteAssignment } from "./actions";
import { format } from "date-fns";

type Assignment = {
  id: string;
  title: string;
  due_date: string;
  priority: string;
  status: string;
  file_url: string | null;
  submitted_at: string | null;
  course_name: string;
};

export default function AssignmentList({ assignments }: { assignments: Assignment[] }) {
  async function handleMarkSubmitted(id: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await markSubmitted(id, form);
      toast.success("Marked as submitted!");
    } catch (err: any) {
      toast.error("Failed to update");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this assignment?")) return;
    try {
      await deleteAssignment(id);
      toast.success("Deleted");
    } catch (err: any) {
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="space-y-4">
      {assignments.length === 0 ? (
        <p className="text-gray-500">No assignments yet. Add one above!</p>
      ) : (
        assignments.map((a) => (
          <div
            key={a.id}
            className={`p-5 rounded-xl border ${
              a.status === "submitted" ? "bg-green-50 dark:bg-green-950/30" : "bg-white dark:bg-gray-800"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {a.course_name} • Due: {format(new Date(a.due_date), "PPP p")}
                </p>
                {a.file_url && (
                  <a
                    href={a.file_url}
                    target="_blank"
                    className="text-pink-600 text-sm hover:underline"
                  >
                    View file
                  </a>
                )}
              </div>

              <div className="flex gap-3">
                {a.status !== "submitted" && (
                  <form onSubmit={(e) => handleMarkSubmitted(a.id, e)}>
                    <input type="file" name="file" className="text-sm mb-1 block" />
                    <button type="submit" className="text-sm bg-green-600 text-white px-3 py-1 rounded">
                      Mark Submitted
                    </button>
                  </form>
                )}

                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-2 text-sm">
              Priority: <span className={a.priority === "high" ? "text-red-600" : ""}>{a.priority}</span> |{" "}
              Status: {a.status}
              {a.submitted_at && ` • Submitted ${format(new Date(a.submitted_at), "PPP")}`}
            </div>
          </div>
        ))
      )}
    </div>
  );
}