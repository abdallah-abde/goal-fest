import Sidebar from "@/components/Sidebar";

const TournamentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-full flex w-full pt-20'>
      <Sidebar />
      <main className='pl-28 flex-1'>{children}</main>
    </div>
  );
};

export default TournamentLayout;
