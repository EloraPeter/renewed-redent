import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
