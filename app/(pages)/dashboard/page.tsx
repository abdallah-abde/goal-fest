import { auth } from "@/auth";
import PageHeader from "@/components/PageHeader";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <>
      <div className="h-screen py-24">
        <PageHeader label="Dashboard" />
        <div className="flex gap-8 *:w-1/3 *:text-center *:p-8 *:bg-primary/10 *:rounded-lg">
          <Link
            href="/dashboard/countries"
            className="hover:bg-primary/20 transition duration-300"
          >
            <Card className="bg-transparent border-0 shadow-none">
              <CardTitle>Countries</CardTitle>
            </Card>
          </Link>
          <Link
            href="/dashboard/tournaments"
            className="hover:bg-primary/20 transition duration-300"
          >
            <Card className="bg-transparent border-0 shadow-none">
              <CardTitle>Tournaments</CardTitle>
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
        {/* <pre>{JSON.stringify(session)}</pre> */}
      </div>
    </>
  );
}
