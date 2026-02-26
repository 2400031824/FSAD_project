import { useState } from "react";
import { useLogin, useRegister } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutate: register, isPending: isRegisterPending } = useRegister();

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    role: "student" as "student" | "employer",
    department: "",
    cgpa: "",
    graduationYear: "",
    companyName: "",
    industry: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(loginData, { onSuccess: () => setLocation("/dashboard") });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      username: registerData.username,
      password: registerData.password,
      email: registerData.email,
      name: registerData.name,
      role: registerData.role,
    };

    if (registerData.role === "student") {
      payload.studentDetails = {
        department: registerData.department,
        cgpa: registerData.cgpa,
        graduationYear: parseInt(registerData.graduationYear) || undefined,
      };
    } else if (registerData.role === "employer") {
      payload.employerDetails = {
        companyName: registerData.companyName,
        industry: registerData.industry,
      };
    }

    register(payload, { onSuccess: () => setLocation("/dashboard") });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4">
      <Card className="w-full max-w-md bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 border border-slate-800 shadow-2xl shadow-violet-500/20">
        <CardHeader className="space-y-6 pb-4">
          <div className="mx-auto h-10 w-10 rounded-2xl bg-violet-600/80 flex items-center justify-center shadow-lg shadow-violet-500/40">
            <div className="h-5 w-5 rounded-md bg-slate-950 flex items-center justify-center text-xs font-semibold text-violet-300">
              PM
            </div>
          </div>
          <div className="text-center space-y-1">
            <CardTitle className="text-2xl font-semibold text-slate-50">
              PlacementMaster
            </CardTitle>
            <CardDescription className="text-sm text-slate-400">
              Sign in to manage your campus placements
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-900/80 border border-slate-800">
              <TabsTrigger
                value="login"
                className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-slate-50"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-slate-50"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className="text-xs text-slate-300"
                  >
                    Username
                  </Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={loginData.username}
                    onChange={(e) =>
                      setLoginData({ ...loginData, username: e.target.value })
                    }
                    required
                    className="bg-slate-900/80 border-slate-700 text-slate-50 placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-xs text-slate-300"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                    className="bg-slate-900/80 border-slate-700 text-slate-50 placeholder:text-slate-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="mt-2 w-full bg-violet-600 hover:bg-violet-500 text-white"
                  disabled={isLoginPending}
                >
                  {isLoginPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form
                onSubmit={handleRegister}
                className="space-y-3 max-h-[22rem] overflow-y-auto pr-1"
              >
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-xs text-slate-300">
                    I am a
                  </Label>
                  <Select
                    value={registerData.role}
                    onValueChange={(val: any) =>
                      setRegisterData({ ...registerData, role: val })
                    }
                  >
                    <SelectTrigger className="bg-slate-900/80 border-slate-700 text-slate-50">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="employer">Employer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs text-slate-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Full name"
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        name: e.target.value,
                      })
                    }
                    required
                    className="bg-slate-900/80 border-slate-700 text-slate-50 placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs text-slate-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@institute.edu"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    required
                    className="bg-slate-900/80 border-slate-700 text-slate-50 placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="username2"
                    className="text-xs text-slate-300"
                  >
                    Username
                  </Label>
                  <Input
                    id="username2"
                    placeholder="Username"
                    value={registerData.username}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        username: e.target.value,
                      })
                    }
                    required
                    className="bg-slate-900/80 border-slate-700 text-slate-50 placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password2"
                    className="text-xs text-slate-300"
                  >
                    Password
                  </Label>
                  <Input
                    id="password2"
                    type="password"
                    placeholder="Strong password"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    required
                    className="bg-slate-900/80 border-slate-700 text-slate-50 placeholder:text-slate-500"
                  />
                </div>

                {registerData.role === "student" && (
                  <>
                    <div className="space-y-2 pt-1">
                      <Label
                        htmlFor="department"
                        className="text-xs text-slate-300"
                      >
                        Department
                      </Label>
                      <Input
                        id="department"
                        placeholder="e.g., Computer Science"
                        value={registerData.department}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            department: e.target.value,
                          })
                        }
                        className="bg-slate-900/80 border-slate-700 text-slate-50 placeholder:text-slate-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label
                          htmlFor="cgpa"
                          className="text-xs text-slate-300"
                        >
                          CGPA
                        </Label>
                        <Input
                          id="cgpa"
                          placeholder="e.g., 9.0"
                          value={registerData.cgpa}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              cgpa: e.target.value,
                            })
                          }
                          className="bg-slate-900/80 border-slate-700 text-slate-50 placeholder:text-slate-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="gradYear"
                          className="text-xs text-slate-300"
                        >
                          Graduation Year
                        </Label>
                        <Input
                          id="gradYear"
                          type="number"
                          placeholder="2024"
                          value={registerData.graduationYear}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              graduationYear: e.target.value,
                            })
                          }
                          className="bg-slate-900/80 border-slate-700 text-slate-50 placeholder:text-slate-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                {registerData.role === "employer" && (
                  <>
                    <div className="space-y-2 pt-1">
                      <Label
                        htmlFor="company"
                        className="text-xs text-slate-300"
                      >
                        Company Name
                      </Label>
                      <Input
                        id="company"
                        placeholder="Your company name"
                        value={registerData.companyName}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            companyName: e.target.value,
                          })
                        }
                        className="bg-slate-900/80 border-slate-700 text-slate-50 placeholder:text-slate-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="industry"
                        className="text-xs text-slate-300"
                      >
                        Industry
                      </Label>
                      <Input
                        id="industry"
                        placeholder="e.g., Software, Finance"
                        value={registerData.industry}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            industry: e.target.value,
                          })
                        }
                        className="bg-slate-900/80 border-slate-700 text-slate-50 placeholder:text-slate-500"
                      />
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="mt-1 w-full bg-violet-600 hover:bg-violet-500 text-white"
                  disabled={isRegisterPending}
                >
                  {isRegisterPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="pt-2 flex justify-center">
          <p className="text-[11px] text-slate-500">
            Authorized personnel only • Placement Office
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
