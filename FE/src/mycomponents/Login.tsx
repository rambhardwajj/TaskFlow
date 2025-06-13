import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/redux/slices/authSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { FiArrowRight } from "react-icons/fi";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="min-h-[90.6vh]  bg-neutral-950 text-white  flex justify-around ">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex flex-col justify-center px-12 py-10  ">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight">
            Welcome back to <span className="text-cyan-400">TaskFlow</span>
          </h1>
          <p className="mt-4 text-lg text-neutral-400 max-w-md">
            Organize your tasks, boost your productivity, and stay on top of everything—
            one flow at a time.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          <Feature icon="⚡" title="Real-time collaboration" />
          <Feature icon="📈" title="Smart task prioritization" />
          <Feature icon="🌙" title="Beautiful dark mode UI" />
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex items-center justify-center w-full max-w-[48vw] p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6"> <span className="text-cyan-400" >  Sign In</span>  to TaskFlow</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                className="bg-neutral-800 border-zinc-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-neutral-800 border-zinc-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error !=='Unauthorised request' && error}</p>}
            <Button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 cursor-pointer text-white"
              disabled={loading}
            >
              {loading ? "Logging in..." : (
                <span className="flex items-center justify-center gap-2">
                  Access Your Workspace <FiArrowRight className="text-lg" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-4 text-sm text-center text-neutral-400">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-cyan-400 cursor-pointer hover:underline">
              Join TaskFlow
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Feature({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xl">{icon}</span>
      <span className="text-neutral-300">{title}</span>
    </div>
  );
}
