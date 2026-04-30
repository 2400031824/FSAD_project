import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLogin, useRegister, type RegisterPayload } from "@/hooks/use-auth";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";

const labelClass = "font-mono-ui text-[0.68rem] uppercase tracking-[0.12em] text-[#f0ede8]/55";
const inputClass = "rounded-[2px] border-white/[0.08] bg-[#080808] text-[#f0ede8] placeholder:text-[#f0ede8]/25 focus-visible:ring-[#c8f04a]/60";

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
    login({ username: loginData.username, password: loginData.password }, {
      onSuccess: () => setLocation("/dashboard"),
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: RegisterPayload = {
      username: registerData.username,
      password: registerData.password,
      email: registerData.email,
      name: registerData.name,
      role: registerData.role,
    };

    if (registerData.role === "student") {
      payload.department = registerData.department || undefined;
      payload.cgpa = registerData.cgpa || undefined;
      payload.graduationYear = registerData.graduationYear
        ? parseInt(registerData.graduationYear)
        : undefined;
    } else {
      payload.companyName = registerData.companyName || undefined;
      payload.industry = registerData.industry || undefined;
    }

    register(payload, { onSuccess: () => setLocation("/dashboard") });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] px-4 py-12 text-[#f0ede8]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(200,240,74,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(200,240,74,0.035)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_50%,black,transparent)]" />
      <Link href="/" className="absolute left-5 top-5 inline-flex items-center gap-2 font-mono-ui text-[0.7rem] uppercase tracking-[0.14em] text-[#f0ede8]/45 hover:text-[#f0ede8]">
        <ArrowLeft className="h-3.5 w-3.5" />
        Home
      </Link>

      <Card className="relative w-full max-w-md rounded-[2px] border border-white/[0.08] bg-[#0e0e0e]/95 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <CardHeader className="space-y-6 border-b border-white/[0.08] pb-6">
          <div className="mx-auto flex h-11 w-11 items-center justify-center bg-[#c8f04a] shadow-[0_0_30px_rgba(200,240,74,0.24)]">
            <div className="flex h-6 w-6 items-center justify-center bg-[#080808] text-xs font-extrabold text-[#c8f04a]">
              PM
            </div>
          </div>
          <div className="space-y-1 text-center">
            <CardTitle className="text-3xl font-extrabold tracking-[-0.03em] text-[#f0ede8]">
              PlacementMaster
            </CardTitle>
            <CardDescription className="font-mono-ui text-xs leading-6 text-[#f0ede8]/45">
              Sign in to manage your campus placements
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="mb-5 grid w-full grid-cols-2 rounded-[2px] border border-white/[0.08] bg-[#080808]">
              <TabsTrigger value="login" className="rounded-[2px] font-mono-ui text-[0.7rem] uppercase tracking-[0.12em] text-[#f0ede8]/45 data-[state=active]:bg-[#c8f04a] data-[state=active]:text-[#080808]">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-[2px] font-mono-ui text-[0.7rem] uppercase tracking-[0.12em] text-[#f0ede8]/45 data-[state=active]:bg-[#c8f04a] data-[state=active]:text-[#080808]">
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className={labelClass}>Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    required
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className={labelClass}>Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    className={inputClass}
                  />
                </div>
                <Button type="submit" className="pis-button mt-2 w-full hover:opacity-85" disabled={isLoginPending}>
                  {isLoginPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-3 pr-1">
                <div className="space-y-2">
                  <Label htmlFor="role" className={labelClass}>I am a</Label>
                  <Select value={registerData.role} onValueChange={(val: any) => setRegisterData({ ...registerData, role: val })}>
                    <SelectTrigger className={inputClass}>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="border-white/[0.08] bg-[#0e0e0e] text-[#f0ede8]">
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="employer">Employer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-name" className={labelClass}>Full Name</Label>
                  <Input id="reg-name" placeholder="Full name" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} required className={inputClass} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className={labelClass}>Email Address</Label>
                  <Input id="reg-email" type="email" placeholder="name@institute.edu" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} required className={inputClass} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-username" className={labelClass}>Username</Label>
                  <Input id="reg-username" placeholder="Username" value={registerData.username} onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })} required className={inputClass} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password" className={labelClass}>Password</Label>
                  <Input id="reg-password" type="password" placeholder="Min 8 chars, 1 uppercase, 1 number" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} required className={inputClass} />
                </div>

                {registerData.role === "student" ? (
                  <>
                    <div className="space-y-2 pt-1">
                      <Label htmlFor="department" className={labelClass}>Department</Label>
                      <Input id="department" placeholder="e.g., Computer Science" value={registerData.department} onChange={(e) => setRegisterData({ ...registerData, department: e.target.value })} className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="cgpa" className={labelClass}>CGPA</Label>
                        <Input id="cgpa" placeholder="e.g., 9.0" value={registerData.cgpa} onChange={(e) => setRegisterData({ ...registerData, cgpa: e.target.value })} className={inputClass} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gradYear" className={labelClass}>Grad Year</Label>
                        <Input id="gradYear" type="number" placeholder="2026" value={registerData.graduationYear} onChange={(e) => setRegisterData({ ...registerData, graduationYear: e.target.value })} className={inputClass} />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2 pt-1">
                      <Label htmlFor="company" className={labelClass}>Company Name</Label>
                      <Input id="company" placeholder="Your company name" value={registerData.companyName} onChange={(e) => setRegisterData({ ...registerData, companyName: e.target.value })} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry" className={labelClass}>Industry</Label>
                      <Input id="industry" placeholder="e.g., Software, Finance" value={registerData.industry} onChange={(e) => setRegisterData({ ...registerData, industry: e.target.value })} className={inputClass} />
                    </div>
                  </>
                )}

                <Button type="submit" className="pis-button mt-1 w-full hover:opacity-85" disabled={isRegisterPending}>
                  {isRegisterPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-white/[0.08] pt-4">
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.12em] text-[#f0ede8]/35">
            Authorized personnel only / Placement Office
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
