import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import PullToRefresh from "@/components/PullToRefresh";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
