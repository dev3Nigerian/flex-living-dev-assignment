import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const TopNav = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-4 sm:px-6 lg:px-10">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400">Flex Reviews</p>
        <h1 className="text-xl font-semibold text-slate-900">Manager Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:text-slate-900"
        >
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/60 px-3 py-1.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {user?.initials ?? 'FL'}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">{user?.email ?? 'guest@theflex.global'}</p>
            <p className="text-xs text-slate-400">Manager</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:text-slate-900"
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;

