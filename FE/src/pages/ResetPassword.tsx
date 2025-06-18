import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "config";
import { toast } from "sonner";

export const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const handleResetPassword = async () => {
    const { resetToken } = useParams();
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/auth/reset-password/${resetToken}`,
        { password }
      );
      if (res) {
        toast.success("Reset Password successfull");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-neutral-900/40 p-6 rounded-xl border border-neutral-800 shadow-md space-y-5">
      <div className="space-y-2">
        <Label htmlFor="new-password" className="text-sm text-gray-300">
          Enter New Password
        </Label>
        <Input
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-neutral-800 text-white border-neutral-700 placeholder:text-neutral-500"
        />
      </div>

      <Button
        className="w-full bg-cyan-800 hover:bg-cyan-600 text-white"
        onClick={handleResetPassword}
      >
        Update Password
      </Button>
    </div>
  );
};
