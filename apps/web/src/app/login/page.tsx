"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BriefcaseBusiness, Eye, EyeOff } from "lucide-react";

const field =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400";
const label = "mb-2 block text-sm font-medium text-slate-700";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<"login" | "register">(
    searchParams.get("mode") === "register" ? "register" : "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function switchMode(next: "login" | "register") {
    setMode(next);
    setError(null);
    setConfirmPassword("");
    setShowConfirmPassword(false);
  }

  async function handleLogin() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function handleSignup() {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    // New account has no business yet, so send them to onboarding.
    router.push("/onboarding");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-6">
      <div className="w-full max-w-md rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-8">
        <div className="mb-7 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 shadow-sm shadow-teal-900/20">
            <BriefcaseBusiness className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-xl font-semibold text-slate-900">Business OS</div>
            <div className="text-xs text-slate-500">A calmer way to run the shop.</div>
          </div>
        </div>

        {mode === "login" ? (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
              <p className="mt-2 text-sm text-slate-500">Pick up where you left off.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={label}>Email</label>
                <input
                  className={field}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className={label}>Password</label>
                <div className="relative">
                  <input
                    className={`${field} pr-10`}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-400"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                onClick={handleLogin}
                disabled={loading || !email || !password}
                className="w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 disabled:opacity-50"
              >
                Log In
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] text-slate-400">
                  <span className="bg-white px-2">or</span>
                </div>
              </div>

              <button
                onClick={() => switchMode("register")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Create Account
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
              <p className="mt-2 text-sm text-slate-500">Start managing your business in minutes</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={label}>Email</label>
                <input
                  className={field}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className={label}>Password</label>
                <div className="relative">
                  <input
                    className={`${field} pr-10`}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-400"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className={label}>Confirm password</label>
                <div className="relative">
                  <input
                    className={`${field} pr-10`}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-400"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                onClick={handleSignup}
                disabled={loading || !email || !password || !confirmPassword}
                className="w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 disabled:opacity-50"
              >
                Create Account
              </button>

              <div className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <button onClick={() => switchMode("login")} className="font-medium text-blue-600">
                  Log in
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
