import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div>
      <pre>{JSON.stringify(session)}</pre>
    </div>
  );
}
