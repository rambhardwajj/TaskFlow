import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { fetchUserTasks } from "@/redux/slices/userTasksSlice";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Calendar, Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { toast } from "sonner";

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const userTasks = useSelector((state: RootState) => state.userTasks);
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    dispatch(fetchUserTasks());
  }, [dispatch]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const handleChangePassword = async () => {
    try {
      if (!currentPassword || !newPassword) {
        return toast.error("Please fill in all password fields.");
      }
      toast.loading("wait")
      await axios.post(
        `${API_BASE_URL}/api/v1/user/auth/update-password`,
        {
          oldPassword: currentPassword,
          newPassword: newPassword,
        },
        { withCredentials: true }
      );
      toast.dismiss()
      toast.success("password changed.");
    } catch (error: any) {
      toast.dismiss()
      toast.error(
        error?.response?.data?.message || "Failed to change password"
      );
    }
  };

  const getTaskStatusColor = (status: string) => {
    const colors = {
      DONE: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      TODO: "bg-red-500/20 text-neutral-400 border-neutral-500/30",
      IN_PROGRESS: "bg-blue-500/20 text-blue-400 border-neutral-500/30",
      default: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30",
    };

    // @ts-ignore
    return colors[status] || colors.default;
  };

  const taskItems = Object.entries(userTasks.userTasks).flatMap(
    ([status, ids]) =>
      ids.map((id) => {
        const task = userTasks.byId[id];
        return (
          <div
            key={task._id}
            className="group relative overflow-hidden rounded-sm border border-neutral-700/50 bg-gradient-to-r from-neutral-900/10 to-neutral-950/50 p-3 transition-all duration-300 hover:border-cyan-800/30 "
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-neutral-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-xs text-neutral-200 truncate group-hover:text-white transition-colors">
                  {task.title}
                </h4>

                <Badge className={`shrink-0 ${getTaskStatusColor(status)}`}>
                  {status}
                </Badge>
              </div>
            </div>
          </div>
        );
      })
  );

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-black  via-black/50 to-black">
      {/* Header with gradient overlay */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 " />
        <div className="relative px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-neutral-400 bg-clip-text text-transparent">
                  Welcome back
                </h1>
                <p className="mt-2 ml-1 text-sm text-neutral-400">
                  Manage your profile and account settings
                </p>
              </div>
              {/* <Button
                variant="outline"
                size="lg"
                className="border-neutral-600 bg-neutral-800/50 text-cyan-400 hover:bg-neutral-700/50 hover:border-cyan-500/50 backdrop-blur-sm"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4  sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Profile Header Card */}
              <Card className="border-neutral-700/50 bg-gradient-to-r from-neutral-900/50 to-neutral-900/50 backdrop-blur-sm shadow-xl">
                <CardHeader className="">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="relative">
                      <Avatar className="w-20 h-20 border-4 border-neutral-600/50 shadow-2xl">
                        <AvatarImage
                          src={user?.avatar || "https://api.dicebear.com/8.x/pixel-art/svg?seed=Ram123"}
                          alt={user?.name}
                        />
                        <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-neutral-500 text-white">
                          {user?.userName?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0 -right-0 w-6 h-6 bg-emerald-500 rounded-full border-4 border-neutral-800 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-neutral-100">
                          {user?.userName}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-400 text-xs">
                        <Mail className="w-4 h-4" />
                        <span>{user?.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-400 text-xs">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Joined{" "}
                          {new Date(user?.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Tabs Section */}
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-neutral-900/50 border border-neutral-700/50 backdrop-blur-sm">
                  <TabsTrigger
                    value="profile"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-neutral-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/50 text-neutral-400 transition-all duration-200"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-neutral-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/50 text-neutral-400 transition-all duration-200"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Security
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6">
                  <Card className="border-neutral-700/50 bg-gradient-to-r from-neutral-900/30 to-neutral-900/30 backdrop-blur-sm">
                    <CardHeader className="pb-1">
                      <h3 className="text-lg font-semibold text-neutral-100">
                        Personal Information
                      </h3>
                      <p className="text-neutral-400 text-xs">
                        Update your personal details and preferences
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
                        <div className="space-y-2">
                          <Label className="text-neutral-300 text-xs">
                            User Name
                          </Label>
                          <Input
                            disabled
                            value={user?.userName ||  ""}
                            className="bg-neutral-700/50 border-neutral-600/50 text-neutral-200 disabled:opacity-70 focus:border-cyan-500/50 transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-neutral-300 text-xs">
                            Email Address
                          </Label>
                          <Input
                            disabled
                            value={user?.email || ""}
                            className="bg-neutral-700/50 border-neutral-600/50 text-neutral-200 disabled:opacity-70 focus:border-cyan-500/50 transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-neutral-300 text-xs">
                            Role
                          </Label>
                          <Input
                            disabled
                            value={user?.role || "User"}
                            className="bg-neutral-700/50 border-neutral-600/50 text-neutral-200 disabled:opacity-70 focus:border-cyan-500/50 transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-neutral-300 text-xs">
                            Member Since
                          </Label>
                          <Input
                            disabled
                            value={new Date(user?.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                            className="bg-neutral-700/50 border-neutral-600/50 text-neutral-200 disabled:opacity-70 focus:border-cyan-500/50 transition-colors"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                 <TabsContent value="security" className="mt-6">
                  <Card className="border-neutral-700/50 bg-gradient-to-r from-neutral-800/30 to-neutral-900/30 backdrop-blur-sm">
                    <CardHeader className="pb-1">
                      <h3 className="text-lg font-semibold text-neutral-100">
                        Security Settings
                      </h3>
                      <p className="text-neutral-400 text-xs">
                        Manage your password and security preferences
                      </p>
                    </CardHeader>
                  { user.provider ==="local" ?   <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-neutral-300 text-xs">
                            Current Password
                          </Label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter current password"
                              className="bg-neutral-700/50 border-neutral-600/50 text-neutral-200 focus:border-cyan-500/50 transition-colors pr-10"
                              onChange={(e) =>
                                setCurrentPassword(e.target.value)
                              }
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -tranneutral-y-1/2 text-neutral-400 hover:text-neutral-300 transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-neutral-300 text-xs">
                            New Password
                          </Label>
                          <div className="relative">
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              className="bg-neutral-700/50 border-neutral-600/50 text-neutral-200 focus:border-cyan-500/50 transition-colors pr-10"
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              className="absolute right-3 top-1/2 -tranneutral-y-1/2 text-neutral-400 hover:text-neutral-300 transition-colors"
                            >
                              {showNewPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end pt-4">
                        <Button
                          className="bg-cyan-900  hover:bg-cyan-600 text-white  "
                          onClick={handleChangePassword}
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Update Password
                        </Button>
                      </div>
                    </CardContent>
                    : <CardContent>
                      <div> 
                        You are all Set 
                      </div>
                    </CardContent>
                  }
                    
                  </Card>
                </TabsContent>

              </Tabs>
            </div>

            {/* Sidebar - Tasks Overview */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-3">
                {/* Task Stats */}
                <Card className="border-neutral-700/50 bg-gradient-to-r from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm rounded-md ">
                  <CardHeader className="">
                    <h3 className="text-md font-semibold text-neutral-100">
                      Task Overview
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-4 mt-[-10px]">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-2 rounded-lg bg-neutral-700/30">
                        <div className="text-xl font-bold text-cyan-400">
                          {userTasks.userTasks.DONE.length}
                        </div>
                        <div className="text-xs text-neutral-400">
                          Completed
                        </div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-neutral-700/30">
                        <div className="text-xl font-bold text-green-400">
                          {userTasks.userTasks.TODO.length +
                            userTasks.userTasks.IN_PROGRESS.length}
                        </div>
                        <div className="text-xs text-neutral-400">Pending</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Tasks */}
                <Card className="border-neutral-700/50 bg-gradient-to-r from-neutral-800/50 to-neutral-900/40 max-h-[48vh]">
                  <CardHeader className="">
                    <h3 className="text-md font-semibold text-neutral-100">
                      Recent Tasks
                    </h3>
                  </CardHeader>
                  <CardContent className=" mt-[-20px] space-y-1 max-h-[500px] overflow-y-auto custom-scrollbar scrollbar-thumb-neutral-600">
                    {taskItems.length > 0 ? (
                      taskItems
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-700/50 flex items-center justify-center">
                          <User className="w-8 h-8 text-neutral-400" />
                        </div>
                        <p className="text-neutral-400 text-sm">
                          No tasks found
                        </p>
                        <p className="text-neutral-500 text-xs mt-1">
                          Tasks will appear here once created
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
