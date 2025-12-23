import clsx from 'clsx';

interface StatTileProps {
  label: string;
  value: string;
  helper?: string;
  variant?: 'default' | 'positive' | 'warning';
}

const variantClasses: Record<NonNullable<StatTileProps['variant']>, string> = {
  default: 'bg-white',
  positive: 'bg-emerald-50 text-emerald-900 border border-emerald-100',
  warning: 'bg-amber-50 text-amber-900 border border-amber-100',
};

const StatTile = ({ label, value, helper, variant = 'default' }: StatTileProps) => {
  return (
    <div className={clsx('rounded-2xl p-4 shadow-sm', variantClasses[variant] ?? variantClasses.default)}>
      <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {helper && <p className="text-xs text-slate-500">{helper}</p>}
    </div>
  );
};

export default StatTile;

