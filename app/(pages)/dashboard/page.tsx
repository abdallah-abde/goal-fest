import { auth } from "@/auth";
import PageHeader from "@/components/PageHeader";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Ban } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user || session.user.role !== "ADMIN") {
    return (
      <div className="h-screen flex flex-col items-center justify-center md:flex-row gap-4 py-24 text-destructive font-bold text-2xl md:text-4xl">
        <Ban className="h-10 md:h-12 w-10 md:w-12" />
        Access Denied!
      </div>
    );
  }

  return (
    <div className="h-screen py-24">
      <PageHeader label="Dashboard" />
      <div className="flex gap-8 *:w-1/3 *:text-center *:p-8 *:bg-primary/10 *:rounded-lg">
        <Link
          href="/dashboard/countries"
          className="hover:bg-primary/20 transition duration-300"
        >
          <Card className="bg-transparent border-0 shadow-none">
            <CardTitle>Other</CardTitle>
          </Card>
        </Link>
        <Link
          href="/dashboard/leagues"
          className="hover:bg-primary/20 transition duration-300"
        >
          <Card className="bg-transparent border-0 shadow-none">
            <CardTitle>Leagues</CardTitle>
          </Card>
        </Link>
      </div>
    </div>
  );
}
