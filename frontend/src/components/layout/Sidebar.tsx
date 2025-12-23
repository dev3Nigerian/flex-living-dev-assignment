import { BarChart3, Home, Star } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: BarChart3 },
  { label: 'Property 253093', to: '/property/253093', icon: Home },
  { label: 'Guest Stories', to: '/dashboard#reviews', icon: Star },
];

const Sidebar = () => {
  return (
    <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white/90 px-6 py-8 lg:flex">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">The Flex</p>
        <p className="text-lg font-semibold text-slate-900">Reviews HQ</p>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl bg-slate-900 p-4 text-white">
        <p className="text-sm uppercase tracking-widest text-white/60">Account</p>
        <p className="text-lg font-semibold">Flex Living</p>
        <p className="text-xs text-white/70">Hostaway ID 61148</p>
      </div>
    </aside>
  );
};

export default Sidebar;

