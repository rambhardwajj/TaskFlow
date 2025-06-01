import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { loginUser } from "@/redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector(
    (state: RootState) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(loginUser({ email, password }));
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/projects");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-[89vh] flex items-center justify-center bg-neutral-950 p-4">
      <Card className="w-full max-w-md bg-neutral-900 text-white shadow-lg border border-zinc-700">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-cyan-400">Login</h2>
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
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
