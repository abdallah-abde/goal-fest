import DashboardSidebar from "@/components/DashboardSidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-screen py-24 flex gap-x-4'>
      <DashboardSidebar />
      <div className='overflow-auto grow px-2'>{children}</div>
    </div>
  );
};

export default DashboardLayout;
