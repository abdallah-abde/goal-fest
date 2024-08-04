import DashboardSidebar from "@/components/menus/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='h-screen flex flex-col md:flex-row gap-4 py-24'>
      <DashboardSidebar />
      <div className='md:overflow-auto grow pl-1 md:pr-2 pb-24 md:pb-0 mt-8 md:mt-0'>
        {children}
      </div>
    </div>
  );
}
