import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { registerUser } from "@/redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Feature } from "./Login";

export default function Signup() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);
    if (avatar) formData.append("avatar", avatar);

    dispatch(registerUser(formData));
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex max-h-[90.6vh] justify-around">
      <div className="hidden  lg:flex flex-col justify-center  px-12 py-10 ">
        <div>
          <h1 className="text-4xl text-white font-extrabold leading-tight">
            Welcome back to <span className="text-cyan-400">TaskFlow</span>
          </h1>
          <p className="mt-4 text-lg text-neutral-400 max-w-md">
            Organize your tasks, boost your productivity, and stay on top of everything—
            one flow at a time.
          </p>
        </div>

        <div className="mt-10 space-y-4  ">
          <Feature icon="⚡" title="Real-time collaboration" />
          <Feature icon="📈" title="Smart task prioritization" />
          <Feature icon="🌙" title="Beautiful dark mode UI" />
        </div>
      </div>
      <div className="flex items-center justify-center bg-neutral-950 p-4">
        <Card className=" w-[45vw] bg-neutral-950 text-white border-none ">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-cyan-400">Create Account</h2>
            <form
              onSubmit={handleSignup}
              className="space-y-4"
              encType="multipart/form-data"
            >
              <div>
                <label className="block text-sm mb-1">Username</label>
                <Input
                  type="text"
                  placeholder="taskflowdev"
                  className="bg-neutral-800 border-zinc-600"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Full Name</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  className="bg-neutral-800 border-zinc-600"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
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
              <div>
                <label className="block text-sm mb-1">Avatar (optional)</label>
                <Input
                  type="file"
                  accept="image/*"
                  className="bg-neutral-800 border-zinc-600"
                  onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error !=='Unauthorised request' && error}</p>}
              <Button
                type="submit"
                className="w-full cursor-pointer bg-cyan-600 hover:bg-cyan-500 text-white"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-400 cursor-pointer hover:underline">
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
