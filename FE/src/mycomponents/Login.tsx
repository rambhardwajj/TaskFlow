import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { googleAuthLoginUser, loginUser } from "@/redux/slices/authSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { FiArrowRight } from "react-icons/fi";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgetEmail, setForgetEmail] = useState("");
  const [forgetOpen, setForgetOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const handleForgetPassword = async () => {
    try {
      toast.loading("wait");
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/auth/forgot-password`,
        { email: forgetEmail }
      );
      toast.dismiss();
      if (res) {
        toast.success(
          "Reset Password link send to your email. Please reset your password"
        );
      }
      setForgetOpen(false);
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.response.data.message);
    }
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
            Organize your tasks, boost your productivity, and stay on top of
            everything— one flow at a time.
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
          <h2 className="text-2xl font-bold mb-6">
            {" "}
            <span className="text-cyan-400"> Sign In</span> to TaskFlow
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                className="bg-neutral-800 border-zinc-600 rounded-[4px]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-neutral-800 border-zinc-600 rounded-[4px]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <Dialog open={forgetOpen} onOpenChange={setForgetOpen}>
                <DialogTrigger asChild>
                  <button className="text-sm cursor-pointer hover:text-blue-300 text-blue-400">
                    forget password?{" "}
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-neutral-200 rounded-[4px] ">
                  <Input
                    placeholder="write your email"
                    value={forgetEmail}
                    onChange={(e) => setForgetEmail(e.target.value)}
                  />
                  <Button onClick={handleForgetPassword}>
                    Send Reset Password Email
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            {/* {error && <p className="text-red-500 text-sm">{error !=='Unauthorised request' && error}</p>} */}
            <Button
              type="submit"
              className="w-full bg-cyan-600 rounded-[4px] hover:bg-cyan-500 cursor-pointer text-white"
              disabled={loading}
            >
              {loading ? (
                "Logging in..."
              ) : (
                <span className="flex items-center justify-center gap-2  ">
                  Access Your Workspace <FiArrowRight className="text-lg" />
                </span>
              )}
            </Button>
          </form>

          <br />

          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                if (credentialResponse.credential) {
                  const res = await dispatch(
                    googleAuthLoginUser({
                      credential: credentialResponse.credential,
                    })
                  ).unwrap();
                  if (res) 
                    toast.success("login successful");
                }
              } catch (error) {
                toast.error("Error signing up with Google");
              }
            }}
            onError={() => {
              toast.error("Login with Google failed");
            }}
          />

          <div className="mt-4 text-sm text-center text-neutral-400">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-cyan-400 cursor-pointer hover:underline"
            >
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
