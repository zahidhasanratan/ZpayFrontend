import type { AuthUser, Role } from "./authSlice";

export async function fakeLogin(
  email: string,
  password: string
): Promise<{ token: string; user: AuthUser }> {
  await new Promise((r) => setTimeout(r, 500));
  // super basic: infer role by email prefix
  const role: Role = email.startsWith("agent")
    ? "agent"
    : email.startsWith("admin")
    ? "admin"
    : "user";
  return {
    token: "demo.jwt.token",
    user: { id: "u_" + role, name: role.toUpperCase() + " User", email, role },
  };
}

export async function fakeRegister(payload: {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
}) {
  await new Promise((r) => setTimeout(r, 600));
  return {
    token: "demo.jwt.token",
    user: {
      id: "u_new",
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
    },
  };
}
