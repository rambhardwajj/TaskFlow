
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { API_BASE_URL } from "../../config";

export default function VerifyStatus() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        return;
      }

      try {
        await axios.get(`${API_BASE_URL}/api/v1/user/auth/verify/${token}`);
        setStatus("success");
      } catch (error) {
        console.error("Verification failed", error);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-white">
      <div className="bg-neutral-900 border border-zinc-700 rounded-xl p-8 text-center w-[320px]">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
            <h1 className="text-xl font-bold mb-2">Verifying...</h1>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
            <p className="text-zinc-400">Your email has been successfully verified.</p>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
            <p className="text-zinc-400">The verification link is invalid or expired.</p>
          </>
        )}
      </div>
    </div>
  );
}
