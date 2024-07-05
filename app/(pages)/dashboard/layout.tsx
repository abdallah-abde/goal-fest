import DashboardSidebar from "@/components/DashboardSidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-full flex w-full pt-20'>
      <DashboardSidebar />
      <main className='pl-28 flex-1'>{children}</main>
    </div>
  );
};

export default DashboardLayout;
