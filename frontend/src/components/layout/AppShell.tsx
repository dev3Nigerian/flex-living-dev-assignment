import Sidebar from './Sidebar';
import TopNav from './TopNav';

const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopNav />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;

