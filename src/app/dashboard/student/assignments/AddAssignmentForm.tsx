// src/app/dashboard/student/assignments/AddAssignmentForm.tsx
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { createAssignment } from "./actions";

type Course = { id: string; name: string };

export default function AddAssignmentForm({ courses }: { courses: Course[] }) {
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    try {
      const result = await createAssignment(formData);
      if (result.success) {
        toast.success("Assignment added!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to add assignment");
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl border">
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          name="title"
          required
          className="w-full p-2.5 rounded-lg border dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Course</label>
        <select name="courseId" required className="w-full p-2.5 rounded-lg border dark:bg-gray-700">
          <option value="">Select course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Due Date</label>
        <input
          type="datetime-local"
          name="dueDate"
          required
          className="w-full p-2.5 rounded-lg border dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Priority</label>
        <select name="priority" className="w-full p-2.5 rounded-lg border dark:bg-gray-700">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Attachment (optional)</label>
        <input type="file" name="file" className="w-full" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-pink-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50"
      >
        {pending ? "Adding..." : "Add Assignment"}
      </button>
    </form>
  );
}