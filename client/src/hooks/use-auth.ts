import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Shape that Spring Boot AuthResponse returns
export interface AuthUser {
  id?: number;
  username: string;
  name?: string;
  email?: string;
  role: string;
  token?: string;
}

// Shape for RegisterRequest matching Spring Boot
export interface RegisterPayload {
  username: string;
  password: string;
  email: string;
  name: string;
  role: string;
  // student fields (flat)
  department?: string;
  cgpa?: string;
  graduationYear?: number;
  // employer fields (flat)
  companyName?: string;
  industry?: string;
}

const SESSION_KEY = "pm_auth_user";

function saveSession(user: AuthUser) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function loadSession(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useUser() {
  return useQuery<AuthUser | null>({
    queryKey: ["auth_user"],
    queryFn: async () => {
      // Try Spring Boot /api/auth/profile first
      try {
        const stored = loadSession();
        if (!stored?.token) return stored ?? null;

        const res = await fetch("/api/auth/profile", {
          headers: { Authorization: `Bearer ${stored.token}` },
        });
        if (res.ok) {
          const data = await res.json();
          return { ...stored, ...data };
        }
      } catch {
        // backend not reachable, fall back to session
      }
      return loadSession();
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid username or password");
        throw new Error("Login failed");
      }

      const raw = await res.json();
      const data: AuthUser = {
        id: raw.id,
        username: raw.username ?? credentials.username,
        name: raw.name,
        email: raw.email,
        role: raw.role,
        token: raw.token ?? raw.accessToken ?? raw.jwt,
      };
      saveSession(data);
      return data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["auth_user"], user);
      toast({ title: "Welcome back!", description: `Logged in as ${user.username}` });
    },
    onError: (error: Error) => {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: RegisterPayload) => {
      // Only send what Spring Boot RegisterRequest expects
      const payload = {
        username: data.username,
        password: data.password,
        email: data.email,
        name: data.name,
        role: data.role,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let message = "Registration failed";
        try {
          const err = await res.json();
          message = err.message || err.error || message;
        } catch {}
        throw new Error(message);
      }

      // Handle both JWT response and plain user response
      const raw = await res.json();
      const user: AuthUser = {
        id: raw.id,
        username: raw.username ?? data.username,
        name: raw.name ?? data.name,
        email: raw.email ?? data.email,
        role: raw.role ?? data.role,
        token: raw.token ?? raw.accessToken ?? raw.jwt,
      };
      saveSession(user);
      return user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["auth_user"], user);
      toast({ title: "Welcome!", description: "Account created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      clearSession();
      // best-effort call to backend logout if it exists
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch {}
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth_user"], null);
      queryClient.clear();
      toast({ title: "Goodbye!", description: "Logged out successfully" });
    },
  });
}
