import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { toast } from "sonner";

export const ResendVerifyEmail = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResendEmail = async () => {
    if (!email) return toast.error("Email cannot be empty");
    console.log(email)
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/auth/resend-verification`,
        { email }
      );
      if (res) toast.success("Resend Email successful");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Resend Email failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full m-10 max-w-md mx-auto bg-neutral-900/40 p-6 rounded-xl border border-neutral-800 shadow-md space-y-5">
      <div className="space-y-2">
        <Label  className="text-sm text-gray-300">
          Enter Email
        </Label>
        <Input
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-neutral-800 text-white border-neutral-700 placeholder:text-neutral-500"
        />
      </div>

      <Button
        disabled={isLoading}
        className="w-full bg-cyan-800 hover:bg-cyan-600 text-white disabled:opacity-50"
        onClick={handleResendEmail}
      >
        {isLoading ? "Sending..." : "Resend Verify email"}
      </Button>
    </div>
  );
};
