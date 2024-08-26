import { auth } from "@/auth";
import DashboardSidebar from "@/components/menus/DashboardSidebar";
import { Ban } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user || session.user.role !== "ADMIN") {
    return (
      <div className='h-screen flex flex-col items-center justify-center md:flex-row gap-4 py-24 text-destructive font-bold text-2xl md:text-4xl'>
        <Ban className='h-10 md:h-12 w-10 md:w-12' />
        Access Denied!
      </div>
    );
  }

  return (
    <div className='h-screen flex flex-col md:flex-row gap-4 py-24'>
      <DashboardSidebar />
      <div className='md:overflow-auto grow pl-1 md:pr-2 pb-24 md:pb-0 mt-8 md:mt-0'>
        {children}
      </div>
    </div>
  );
}
