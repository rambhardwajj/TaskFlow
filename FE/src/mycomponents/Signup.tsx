import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react";

export default function Signup() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("")
  const [fullName, setFullName] = useState("")

  

  return (
    <div className="min-h-[89vh] flex items-center justify-center bg-neutral-950 p-4">
      <Card className="w-full max-w-md bg-neutral-900 text-white shadow-lg border border-zinc-700">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-cyan-400">Sign Up</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Username</label>
              <Input  placeholder="your_username" className="bg-neutral-800 border-zinc-600"
              onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <Input placeholder="John Doe" className="bg-neutral-800 border-zinc-600" 
              onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <Input type="email"  placeholder="you@example.com" className="bg-neutral-800 border-zinc-600" 
              onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <Input type="password" placeholder="••••••••" className="bg-neutral-800 border-zinc-600" 
              onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button  type="submit"  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white"
            onSubmit={() => {}}
            >Create Account</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
