import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function CreateProjectPage() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {};

  return (
    <div className="flex justify-center items-center min-h-[89vh] bg-neutral-950 px-4">
      <div>
        <Card className="min-w-sm max-w-sm bg-neutral-900 border border-neutral-800">
          <CardContent className="p-5 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-neutral-300">Project Name</label>
                <Input
                  placeholder="Write the name of your project"
                  className="bg-neutral-800 text-white border-neutral-700 focus-visible:ring-cyan-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-neutral-300">Description</label>
                <Textarea
                  className="bg-neutral-800 text-white border-neutral-700 focus-visible:ring-cyan-500"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={4}
                  placeholder="Write the description of your project"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Project"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
