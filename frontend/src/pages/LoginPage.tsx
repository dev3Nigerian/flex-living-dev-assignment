import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Location } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('gm@theflex.global');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, accessCode);
      const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden flex-1 bg-[url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center lg:block">
        <div className="flex min-h-full flex-col justify-between bg-slate-900/70 p-10 text-white">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">The Flex</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">
              Reviews Dashboard
              <br />
              for modern hospitality teams.
            </h1>
          </div>
          <p className="text-sm text-white/70">Mock login · Access code: flex-manager</p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Flex Reviews</p>
            <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
          </div>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Work email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-2xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-900 focus:outline-none"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Access code
            <input
              type="password"
              value={accessCode}
              onChange={(event) => setAccessCode(event.target.value)}
              placeholder="flex-manager"
              className="rounded-2xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-900 focus:outline-none"
              required
            />
          </label>
          {error && <p className="text-sm text-rose-500">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Enter dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

