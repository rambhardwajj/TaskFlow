import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 min-h-screen">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-cyan-500">Welcome</h1>
        <Button variant="outline" className="border-neutral-600 text-cyan-500  bg-neutral-700">
          Edit
        </Button>
      </div>

      {/* User Info Card */}
      <Card className="bg-neutral-900 border-neutral-700 shadow-lg">
        <CardHeader className="flex flex-row items-center gap-6 p-6">
          <Avatar className="w-20 h-20 border-2 border-neutral-600">
            <AvatarImage src={user?.avatar || "/me.jpg"} alt={user?.name} />
            <AvatarFallback className="text-xl font-bold bg-blue-600 text-cyan-500">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-cyan-500">{user?.name}</h2>
            <p className="text-neutral-400">{user?.email}</p>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 bg-neutral-900 border-neutral-700 p-1">
          <TabsTrigger 
            value="profile" 
            className="data-[state=active]:bg-neutral-700 data-[state=active]:text-cyan-500 text-neutral-400"
          >
            Profile Info
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="data-[state=active]:bg-neutral-700 data-[state=active]:text-cyan-500 text-neutral-400"
          >
            Security
          </TabsTrigger>
          <TabsTrigger 
            value="sessions" 
            className="data-[state=active]:bg-neutral-700 data-[state=active]:text-cyan-500 text-neutral-400"
          >
            Sessions
          </TabsTrigger>
        </TabsList>

        {/* Profile Info Tab */}
        <TabsContent value="profile">
          <Card className="bg-neutral-900 border-neutral-700 text-cyan-500 shadow-lg">
            <CardHeader className="pb-4">
              <h3 className="text-xl font-semibold text-cyan-500">Personal Details</h3>
              <p className="text-neutral-400 text-sm">View your account information</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-cyan-500 font-medium">Full Name</Label>
                  <Input 
                    id="name"
                    disabled 
                    value={user?.name || ""} 
                    className="bg-neutral-700 border-neutral-600 text-cyan-500 disabled:opacity-70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-cyan-500 font-medium">Email</Label>
                  <Input 
                    id="email"
                    disabled 
                    value={user?.email || ""} 
                    className="bg-neutral-700 border-neutral-600 text-cyan-500 disabled:opacity-70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-cyan-500 font-medium">Role</Label>
                  <Input 
                    id="role"
                    disabled 
                    value={user?.role || "User"} 
                    className="bg-neutral-700 border-neutral-600 text-cyan-500 disabled:opacity-70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joined" className="text-cyan-500 font-medium">Joined On</Label>
                  <Input
                    id="joined"
                    disabled
                    value={new Date(user?.createdAt).toLocaleDateString()}
                    className="bg-neutral-700 border-neutral-600 text-cyan-500 disabled:opacity-70"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="bg-neutral-800 border-neutral-700 text-cyan-500 shadow-lg">
            <CardHeader className="pb-4">
              <h3 className="text-xl font-semibold text-cyan-500">Change Password</h3>
              <p className="text-neutral-400 text-sm">Update your account password</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="current" className="text-cyan-500 font-medium">Current Password</Label>
                  <Input 
                    type="password" 
                    id="current" 
                    placeholder="Enter current password"
                    className="bg-neutral-700 border-neutral-600 text-cyan-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new" className="text-cyan-500 font-medium">New Password</Label>
                  <Input 
                    type="password" 
                    id="new" 
                    placeholder="Enter new password"
                    className="bg-neutral-700 border-neutral-600 text-cyan-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-cyan-500 font-medium px-6">
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions">
          <Card className="bg-neutral-800 border-neutral-700 shadow-lg">
            <CardHeader className="pb-4">
              <h3 className="text-xl font-semibold text-cyan-500">Active Sessions</h3>
              <p className="text-neutral-400 text-sm">Manage your login sessions</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Example session info */}
              <div className="flex justify-between items-center p-4 bg-neutral-700 rounded-lg border border-neutral-600">
                <div>
                  <p className="text-sm font-medium text-cyan-500">Chrome - Windows</p>
                  <p className="text-xs text-neutral-400">Last active: 2 mins ago</p>
                </div>
                <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                  Logout
                </Button>
              </div>
              <div className="flex justify-end pt-2">
                <Button variant="secondary" size="sm" className="bg-neutral-700 hover:bg-neutral-600 text-cyan-500 border-neutral-600">
                  Logout All Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}