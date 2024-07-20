import DashboardSidebar from "@/components/DashboardSidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-screen py-24 flex gap-x-4'>
      <DashboardSidebar />
      <main className='overflow-auto grow px-2'>{children}</main>
    </div>
  );
};

export default DashboardLayout;
